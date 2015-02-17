# amqp-pubsub
Minimalist abstraction layer for amqp jobs implementations.

Not active maintained.

## Installation

```
npm install amqp-jobs
```

## Usage

Queue work items

```javascript

var amqp = require('amqp');
var jobs = require('../');

var connection = amqp.createConnection({ host: "localhost" });

connection.on('ready', function() {
  var job = jobs(connection, 'amqp-jobs-example');

  job.queue({ text : 'hello world' });
});

```

Worker

```javascript

var amqp = require('amqp');
var jobs = require('../');

var connection = amqp.createConnection({ host: "localhost" });

connection.on('ready', function() {
  var job = jobs(connection, 'amqp-jobs-example');

  var generateError = false;

  job.worker(function(message, next) {
    // Do the work. Call next without err to acknowledge msg or pass an error do not acknowledge message
    next();
  });
});

```
