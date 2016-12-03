'use strict'

class GoodJob {

  static get concurrency () {
    return 1
  }

  static get key () {
    return 'good-job'
  }

  * handle (data) {
    return 'test result'
  }

}

module.exports = GoodJob
