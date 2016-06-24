'user strict';

const Ioc = require('adonis-fold').Ioc;
const Command = Ioc.use('Adonis/Src/Kue');

class Listen extends Command {

  static get inject () {
    return ['Adonis/Addons/Kue'];
  }

  constructor (Kue) {
    super();
    this.kue = Kue;
  }

  static get signature () {
    return '{name}';
  }

  static get description () {
    return 'Start the kue listener.';
  }

  * handle (options, flags) {
    this.kue.listen();
  }
}