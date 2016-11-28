'use strict'

const util = require('../Util')
const InvalidArgumentException = require('../Exceptions/InvalidArgumentException')

class Job {

  constructor (data, options) {
    this._instantiate(data, options)
  }

  /**
   * Instantiate a new Job instance
   *
   * @param {object} options
   * @return void
   */
   _instantiate(data, options) {
    this.data = (typeof data === 'undefined') ? {} : data

     this._setPropValue('delay', options, 0)
     this._setPropValue('events', options, true)
     this._setPropValue('attempts', options, 1)
     this._setPropValue('priority', options, 'normal')
     this._setPropValue('concurrency', options, 1)
     this._setPropValue('removeOnComplete', options, true)
   }

   /**
    * Sets the default value for given property, if no value supplied
    *
    * @param {string} prop
    * @param {object} options
    * @param {mixed} defaultValue
    * @return void
    */
   _setPropValue(prop, options, defaultValue) {
     this[prop] = (typeof options === 'undefined')
                    ? defaultValue
                    : (typeof options[prop] === 'undefined')
                      ? defaultValue
                      : options[prop]
   }

   /**
    * Get data
    *
    * @return object
    */
   get data () {
     return this._data
   }

   /**
    * Set data
    *
    * @param {object} data
    * @return void
    */
   set data (data) {
     util.expectedButGot('job data', 'object', data)
     this._data = data
   }

  /**
   * Get name
   *
   * @return string
   */
  get name () {
    return this._name
  }

  /**
   * Set name`
   *
   * @param {string} name
   * @return void
   */
  set name (name) {
    util.expectedButGot('name', 'string', name)
    this._name = name
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

  enqueueEvent (name) {}

  startEvent (name) {}

  promotionEvent () {}

  progressEvent (progress, data) {}

  failedAttemptEvent (errorMessage, doneAttempts) {}

  failedEvent (errorMessage) {}

  completeEvent (result) {}

  removeEvent () {}
}

module.exports = Job
