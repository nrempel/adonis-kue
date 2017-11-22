'use strict'

class ErrorJob {
  static get concurrency () {
    return 1
  }

  static get key () {
    return 'error-job'
  }

  async handle (data) {
    throw new Error('test error')
  }
}

module.exports = ErrorJob
