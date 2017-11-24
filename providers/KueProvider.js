'use strict'

const path = require('path')
const { ServiceProvider } = require('@adonisjs/fold')

class KueProvider extends ServiceProvider {
  register () {
    this.app.singleton('Adonis/Addons/Kue', function (app) {
      const Helpers = app.use('Adonis/Src/Helpers')
      const Logger = app.use('Adonis/Src/Logger')
      const Config = app.use('Adonis/Src/Config')
      const Redis = app.use('Adonis/Addons/Redis')
      const Kue = require('../src/Kue')
      const { jobs } = require(path.join(Helpers.appRoot(), 'start/app.js')) || {}
      return new Kue(Logger, Redis, Config.get('kue'), jobs || [])
    })

    this.app.alias('Adonis/Addons/Kue', 'Kue')
  }
}

module.exports = KueProvider
