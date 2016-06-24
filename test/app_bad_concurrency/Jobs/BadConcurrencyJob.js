'use strict';

class BadConcurrencyJob {

  static get key() {
    return 'bad-concurrency-job';
  }

  static get concurrency() {
    return '2';
  }

  static handle(job, done) {
    done();
  }

}

module.exports = BadConcurrencyJob;
