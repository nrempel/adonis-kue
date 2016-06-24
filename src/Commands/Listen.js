'user strict';

const Ioc = require('adonis-fold').Ioc;

class Listen {

  static get signature () {
    return '{name}';
  }

  static get description () {
    return 'Start the kue listener.';
  }

  * handle (options, flags) {
    const Kue = Ioc.use('Adonis/Addons/Kue');
    Kue.listen();
  }
}