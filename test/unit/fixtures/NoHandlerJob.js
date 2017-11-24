'use strict'

class NoHandlerJob {
  static get concurrency () {
    return 1
  }

  static get key () {
    return 'no-handler-job'
  }
}

module.exports = NoHandlerJob
