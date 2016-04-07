var request = require('supertest');
var should = require('should');

describe('Apache Solr Instance', function() {
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
});

