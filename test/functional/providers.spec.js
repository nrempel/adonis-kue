'use strict'

const path = require('path')
const test = require('japa')
const { ioc, registrar, resolver } = require('@adonisjs/fold')
const { Helpers, Config } = require('@adonisjs/sink')

test.group('Providers', group => {
  group.before(async () => {
    resolver.appNamespace('App')
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
        connection: {
          prefix: 'q',
          redis: {
            host: 'localhost',
            post: 6379
          }
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

  test('KueProvider', async assert => {
    assert.isDefined(ioc.use('Adonis/Addons/Kue'))
    assert.isTrue(ioc._bindings['Adonis/Addons/Kue'].singleton)
  })

  test('CommandsProvider', async assert => {
    assert.isDefined(ioc.use('Adonis/Commands/Kue:Listen'))
    assert.isFalse(ioc._bindings['Adonis/Commands/Kue:Listen'].singleton)
  })
})
