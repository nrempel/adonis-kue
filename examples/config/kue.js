'use strict'

const Env = use('Env')

module.exports = {

  // The folder that holds the jobs (relative to the "app/" folder)
  jobsPath: 'Jobs',

  // Kue's connection options
  connection: {
    prefix: 'q_',
    redis: {
      host: Env.get('REDIS_HOST', '127.0.0.1'),
      post: Env.get('REDIS_PORT', 6379),
    },
  },

  // Individual job default configurations
  defaults: {
    concurrency: 1,
    removeOnComplete: true,
    events: true,
    priority: 'normal',
    delay: 0,
    attempts: 1,
  },

}
