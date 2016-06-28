'use strict';

class NoConcurrencyJob {

  static get key() {
    return 'no-concurrency-job';
  }

  handle(job, done) {
    done();
  }

}

module.exports = NoConcurrencyJob;
