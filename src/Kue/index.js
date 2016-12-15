'use strict';

const co = require('co');
const fs = require('fs');
const kue = require('kue');
const path = require('path');
const CatLog = require('cat-log');
const logger = new CatLog('adonis:kue');
const Ioc = require('adonis-fold').Ioc;

/**
 * @module Kue
 * @description Interface to the Kue job queue library
 */
class Kue {
  constructor (Helpers, Config) {
    this.logger = new CatLog('adonis:kue');
    this.jobsPath = path.join(Helpers.appPath(), 'Jobs');
    this.jobsPath = path.normalize(this.jobsPath);
    this.connectionSettings = Config.get('kue.connection');
    if (!this.connectionSettings) {
      throw new Error('Specify connection under config/kue file');
    }
    this._instance = null;
    this.registeredJobs = [];
  }

  /**
   * @returns {*}
   * @public
   */
  get instance () {
    if (!this._instance) {
      this._instance = kue.createQueue(this.connectionSettings);
    }
    return this._instance;
  }

  /**
   * Dispatch a new job.
   *
   * @public
   */
  dispatch(key, data, attempts = 1) {
    if (typeof key !== 'string') {
      throw new Error(`Expected job key to be of type string but got <${typeof key}>.`);
    }
    const job = this.instance.create(key, data).attempts(attempts).removeOnComplete(true).save(err => {
       if (err) {
        this.logger.error('An error has occurred while creating a Kue job.');
        throw err;
      }
    });

    // Add promise proxy on job for complete event
    job.result = new Promise((resolve, reject) => {
      job.on('complete', result => {
        resolve(result);
      });
    });

    return job;
  }

  /**
   * Start queue to process all jobs defined in app/Jobs
   *
   * @public
   */
  listen () {
    try {
      const jobFiles = fs.readdirSync(this.jobsPath);
      jobFiles.forEach(file => {
        const filePath = path.join(this.jobsPath, file);
        try {
          const Job = require(filePath);
          
          // Get instance of job class
          const jobInstance = Ioc.make(Job);

          // Every job must expose a key
          if (!Job.key) {
            throw new Error(`No key found for job: ${filePath}`);
          }

          // If job concurrency is not set, default to 1
          if (Job.concurrency === undefined) {
            Job.concurrency = 1;
          }

          // If job concurrecny is set to an invalid value, throw error
          if (typeof Job.concurrency !== 'number') {
            throw new Error(`Job concurrency value must be a number but instead it is: <${Job.concurrency}>`);
          }

          // Every job must expose a handle function
          if (!jobInstance.handle) {
            throw new Error(`No handler found for job: ${filePath}`);
          }

          // Track currently registered jobs in memory
          this.registeredJobs.push(Job);

          // Register job handler
          this.instance.process(Job.key, Job.concurrency, function (job, done) {
            co(jobInstance.handle.bind(jobInstance), job.data)
              .then(result => { done(null, result); })
              .catch(error => {
                logger.error(
                  'Error processing job. ' +
                  `type=${job.type} id=${job.id}`
                );
                console.error(error);
                done(error);
              });
          });

          // Put failed jobs again into the queue
          if (Job.retry) {
            this.instance.on('job failed', function(id, result) {
              kue.Job.get(id, function(err, job) {
                if (!err)
                  logger.info(`Putting back into queue id=${job.id}`);
                  job.state('inactive').save();
              });
            });
          }

        } catch (e) {
          // If this file is not a valid javascript class, print warning and return
          if (e instanceof ReferenceError) {
            this.logger.warn('Unable to import job class <%s>. Is it a valid javascript class?', file);
            return;
          } else {
            this.logger.error(e);
            throw e;
          }
        }
      });
      this.logger.info('kue worker listening for %d jobs', this.registeredJobs.length);
    } catch (e) {
      // If the directory isn't found, log a message and exit gracefully
      if (e.code === 'ENOENT') {
        this.logger.info('The jobs directory <%s> does not exist. Exiting.', this.jobsPath);
      } else {
        // If it's some other error, bubble up exception
        this.logger.error(e);
        throw e;
      }
    }
  }
}

module.exports = Kue;
