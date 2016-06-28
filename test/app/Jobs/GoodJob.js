'use strict';

class GoodJob {

  static get concurrency() {
    return 1;
  }

  static get key() {
    return 'good-job';
  }

  handle(job, done) {
    done();
  }

}

module.exports = GoodJob;
