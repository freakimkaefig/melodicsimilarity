var request = require('supertest');
var should = require('should');
var path = require('path');
var exec = require('child_process').exec;

describe('Apache Solr Instance', function() {
  before(function(done) {
    this.timeout(30000);
    exec(path.join(__dirname, '../../solr/bin/solr start'), function(error, stdout, stderr) {
      if (error !== null) {
        console.log(error);
        console.log(stdout);
        console.log(stderr);
      }
    });
    done();
  });

  it('should return doc', function(done) {
    request('http://localhost:8983')
      .post('/solr/searchableDocs/query')
      .set('Accept', 'application/json')
      .send({
        params: {
          q: "signature: \"A 59440\""
        }
      })
      .end(function(err, res) {
        if (err) {
          throw err;
        }
        res.body.should.have.property('response');
        res.body.response.should.have.property('numFound');
        parseInt(res.body.response.numFound).should.be.above(0);
        done();
      });
  });

  after(function(done) {
    this.timeout(10000);
    exec(path.join(__dirname, '../../solr/bin/solr stop -all'), function(error, stdout, stderr) {
      if (error !== null) {
        console.log(error);
        console.log(stdout);
        console.log(stderr);
      }
    });
    done();
  });
});

