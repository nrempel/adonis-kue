'use strict';

const path = require('path');
const Kue = require('../src/Kue');
const chai = require('chai');
const expect = chai.expect;
require('co-mocha');

const Helpers = {
  appPath: function () {
    return path.join(__dirname, './app');
  }
};

const HelpersNoKey = {
  appPath: function () {
    return path.join(__dirname, './app_no_key');
  }
};

const HelpersNoHandler = {
  appPath: function () {
    return path.join(__dirname, './app_no_handler');
  }
};

const HelpersNoConcurrency = {
  appPath: function () {
    return path.join(__dirname, './app_no_concurrency');
  }
};

const HelpersBadConcurrency = {
  appPath: function () {
    return path.join(__dirname, './app_bad_concurrency');
  }
};

const HelpersNoJobs = {
  appPath: function () {
    return path.join(__dirname, './app_no_jobs');
  }
};

const HelpersBadJobFile = {
  appPath: function () {
    return path.join(__dirname, './app_bad_job_file');
  }
};

const HelpersNoJobsDir = {
  appPath: function () {
    return path.join(__dirname, './app_no_jobs_dir');
  }
};

const Config = {
  get: function () {
    return {};
  }
};

const NoConfig = {
  get: function () {
    return null;
  }
};

describe('Kue', function () {
  
  it('Should be able to dispatch jobs with data', function * () {
    this.timeout(0);
    const kue = new Kue(Helpers, Config);
    const Job = require('./app/Jobs/GoodJob');
    const data = { test: 'data' };
    const job = kue.dispatch(Job.key, data);
    expect(job.type).to.equal(Job.key);
    expect(job.data).to.equal(data);
  });

  it('Should be able to dispatch jobs with no data', function * () {
    this.timeout(0);
    const kue = new Kue(Helpers, Config);
    const Job = require('./app/Jobs/GoodJob');
    const job = kue.dispatch(Job.key);
    expect(job.type).to.equal(Job.key);
  });

  it('Should fail gracefully if dispatch is called with no key', function * () {
    this.timeout(0);
    const kue = new Kue(Helpers, Config);
    const Job = require('./app/Jobs/GoodJob');
    expect(function () { kue.dispatch() }).to.throw();
  });

  it('Should instantiate correctly', function * () {
    this.timeout(0);
    const kue = new Kue(Helpers, Config);
    expect(kue.connectionSettings).to.eql(Config.get());
    expect(kue.jobsPath).to.equal(path.join(Helpers.appPath(), 'Jobs'));
  });
  
  it('Should throw an error if no config exists', function * () {
    this.timeout(0);
    expect(function () { new Kue(Helpers, NoConfig) }).to.throw();
  });

  it('Should load jobs correctly', function * () {
    this.timeout(0);
    const kue = new Kue(Helpers, Config);
    kue.listen();
    expect(kue.instance).to.exist;
    expect(kue.registeredJobs.length).to.equal(1);
  });

  it('Should load correctly if no jobs exist', function * () {
    this.timeout(0);
    const kue = new Kue(HelpersNoJobs, Config);
    kue.listen();
    expect(kue.instance).to.exist;
    expect(kue.registeredJobs.length).to.equal(0);
  });

  it('Should fail to load gracefully if there is no jobs directory', function * () {
    this.timeout(0);
    const kue = new Kue(HelpersNoJobsDir, Config);
    kue.listen();
    expect(function () { kue.listen() }).not.to.throw();
  });

  it('Should ignore invalid job file types', function * () {
    this.timeout(0);
    const kue = new Kue(HelpersBadJobFile, Config);
    kue.listen();
    expect(function () { kue.listen() }).not.to.throw();
  });

  it('Should fail if job does not provide key', function * () {
    this.timeout(0);
    const kue = new Kue(HelpersNoHandler, Config);
    expect(function () { kue.listen() }).to.throw();
  });

  it('Should fail if job does not provide handler', function * () {
    this.timeout(0);
    const kue = new Kue(HelpersNoKey, Config);
    expect(function () { kue.listen() }).to.throw();
  });

  it('Should default concurrency to 1 if none provided', function * () {
    this.timeout(0);
    const kue = new Kue(HelpersNoConcurrency, Config);
    kue.listen();
    expect(kue.registeredJobs[0].concurrency).to.equal(1);
  });

  it('Should fail if job provides invalid concurrency', function * () {
    this.timeout(0);
    const kue = new Kue(HelpersBadConcurrency, Config);
    expect(function () { kue.listen() }).to.throw();
  });

  it('Should throw an informative error if instance.create fails', function * () {
    this.timeout(0);
    const kue = new Kue(Helpers, Config);
    const Job = require('./app/Jobs/GoodJob');
    const data = { test: 'data' };
    kue.listen();
    kue.instance.create = function () {
      return {
        removeOnComplete: function () {
          return {
            save: function (func) {
              func(new Error('test error'));
            }  
          };
        }
      };
    };

    expect(function () { kue.dispatch(Job.key, data) }).to.throw();
  });


});
