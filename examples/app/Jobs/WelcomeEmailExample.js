'use strict'

const Job = use('Job')

class WelcomeEmailJob extends Job {

  constructor (data, options) {
    super(data, options)

    this.name = 'welcome-email'
    this.concurrency = 20
    this.attempts = 3
    this.delay = 60 * 60 * 1000 // 1 hour
  }

  * handle (data) {
      // send the welcom email here
  }

  enqueueEvent (name) {
    // handle the enqueue event
  }

  startEvent (name) {
    // handle the start event
  }

  promotionEvent () {
    // handle the promotion event
  }

  progressEvent (progress, data) {
    // handle the progress event
  }

  failedAttemptEvent (errorMessage, doneAttempts) {
    // handle the failed attempt event
  }

  failedEvent (errorMessage) {
    // handle the failed event
  }

  completeEvent (result) {
    // handle the complete event
  }

  removeEvent () {
    // handle the remove event
  }

}

module.exports = VerificationEmail
