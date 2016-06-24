'use strict';

const kue = require('kue');

/**
 * @module Kue
 * @description Interface to the Kue job queue library
 */
class Kue {
  constructor (Config) {
    const connectionSettings = Config.get('kue.connection');
    if (!connectionSettings) {
      throw new Error(`Specify connection under config/kue file`);
    }
    this.instance = kue.createQueue(connectionSettings);
  }

}

module.exports = Kue;
