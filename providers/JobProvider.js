'use strict'

const ServiceProvider = require('adonis-fold').ServiceProvider

class JobProvider extends ServiceProvider {
  * register () {
    this.app.singleton('Adonis/Addons/Job', function () {
      return require('../src/Job')
    })
  }
}

module.exports = JobProvider
