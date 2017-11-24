'use strict'

const { ServiceProvider } = require('@adonisjs/fold')

class CommandsProvider extends ServiceProvider {
  register () {
    this.app.bind('Adonis/Commands/Kue:Listen', () => require('../src/Commands/Listen'))
  }

  boot () {
    const ace = require('@adonisjs/ace')
    ace.addCommand('Adonis/Commands/Kue:Listen')
  }
}

module.exports = CommandsProvider
