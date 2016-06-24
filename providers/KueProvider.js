'use strict';

const ServiceProvider = require('adonis-fold').ServiceProvider;

class KueProvider extends ServiceProvider {
  * register () {
    this.app.singleton('Adonis/Addons/Kue', function (app) {
      const Helpers = app.use('Adonis/Src/Helpers');
      const Config = app.use('Adonis/Src/Config');
      const Kue = require('../src/Kue');
      return new Kue(Helpers, Config);
    });
  }
}

module.exports = KueProvider;
