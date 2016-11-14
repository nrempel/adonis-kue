# Adonis Kue Provider

A [Kue](https://github.com/Automattic/kue) provider for the Adonis framework.

This library provides an easy way to get started with an asynchronous job queue for AdonisJS.

## Install

```
npm install --save adonis-kue
```

## Configure

Register it in `bootstrap/app.js`:

```javascript
const providers = [
  ...
  'adonis-kue/providers/KueProvider'
]
```

Also consider adding an alias to validation provider.

```javascript
const aliases = {
  ...
  Kue: 'Adonis/Addons/Kue'
}
```

Register the commands:

```javascript
const aceProviders = [
  ...
  'adonis-kue/providers/CommandsProvider'
];

...

const commands = [
  ...
  'Adonis/Commands/Kue:Listen'
];
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

## Usage

### Starting the listener

Starting an instance of the kue listener is easy with the included ace command. Simply run `./ace kue:listen`.

The provider looks for jobs in the `app/Jobs` directory of your AdonisJS project and will automatically register a handler for any jobs that it finds.

### Creating your first job

Jobs are easy to create. They live in `app/Jobs` and they are a simple class. They expose the following properties:

| Name        | Required | Type      | Static | Description                                           |
|-------------|----------|-----------|--------|-----------------------------------------------|
| concurrency | false    | number    | true   | The number of concurrent jobs the handler will accept |
| key         | true     | string    | true   | A unique key for this job                             |
| handle      | true     | function  | false  | A function that is called for this job.               |

[Here's an example.](examples/app/Jobs/Example.js)

### Dispatching jobs

Now that your job listener is running and ready to do some asynchronous work, you can start dispatching jobs. 

```javascript
const kue = use('Kue');
const Job = require('./app/Jobs/Example');
const data = { test: 'data' };
const job = kue.dispatch(Job.key, data);

// If you want to wait on the result, you can do this
const result = yield job.result;
```

## Thanks

Special thanks to the creator(s) of [AdonisJS](http://adonisjs.com/) for creating such a great framework.
