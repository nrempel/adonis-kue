'use strict';

const ServiceProvider = require('adonis-fold').ServiceProvider;

class CommandsProvider extends ServiceProvider {
  * register () {
    this.app.bind('Adonis/Commands/Kue', function () {
      return require('../src/Commands/Listen');
    });
  }
}

module.exports = CommandsProvider;