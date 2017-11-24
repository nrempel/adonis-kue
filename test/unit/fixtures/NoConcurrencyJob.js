'use strict'

class NoConcurrencyJob {
  static get key () {
    return 'no-concurrency-job'
  }

  async handle () {}
}

module.exports = NoConcurrencyJob
