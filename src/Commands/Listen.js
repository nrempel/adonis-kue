'user strict';

const Ioc = require('adonis-fold').Ioc;
const Command = Ioc.use('Adonis/Src/Command');

class Listen extends Command {

  constructor (Kue) {
    super();
    this.kue = Kue;
  }

  get signature () {
    return 'kue:listen';
  }

  get description () {
    return 'Start the kue listener.';
  }

  * handle (options, flags) {
    yield this.kue.listen();
  }
}

module.exports = Listen;
