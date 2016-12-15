'use strict';

class Example {

  // If this getter isn't provided, it will default to 1.
  // Increase this number to increase processing concurrency.
  static get concurrency() {
    return 1;
  }

  // If this is set to true, all failed jobs will be re-inserted to the queue
  // Useful for random errors
  static get retry() {
    return false;
  }

  // This is required. This is a unique key used to identify this job.
  static get key() {
    return 'example-job';
  }

  // This is where the work is done. 
  *handle(data) {
    
  }

}

module.exports = Example;
