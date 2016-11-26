'use strict'

const Env = use('Env')
const Job = use('Job')
const Mail = use('Mail')
const Config = use('Config')

class WelcomeEmailJob extends Job {

  constructor () {
    super(Config)

    this.type = 'welcome-email'
    this.concurrency = 20
    this.attempts = 3
    this.delay = 60 * 60 * 1000 // 1 hour
  }

  // handle method handles the email sending
  * handle (data) {
    yield Mail.send('emails.welcome-email', data, (message) => {
      message.to(data.user.email, data.user.name)
      message.from(Env.get('DEFAULT_EMAIL'), Env.get('DEFAULT_EMAIL_NAME'))
      message.subject('Welcome to our website!')
    })
  }

  enqueueEvent (type) {
    // handle the enqueue event
  }

  startEvent (type) {
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
