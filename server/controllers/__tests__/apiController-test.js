import request from 'supertest';

describe('apiController', () => {

  var server;

  beforeEach(() => {
    server = require('../../test/server-helper');
  });

  afterEach(() => {
    server.close();
  });

  it('should return field', (done) => {
    request(server)
      .get('/api')
      .end((err, res) => {
        expect(err).toEqual(null);
        expect(res.status).toBe(200);
        expect(res.headers['content-type']).toMatch(/json/);
        expect(res.body.version).toBeDefined();
        expect(res.body.db).toBeDefined();
        done();
      });
  });

});