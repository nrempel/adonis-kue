'use strict'

class BadConcurrencyJob {
  static get key () {
    return 'bad-concurrency-job'
  }

  static get concurrency () {
    return '2'
  }

  async handle () {}
}

module.exports = BadConcurrencyJob
