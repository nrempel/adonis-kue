# Adonis Kue Provider

A [Kue](https://github.com/Automattic/kue) provider for the Adonis framework.

This library provides an easy way to get started with an asynchronous job queue for AdonisJS.

## Install

```
npm install --save adonis-kue
```

## Configure

Register the kue provider in `start/app.js`:

```javascript
const providers = [
  ...
  'adonis-kue/providers/KueProvider'
]
```

Register the commands provider in `start/app.js`:

```javascript
const aceProviders = [
  ...
  'adonis-kue/providers/CommandsProvider'
]
```

Register the jobs in `start/app.js`:

```javascript
const jobs = [
  ...
  'App/Jobs/Example'
]
```

And then export the `jobs` array:

```js
module.exports = { providers, aceProviders, aliases, commands, jobs }
```

Add a configuration file in `config/kue.js`. For example:

```javascript
'use strict'

const Env = use('Env')

module.exports = {
  // redis connection
  connection: Env.get('KUE_CONNECTION', 'kue')
}
```

## Usage

### Command List
Command               | Description
:---------------------|:-----------
 `adonis kue:listen`  | Starting the listener
 `adonis make:job`    | Make a new Job (Queue)

### Starting the listener

Starting an instance of the kue listener is easy with the included ace command. Simply run `./ace kue:listen` or `adonis kue:listen`.

### Creating your first job


They expose the following properties:

| Name        | Required | Type      | Static | Description                                           |
|-------------|----------|-----------|--------|-------------------------------------------------------|
| concurrency | false    | number    | true   | The number of concurrent jobs the handler will accept |
| key         | true     | string    | true   | A unique key for this job                             |
| handle      | true     | function  | false  | A function that is called for this job.               |

[Here's an example.](examples/app/Jobs/Example.js)

### Dispatching jobs

Now that your job listener is running and ready to do some asynchronous work, you can start dispatching jobs.

```javascript
const kue = use('Kue')
const Job = use('App/Jobs/Example')
const data = { test: 'data' } // Data to be passed to job handle
const priority = 'normal' // Priority of job, can be low, normal, medium, high or critical
const attempts = 1 // Number of times to attempt job if it fails
const remove = true // Should jobs be automatically removed on completion
const jobFn = job => { // Function to be run on the job before it is saved
  job.backoff()
}
const job = kue.dispatch(Job.key, data, { priority, attempts, remove, jobFn })

// If you want to wait on the result, you can do this
const result = await job.result
```

## Thanks

Special thanks to the creator(s) of [AdonisJS](http://adonisjs.com/) for creating such a great framework.
