var amqp = require('amqp');
var jobs = require('../');

var connection = amqp.createConnection({ host: "localhost" });

connection.on('ready', function() {
  var job = jobs(connection, 'amqp-jobs-example');

  job.queue({ text : 'hello world' });
});