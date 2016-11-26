'use strict'

const util = require('../Util')
const InvalidArgumentException = require('../Exceptions/InvalidArgumentException')

class Job {

  constructor (Config) {
    const defaults = Config.get('kue.defaults')

    this.events = defaults.events
    this.removeOnComplete = defaults.removeOnComplete
    this.concurrency = defaults.concurrency
    this.priority = defaults.priority
    this.delay = defaults.delay
    this.attempts = defaults.attempts
  }

  /**
   * Get type
   *
   * @return string
   */
  get type () {
    return this._type
  }

  /**
   * Set type
   *
   * @param {string} type
   * @return void
   */
  set type (type) {
    util.expectedButGot('job type', 'string', type)
    this._type = type
  }

  /**
   * Get events
   *
   * @return boolean
   */
  get events () {
    return this._events
  }

  /**
   * Set events
   *
   * @param {boolean} events
   * @return void
   */
  set events (events) {
    util.expectedButGot('events', 'boolean', events)
    this._events = events
  }

  /**
   * Get removeOnComplete
   *
   * @return boolean
   */
  get removeOnComplete () {
    return this._removeOnComplete
  }

  /**
   * Set removeOnComplete
   *
   * @param {boolean} removeOnComplete
   * @return void
   */
  set removeOnComplete (removeOnComplete) {
    util.expectedButGot('removeOnComplete', 'boolean', removeOnComplete)
    this._removeOnComplete = removeOnComplete
  }

  /**
   * Get concurrency
   *
   * @return integer
   */
  get concurrency () {
    return this._concurrency
  }

  /**
   * Set concurrency
   *
   * @param {integer} concurrency
   * @return void
   */
  set concurrency (concurrency) {
    if (!Number.isInteger(concurrency) || concurrency < 1) {
      throw new InvalidArgumentException('Job concurrency must be of type \'integer\' and greater than 0.')
    }
    this._concurrency = concurrency
  }

  /**
   * Get priority
   *
   * @return string
   */
  get priority () {
    return this._priority
  }

  /**
   * Set priority
   *
   * @param {string} prirority
   * @return void
   */
  set priority (priority) {
    const validPriorities = ['low', 'normal', 'medium', 'high', 'critical']
    util.expectedButGot('priority', 'string', priority)

    if (validPriorities.indexOf(priority) === -1) {
      throw new InvalidArgumentException(`Invalid job priority provided. Valid priorities include: ${validPriorities.join(', ')}`)
    }

    this._priority = priority
  }

  /**
   * Get delay
   *
   * @return integer
   */
  get delay () {
    return this._delay
  }

  /**
   * Set delay
   *
   * @param {integer} delay
   * @return void
   */
  set delay (delay) {
    if (!Number.isInteger(delay) || delay < 0) {
      throw new InvalidArgumentException('Job delay must be of type \'integer\' and greater than -1.')
    }

    this._delay = delay
  }

  /**
   * Get attempts
   *
   * @return integer
   */
  get attempts () {
    return this._attempts
  }

  /**
   * Set attempts
   *
   * @param {integer} attempts
   * @return void
   */
  set attempts (attempts) {
    if (!Number.isInteger(attempts) || attempts < 1) {
      throw new InvalidArgumentException('Job attempts must be of type \'integer\' and greater than 0.')
    }

    this._attempts = attempts
  }

  enqueueEvent (type) {}

  startEvent (type) {}

  promotionEvent () {}

  progressEvent (progress, data) {}

  failedAttemptEvent (errorMessage, doneAttempts) {}

  failedEvent (errorMessage) {}

  completeEvent (result) {}

  removeEvent () {}
}

module.exports = Job
