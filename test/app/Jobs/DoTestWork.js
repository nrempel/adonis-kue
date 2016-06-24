'use strict';

class DoTestWork {

  static get concurrency() {
    return 1;
  }

  static get key() {
    return 'do-test-work';
  }

  static handle(job, done) {
    done();
  }

}

module.exports = DoTestWork;
