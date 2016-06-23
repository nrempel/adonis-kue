# Adonis Kue Provider

A [Kue](https://github.com/Automattic/kue) provider for the Adonis framework.

## Install

```
npm install --save adonis-kue-provider
```

## Configure

Register it in `bootstrap/app.js`:

```javascript
const providers = [
  'adonis-kue-provider/providers/KueProvider'
]
```
Also consider adding an alias to validation provider.

```javascript
const aliases = {
  Kue: 'Adonis/Addons/Kue'
}
```

Add a configuration file in `config/kue.js`. For example:

```javascript
'use strict';

const Env = use('Env');

module.exports = {
  prefix: 'q',
  redis: Env.get('REDIS_URL')
};

```

See the [Kue Documentation](https://github.com/Automattic/kue#redis-connection-settings) for more connection options.

## Thanks

Special thanks to the creator(s) of [AdonisJS](http://adonisjs.com/) for creating such a great framework.
