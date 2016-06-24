'use strict';

const ServiceProvider = require('adonis-fold').ServiceProvider;

class CommandsProvider extends ServiceProvider {
  * register () {
    this.app.bind('Adonis/Commands/Kue:Listen', function (app) {
      const Kue = app.use('Adonis/Addons/Kue');
      const Listen = require('../src/Commands/Listen');
      return new Listen(Kue);
    });
  }
}

module.exports = CommandsProvider;
