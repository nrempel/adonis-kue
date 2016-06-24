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

const Config = {
  get: function () {
    return {};
  }
};

describe('Kue', function () {
  
  it('Should be able to dispatch jobs', function * () {
    this.timeout(0);
    const kue = new Kue(Helpers, Config);
    const Job = require('./app/Jobs/DoTestWork');
    const data = { test: 'data' };
    const job = kue.dispatch(Job.key, data);
    expect(job.type).to.equal(Job.key);
    expect(job.data).to.equal(data);
  });

  it('Should instantiate correctly', function * () {
    this.timeout(0);
    const kue = new Kue(Helpers, Config);
    expect(kue.connectionSettings).to.eql(Config.get());
    expect(kue.jobsPath).to.equal(path.join(Helpers.appPath(), 'Jobs'));
  });
  
  it('Should load jobs correctly', function * () {
    this.timeout(0);
    const kue = new Kue(Helpers, Config);
    kue.listen();
    expect(kue.instance).to.exist;
  });

});
