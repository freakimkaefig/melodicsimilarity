import request from 'supertest';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
jest.mock('../../services/databaseService');

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
        expect(res.body.db.key).toBe('value');
        done();
      });
  });

});