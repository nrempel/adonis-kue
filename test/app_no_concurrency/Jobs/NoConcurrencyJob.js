'use strict';

class NoConcurrencyJob {

  static get key() {
    return 'no-concurrency-job';
  }

  static handle(job, done) {
    done();
  }

}

module.exports = NoConcurrencyJob;
