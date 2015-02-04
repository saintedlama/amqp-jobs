var expect = require('chai').expect;

var amqp = require('amqp');

var jobs = require('../');

describe('pubsub', function() {
  this.timeout(5000);

  it('should create a new pubsub client', function() {
    var connection = amqp.createConnection({ host: "localhost" });

    var jobsClient = jobs(connection, 'test-jobs-client');

    expect(jobsClient).to.exist;
  });

  it('should publish messages', function(done) {
    var connection = amqp.createConnection({ host: "localhost" });
    connection.on('error', function(err) { console.log(err); });

    connection.on('ready', function() {
      var job = jobs(connection, 'test-jobs-queue-worker');

      job.worker(function(msg, next) {
        next();

        expect(msg).to.deep.equal({ test : 'hello world'});
        done();
      });

      job.queue({ test : 'hello world'});
    });
  });
});