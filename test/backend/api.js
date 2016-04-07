var request = require('supertest');
var apiConfig = require('../../config/api.config');

describe('Api', function() {
  it('should return api version as json', function(done) {
    request(process.env.BASE_URL)
      .get('/api')
      .end(function(err, res) {
        if (err) {
          throw err;
        }
        res.should.have.property('status', 200);
        res.body.should.have.property('version', apiConfig.version);
        done();
      })
  });
});