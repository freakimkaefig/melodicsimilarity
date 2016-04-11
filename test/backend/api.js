var request = require('supertest');
var apiConfig = require('../../config/api.config');

describe('Api', function() {

  it('should return api version as json', function(done) {
    this.timeout(5000);
    request(process.env.BASE_URL)
      .get('api')
      .end(function(err, res) {
        if (err) {
          throw err;
        }
        res.should.have.property('status', 200);
        res.body.should.have.property('version', apiConfig.version);
        done();
      })
  });

  it('should return stored songsheets as json', function(done) {
    this.timeout(5000);
    request(process.env.BASE_URL)
      .get('api/songsheets')
      .end(function(err, res) {
        if (err) {
          throw err;
        }
        res.should.have.property('status', 200);
        res.body.should.be.a.Array();
        res.body.forEach(function(songsheet) {
          songsheet.should.have.properties([
            'abc',
            'json',
            'name',
            'signature',
            'title'
          ]);
        });
        done();
      });
  });

  it('should return stored songsheet by given signature', function(done) {
    this.timeout(5000);
    var signature = 'A 59455';
    request(process.env.BASE_URL)
      .get('api/songsheets/' + signature)
      .end(function(err, res) {
        if (err) {
          throw err;
        }
        res.should.have.property('status', 200);
        res.body.should.be.a.Object();
        res.body.should.have.property('signature', signature);
        done();
      });
  });

});