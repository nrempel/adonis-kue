'use strict'

const test = require('japa')
const path = require('path')
const { ioc, registrar } = require('@adonisjs/fold')
const { setupResolver, Helpers, Config } = require('@adonisjs/sink')
const Kue = require('../../src/Kue')

const kueConfig = {
  connection: 'kue'
}

test.group('Kue', (group) => {
  group.before(async () => {
    registrar
      .providers([
        '@adonisjs/redis/providers/RedisProvider'
      ])
      .register()
    ioc.bind('Adonis/Src/Helpers', () => {
      return new Helpers(path.join(__dirname, '..'))
    })
    ioc.alias('Adonis/Src/Helpers', 'Helpers')
    ioc.bind('Adonis/Src/Config', () => {
      const config = new Config()
      config.set('redis', {
        connection: 'local',
        local: {
          host: '127.0.0.1',
          port: 6379,
          db: 0,
          keyPrefix: ''
        },
        kue: {
          host: '127.0.0.1',
          port: 6379,
          db: 0,
          keyPrefix: 'q'
        }
      })
      return config
    })
    ioc.alias('Adonis/Src/Config', 'Config')
    await registrar.boot()
    setupResolver()
  })

  group.beforeEach(() => {
    ioc.restore()
  })

  test('Should be able to dispatch jobs with data', (assert) => {
    ioc.bind('Test/Jobs/GoodJob', () => require('./fixtures/GoodJob'))
    const kue = new Kue(console, ioc.use('Redis'), kueConfig, [
      'Test/Jobs/GoodJob'
    ])
    const Job = ioc.use('Test/Jobs/GoodJob')
    const data = { test: 'data' }
    const job = kue.dispatch(Job.key, data)
    assert.equal(job.type, Job.key)
    assert.equal(job.data, data)
  })

  test('Should be able to dispatch jobs with default priority', (assert) => {
    ioc.bind('Test/Jobs/GoodJob', () => require('./fixtures/GoodJob'))
    const kue = new Kue(console, ioc.use('Redis'), kueConfig, [
      'Test/Jobs/GoodJob'
    ])
    const Job = ioc.use('Test/Jobs/GoodJob')
    const data = { test: 'data' }
    const job = kue.dispatch(Job.key, data)
    assert.equal(job.type, Job.key)
    assert.equal(job.data, data)
    assert.equal(job._priority, 0)
  })

  test('Should be able to dispatch jobs with a priority', (assert) => {
    ioc.bind('Test/Jobs/GoodJob', () => require('./fixtures/GoodJob'))
    const kue = new Kue(console, ioc.use('Redis'), kueConfig, [
      'Test/Jobs/GoodJob'
    ])
    const Job = ioc.use('Test/Jobs/GoodJob')
    const data = { test: 'data' }
    const priority = 'high'
    const job = kue.dispatch(Job.key, data, { priority })
    assert.equal(job.type, Job.key)
    assert.equal(job.data, data)
    assert.equal(job._priority, -10)
  })

  test('Should be able to dispatch jobs with default max attempts limit', (assert) => {
    ioc.bind('Test/Jobs/GoodJob', () => require('./fixtures/GoodJob'))
    const kue = new Kue(console, ioc.use('Redis'), kueConfig, [
      'Test/Jobs/GoodJob'
    ])
    const Job = ioc.use('Test/Jobs/GoodJob')
    const data = { test: 'data' }
    const job = kue.dispatch(Job.key, data)
    assert.equal(job.type, Job.key)
    assert.equal(job.data, data)
    assert.equal(job._max_attempts, 1)
  })

  test('Should be able to dispatch jobs with a max attempts limit', (assert) => {
    ioc.bind('Test/Jobs/GoodJob', () => require('./fixtures/GoodJob'))
    const kue = new Kue(console, ioc.use('Redis'), kueConfig, [
      'Test/Jobs/GoodJob'
    ])
    const Job = ioc.use('Test/Jobs/GoodJob')
    const data = { test: 'data' }
    const attempts = 5
    const job = kue.dispatch(Job.key, data, { attempts })
    assert.equal(job.type, Job.key)
    assert.equal(job.data, data)
    assert.equal(job._max_attempts, attempts)
  })

  test('Should be able to dispatch jobs with default removeOnComplete', (assert) => {
    ioc.bind('Test/Jobs/GoodJob', () => require('./fixtures/GoodJob'))
    const kue = new Kue(console, ioc.use('Redis'), kueConfig, [
      'Test/Jobs/GoodJob'
    ])
    const Job = ioc.use('Test/Jobs/GoodJob')
    const data = { test: 'data' }
    const job = kue.dispatch(Job.key, data)
    assert.equal(job.type, Job.key)
    assert.equal(job.data, data)
    assert.equal(job._removeOnComplete, true)
  })

  test('Should be able to dispatch jobs with a configured removeOnComplete', (assert) => {
    ioc.bind('Test/Jobs/GoodJob', () => require('./fixtures/GoodJob'))
    const kue = new Kue(console, ioc.use('Redis'), kueConfig, [
      'Test/Jobs/GoodJob'
    ])
    const Job = ioc.use('Test/Jobs/GoodJob')
    const data = { test: 'data' }
    const job = kue.dispatch(Job.key, data, { remove: false })
    assert.equal(job.type, Job.key)
    assert.equal(job.data, data)
    assert.equal(job._removeOnComplete, false)
  })

  test('Should handle extra job functions', (assert) => {
    ioc.bind('Test/Jobs/GoodJob', () => require('./fixtures/GoodJob'))
    const kue = new Kue(console, ioc.use('Redis'), kueConfig, [
      'Test/Jobs/GoodJob'
    ])
    const Job = ioc.use('Test/Jobs/GoodJob')
    const data = { test: 'data' }
    const job = kue.dispatch(Job.key, data, {
      attempts: 1, // configure a base attempts
      jobFn: job => {
        // override it using the jobFn
        job.attempts(5)
      }
    })
    assert.equal(job.type, Job.key)
    assert.equal(job.data, data)
    assert.equal(job._max_attempts, 5)
  })

  test('Should be able to wait on result of job', async (assert) => {
    ioc.bind('Test/Jobs/GoodJob', () => require('./fixtures/GoodJob'))
    const kue = new Kue(console, ioc.use('Redis'), kueConfig, [
      'Test/Jobs/GoodJob'
    ])
    const Job = ioc.use('Test/Jobs/GoodJob')
    kue.listen()
    const data = { test: 'data' }
    const job = kue.dispatch(Job.key, data)
    const result = await job.result
    assert.equal(result, 'test result')
    assert.equal(job.type, Job.key)
    assert.equal(job.data, data)
  })

  test('Should be able to dispatch jobs with no data', (assert) => {
    ioc.bind('Test/Jobs/GoodJob', () => require('./fixtures/GoodJob'))
    const kue = new Kue(console, ioc.use('Redis'), kueConfig, [
      'Test/Jobs/GoodJob'
    ])
    const Job = ioc.use('Test/Jobs/GoodJob')
    const job = kue.dispatch(Job.key)
    assert.equal(job.type, Job.key)
  })

  test('Should fail gracefully if dispatch is called with no key', (assert) => {
    const kue = new Kue(console, ioc.use('Redis'), kueConfig)
    try {
      kue.dispatch()
    } catch ({ message }) {
      assert.equal(message, 'Expected job key to be of type string but got <undefined>.')
    }
  })

  test('Should fail gracefully if handler throws an error', (assert) => {
    ioc.bind('Test/Jobs/ErrorJob', () => require('./fixtures/ErrorJob'))
    const kue = new Kue(console, ioc.use('Redis'), kueConfig, [
      'Test/Jobs/ErrorJob'
    ])
    const Job = ioc.use('Test/Jobs/ErrorJob')
    kue.listen()
    const data = { test: 'data' }
    const job = kue.dispatch(Job.key, data)
    assert.equal(job.type, Job.key)
    assert.equal(job.data, data)
  })

  test('Should instantiate correctly', (assert) => {
    ioc.bind('Test/Jobs/GoodJob', () => require('./fixtures/GoodJob'))
    const jobs = [
      'Test/Jobs/GoodJob'
    ]
    const kue = new Kue(console, ioc.use('Redis'), kueConfig, jobs)
    assert.deepEqual(kue.config.connection, kueConfig.connection)
    assert.equal(kue.jobs, jobs)
  })

  test('Should load jobs correctly', (assert) => {
    ioc.bind('Test/Jobs/GoodJob', () => require('./fixtures/GoodJob'))
    const kue = new Kue(console, ioc.use('Redis'), kueConfig, [
      'Test/Jobs/GoodJob'
    ])
    kue.listen()
    assert.isOk(kue.instance)
    assert.equal(kue.registeredJobs.length, 1)
  })

  test('Should load correctly if no jobs exist', (assert) => {
    const kue = new Kue(console, ioc.use('Redis'), kueConfig)
    kue.listen()
    assert.isOk(kue.instance)
    assert.equal(kue.registeredJobs.length, 0)
  })

  test('Should fail if job does not provide handler', (assert) => {
    ioc.bind('Test/Jobs/NoHandlerJob', () => require('./fixtures/NoHandlerJob'))
    const kue = new Kue(console, ioc.use('Redis'), kueConfig, [
      'Test/Jobs/NoHandlerJob'
    ])
    try {
      kue.listen()
    } catch ({ message }) {
      assert.equal(message, 'No handler found for job: Test/Jobs/NoHandlerJob')
    }
  })

  test('Should fail if job does not provide key', (assert) => {
    ioc.bind('Test/Jobs/NoKeyJob', () => require('./fixtures/NoKeyJob'))
    const kue = new Kue(console, ioc.use('Redis'), kueConfig, [
      'Test/Jobs/NoKeyJob'
    ])
    try {
      kue.listen()
    } catch ({ message }) {
      assert.equal(message, 'No key found for job: Test/Jobs/NoKeyJob')
    }
  })

  test('Should default concurrency to 1 if none provided', (assert) => {
    ioc.bind('Test/Jobs/NoConcurrencyJob', () => require('./fixtures/NoConcurrencyJob'))
    const kue = new Kue(console, ioc.use('Redis'), kueConfig, [
      'Test/Jobs/NoConcurrencyJob'
    ])
    kue.listen()
    assert.equal(kue.registeredJobs[0].concurrency, 1)
  })

  test('Should fail if job provides invalid concurrency', (assert) => {
    ioc.bind('Test/Jobs/BadConcurrencyJob', () => require('./fixtures/BadConcurrencyJob'))
    const kue = new Kue(console, ioc.use('Redis'), kueConfig, [
      'Test/Jobs/BadConcurrencyJob'
    ])
    try {
      kue.listen()
    } catch ({ message }) {
      assert.equal(message, 'Job concurrency value must be a number but instead it is: <string>')
    }
  })

  test('Should throw an informative error if instance.create fails', (assert) => {
    ioc.bind('Test/Jobs/GoodJob', () => require('./fixtures/GoodJob'))
    const kue = new Kue(console, ioc.use('Redis'), kueConfig, [
      'Test/Jobs/GoodJob'
    ])
    const Job = ioc.use('Test/Jobs/GoodJob')
    const data = { test: 'data' }
    kue.listen()
    kue.instance.save = (func) => {
      func(new Error('test error'))
    }

    try {
      kue.dispatch(Job.key, data)
    } catch ({ message }) {
      assert.equal(message, 'test error')
    }
  })
})
