'use strict'

const { ServiceProvider } = require('@adonisjs/fold')

class CommandsProvider extends ServiceProvider {
  register () {
    this.app.bind('Adonis/Commands/Kue:Listen', () => require('../src/Commands/Listen'))
    this.app.bind('Adonis/Commands/Make:Job', () => require('../src/Commands/MakeJob'))
  }

  boot () {
    const ace = require('@adonisjs/ace')
    ace.addCommand('Adonis/Commands/Kue:Listen')
    ace.addCommand('Adonis/Commands/Make:Job')
  }
}

module.exports = CommandsProvider
