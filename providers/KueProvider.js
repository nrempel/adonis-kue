'use strict';

const ServiceProvider = require('adonis-fold').ServiceProvider;

class KueProvider extends ServiceProvider {
  * register () {
    this.app.singleton('Adonis/Addons/Kue', function (app) {
      const Config = app.use('Adonis/Src/Config');
      const Kue = require('../src/Kue');
      return new Kue(Config);
    });
  }
}

module.exports = KueProvider;
