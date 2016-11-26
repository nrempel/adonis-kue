'use strict'

const path = require('path')
const InvalidArgumentException = require('../Exceptions/InvalidArgumentException')

module.exports = {

  /**
   * Get the path to the jobs folder
   *
   * @param {object} Adonis/Src/Helpers
   * @param {object} Adonis/Src/Config
   * @return string
   */
  getJobPath (Helpers, Config) {
    const configPath = Config.get('kue.jobsPath')
    module.exports.expectedButGot('jobsPath', 'string', configPath)
    const jobsPath = path.join(Helpers.appPath(), configPath)

    return path.normalize(jobsPath)
  },

  /**
   * Get the Kue connection settings
   *
   * @param {object} Adonis/Src/Config
   * @return object
   */
  getKueConnectionOptions (Config) {
    const connectionSettings = Config.get('kue.connection')
    module.exports.expectedButGot('kue.connection', 'object', connectionSettings)

    return connectionSettings
  },

  /**
   * Checks a value for an expected type
   *
   * @param {string} paramName
   * @param {string} expectedType
   * @param {mixed} value
   * @throws InvalidArgumentException
   * @return void
   */
  expectedButGot (paramName, expectedType, value) {
    const valueType = typeof value
    if (valueType !== expectedType) {
      throw new InvalidArgumentException(`Expected ${paramName} to be of type '${expectedType}' but got '${valueType}'.`)
    }
  },
}
