'use strict'

const co = require('co')
const fs = require('fs')
const kue = require('kue')
const path = require('path')
const util = require('../Util')
const CatLog = require('cat-log')
const logger = new CatLog('adonis:kue')
const InvalidArgumentException = require('../Exceptions/InvalidArgumentException')

/**
 * @module Kue
 * @description Interface to the Kue job queue library
 */
class Kue {

  constructor (Helpers, Config) {
    this.logger = new CatLog('adonis:kue')
    this.jobsPath = util.getJobPath(Helpers, Config)
    this.connectionSettings = util.getKueConnectionOptions(Config)
    this._instance = null
    this.registeredJobs = []
  }

  /**
   * @returns {*}
   * @public
   */
  get instance () {
    if (!this._instance) {
      this._instance = kue.createQueue(this.connectionSettings)
    }
    return this._instance
  }

  /**
   * Dispatch a new job.
   *
   * @public
   */
  dispatch (Job, data) {
    const job = this.instance
      .create(Job.type, data)
      .delay(Job.delay)
      .events(Job.events)
      .priority(Job.priority)
      .attempts(Job.attempts)
      .removeOnComplete(Job.removeOnComplete)
      .save((err) => {
        if (err) {
          this.logger.error('An error has occurred while creating a Kue job.')
          throw err
        }
      })

    // Add promise proxy on job for all events, if events are enabled
    if (Job.events) {
      job.result = new Promise((resolve, reject) => {
        job
          .on('enqueue', Job.enqueueEvent)
          .on('start', Job.startEvent)
          .on('promotion', Job.promotionEvent)
          .on('progress', Job.progressEvent)
          .on('failed attempt', Job.failedAttemptEvent)
          .on('failed', Job.failedEvent)
          .on('complete', (result) => {
            Job.completeEvent(result)
            resolve(result)
          })
      })
    }

    return job
  }

  /**
   * Start queue to process all jobs defined in app/Jobs
   *
   * @public
   */
  listen () {
    try {
      const jobFiles = fs.readdirSync(this.jobsPath)
      jobFiles.forEach((file) => {
        const filePath = path.join(this.jobsPath, file)
        try {
          const Job = require(filePath)

          // Get instance of job class
          const jobInstance = new Job()

          // Every job must expose a type
          if (!jobInstance.type) {
            throw new InvalidArgumentException(`No type found for job: ${filePath}`)
          }

          // Every job must expose a handle function
          if (!jobInstance.handle) {
            throw new InvalidArgumentException(`No handler found for job: ${filePath}`)
          }

          // Track currently registered jobs in memory
          this.registeredJobs.push(Job)

          // Register job handler
          this.instance.process(jobInstance.type, jobInstance.concurrency, function (job, done) {
            co(jobInstance.handle.bind(jobInstance), job.data)
              .then((result) => {
                done(null, result)
              })
              .catch((error) => {
                logger.error(`Error processing job.\rtype=${job.type} id=${job.id}`)
                console.error(error)
                done(error)
              })
          })
        } catch (e) {
          // If this file is not a valid javascript class, print warning and return
          if (e instanceof ReferenceError) {
            this.logger.warn('Unable to import job class <%s>. Is it a valid javascript class?', file)
          } else {
            this.logger.error(e)
            throw e
          }
        }
      })
      this.logger.info('kue worker listening for %d jobs', this.registeredJobs.length)
    } catch (e) {
      // If the directory isn't found, log a message and exit gracefully
      if (e.code === 'ENOENT') {
        this.logger.info('The jobs directory <%s> does not exist. Exiting.', this.jobsPath)
      } else {
        // If it's some other error, bubble up exception
        this.logger.error(e)
        throw e
      }
    }
  }
}

module.exports = Kue
