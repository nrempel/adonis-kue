'use strict'

const test = require('japa')
const path = require('path')
const ace = require('@adonisjs/ace')
const { ioc, registrar, resolver } = require('@adonisjs/fold')
const { Helpers, Config } = require('@adonisjs/sink')
const fs = require('fs')

test.group('Commands', group => {
  group.before(async () => {
    resolver.appNamespace('App')
    ioc.autoload(path.join(__dirname, './app'), 'App')
    registrar
      .providers([
        '@adonisjs/framework/providers/AppProvider',
        '@adonisjs/redis/providers/RedisProvider',
        path.join(__dirname, '../../providers/KueProvider'),
        path.join(__dirname, '../../providers/CommandsProvider')
      ])
      .register()
    ioc.bind('Adonis/Src/Helpers', () => {
      return new Helpers(__dirname)
    })
    ioc.alias('Adonis/Src/Helpers', 'Helpers')
    ioc.bind('Adonis/Src/Config', () => {
      const config = new Config()
      config.set('kue', {
        connection: 'kue'
      })
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
      config.set('app', {
        logger: {
          transport: 'console',
          console: {
            driver: 'console'
          }
        }
      })
      return config
    })
    ioc.alias('Adonis/Src/Config', 'Config')
    await registrar.boot()
  })

  group.beforeEach(() => {
    ioc.restore()
  })

  test('kue:listen', async assert => {
    const Kue = use('Adonis/Addons/Kue')
    const Job = ioc.use('App/GoodJob')
    await ace.call('kue:listen')
    const data = { test: 'data' }
    const job = Kue.dispatch(Job.key, data)
    const result = await job.result
    assert.equal(result, 'test result')
    assert.equal(job.type, Job.key)
    assert.equal(job.data, data)
  })

  test('Create a job', async assert => {
    await ace.call('make:job', { name: 'Test' })
    assert.isTrue(
      fs.existsSync(path.join(__dirname, '../../app/Jobs/Test.js'))
    )
  })

  test('Create a job with the same name', async assert => {
    await ace.call('make:job', { name: 'Test' })
    const filePath = path.join(__dirname, '../../app/Jobs/Test.js')
    assert.isTrue(fs.existsSync(filePath))
    fs.unlinkSync(filePath)
  })
})
