'use strict'

class GoodJob {
  static get concurrency () {
    return 1
  }

  static get key () {
    return 'good-job'
  }

  async handle () {
    return 'test result'
  }
}

module.exports = GoodJob
