'use strict'

const Env = use('Env')

module.exports = {
  connection: {
    prefix: 'kue_',
    redis: {
      host: Env.get('REDIS_HOST', '127.0.0.1'),
      post: Env.get('REDIS_PORT', 6379)
    }
  }
}
