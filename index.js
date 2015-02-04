var amqp = require('amqp');
var debug = require('debug')('amqp:jobs');

var Jobs = function(connection, queueName) {
  this.connection = connection;
  this.queueName = queueName;
};

Jobs.prototype.queue = function(job) {
  var self = this;

  self.connection.exchange(self.queueName, { type: 'direct', durable : true, autoDelete :false }, function(exchange) {
    debug('Jobs exchange "%s" established for queueing jobs', self.queueName);

    exchange.publish('', JSON.stringify(job));

    debug('Queued job to exchange "%s"', self.queueName);
  });
};

Jobs.prototype.worker = function(worker) {
  var self = this;

  self.connection.exchange(self.queueName, { type: 'direct', durable : true, autoDelete : false }, function(exchange) {
    debug('Jobs exchange "%s" established for jobs worker', self.queueName);

    self.connection.queue(self.queueName, { durable : true, autoDelete : false }, function(queue) {
      debug('Created queue "%s" to receive jobs', self.queueName);

      queue.bind(exchange, '');
      queue.subscribe({ ack: true, prefetchCount: 1 }, function (message, headers, deliveryInfo, ack) {
        var msg = JSON.parse(message.data);

        debug('Received message "%j" via exchange %s. Delegating parsed JSON to worker', msg, self.queueName);

        worker(msg, function(err) {
          if (!err) {
            debug('Worker executed job successfully. Message is acknowledged');

            ack.acknowledge();
          } else {
            debug('Worker answered with error %s. Message is not acknowledged', err);

            ack.reject(deliveryInfo.redelivered?false:true);
          }
        });
      });
    });
  });
};


module.exports = function(connection, exchange) {
  return new Jobs(connection, exchange);
};