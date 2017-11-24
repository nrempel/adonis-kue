'use strict'

class NoKeyJob {
  static get concurrency () {
    return 1
  }

  handle () {}
}

module.exports = NoKeyJob
