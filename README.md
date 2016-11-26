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
  'adonis-kue/providers/JobProvider'
]
```

Also consider adding an alias to validation provider.

```javascript
const aliases = {
  ...
  Kue: 'Adonis/Addons/Kue'
  Job: 'Adonis/Addons/Job'
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

Add a configuration file in `config/kue.js` and copy over the [example configurations](examples/config/kue.js).

See the [Kue Documentation](https://github.com/Automattic/kue#redis-connection-settings) for more connection options.

## Usage

### Starting the listener

Starting an instance of the kue listener is easy with the included ace command. Simply run `./ace kue:listen`.

The provider looks for jobs in the jobs folder you specify in `config/kue.js` and will automatically register a handler for any jobs that it finds.

### Creating Jobs

Jobs are easy to create. They accept two arguements: `data` and `options`.

| Name             | Required | Type      | Default      | Description                                                                   |
|------------------|----------|-----------|--------------|-------------------------------------------------------------------------------|
| name             | true     | string    | (no default) | A unique job name (eg. `my-email-job`)                                   |
| concurrency      | false    | number    | 1            | The number of concurrent jobs the handler will accept                         |
| removeOnComplete | false    | boolean   | true         | Whether or not jobs will be removed from the queue upon completion?           |
| events           | false    | boolean   | true         | Enable/disable the firing of events for a job                                 |
| priority         | false    | string    | normal       | Job priority. Options include: `low`, `normal`, `medium`, `high`, `critical`  |
| delay            | false    | number    | 0            | The delay (in milliseconds) before a job is queued                            |
| attempts         | false    | number    | 1            | The number of tries that should take place before a job is marked as failed.  |

Job options can either be specified when instaniating the job with `const job = new Job(data, options)`, or can simply added to the job class itself ([see the example.](examples/app/Jobs/WelcomEmailExample.js)).

### Handling Jobs

Each job created must include a `handle` generator function. This is where you can specify what action(s) the job should take.

[See the example.](examples/app/Jobs/WelcomEmailExample.js)

### Handling Job Events

There are 8 event methods that are executed upon Kue firing their corresponding events. These methods should exist inside your job file if you want to intercept each event.

| Method Name           | Event Name      | Required | Description                                                  |
|-----------------------|-----------------|----------|--------------------------------------------------------------|
| enqueueEvent          | enqueue         | false    | Fired when the job is queued                                 |
| startEvent            | start           | false    | Fired when the job starts running                            |
| promotionEvent        | promotion       | false    | Fired when the job is promoted from delayed state to queued  |
| progressEvent         | progress        | false    | Periodically fired for long-running jobs                     |
| failedAttemptEvent    | failed attempt  | false    | Fired when a job attempt fails                               |
| failedEvent           | failed          | false    | Fired when a job has been not been successful                |
| completeEvent         | complete        | false    | Fired when the job has been completed                        |
| removeEvent           | remove          | false    | Fired when the job has been removed from the queue           |

[See the example.](examples/app/Jobs/WelcomEmailExample.js)

### Dispatching jobs

Once your job listener is running and ready to do some asynchronous work, you can start dispatching jobs.

```javascript
const Kue = use('Kue')
const Job = use('App/Jobs/WelcomEmailExample')

const data = {name: 'John Doe', email: 'john@example.com' }
const job = Kue.dispatch(new Job(data))

// If you want to wait on the result, you can do this
const result = yield job.result;
```

## License

Distributed under the [MIT](LICENSE) license.

## Thanks

Special thanks to the creator(s) of [AdonisJS](http://adonisjs.com/) for creating such a great framework.
