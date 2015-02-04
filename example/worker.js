var amqp = require('amqp');
var jobs = require('../');

var connection = amqp.createConnection({ host: "localhost" });

connection.on('ready', function() {
  var job = jobs(connection, 'amqp-jobs-example');

  var generateError = false;

  job.worker(function(message, next) {
    if (generateError) {
      generateError = false;
      next(new Error('I was told to generate an err!'));
    } else {
      generateError = true;
      next();
    }
  });
});