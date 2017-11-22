'user strict'

const { Command } = require('@adonisjs/ace')

class Listen extends Command {
  static get inject () {
    return [
      'Adonis/Addons/Kue'
    ]
  }

  constructor (Kue) {
    super()
    this.Kue = Kue
  }

  static get signature () {
    return 'kue:listen'
  }

  static get description () {
    return 'Start the kue listener.'
  }

  handle () {
    return this.Kue.listen()
  }
}

module.exports = Listen
