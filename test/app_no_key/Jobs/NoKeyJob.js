'use strict';

class NoKeyJob {

  static get concurrency() {
    return 1;
  }

  static handle(job, done) {
    done();
  }

}

module.exports = NoKeyJob;
