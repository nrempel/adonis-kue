'user strict';

class Listen {

  static get inject () {
    return ["Adonis/Addons/Kue"]
  }

  constructor (Kue) {
    this.kue = Kue
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