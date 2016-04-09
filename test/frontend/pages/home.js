var request = require('supertest');
var should = require('should');

describe('Home', function() {
  it('should return home page when navigating', function (done) {
    request(process.env.BASE_URL)
      .get('/')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .end(function (err, res) {
        if (err) {
          throw err;
        }
        res.should.have.property('status', 200);
        var title = res.text.match(/<title[^>]*>([^<]+)<\/title>/)[1];
        should(title).be.equal('Main');
        done();
      });
  });
});