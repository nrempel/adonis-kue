'use strict';

module.exports = {
  removeOnComplete: true,
  connection: {
    prefix: 'q',
    redis: {
      host: 'localhost',
      post: 6379
    }
  }
};
