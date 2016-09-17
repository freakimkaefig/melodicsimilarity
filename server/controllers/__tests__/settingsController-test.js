import request from 'supertest';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
jest.mock('../../services/databaseService');

describe('settingsController', () => {

  var server;
  var auth;

  beforeEach(() => {
    server = require('../../test/server-helper');
    auth = require('../../test/auth-helper');
  });

  afterEach(() => {
    server.close();
  });

  it('should get setting', (done) => {
    request(server)
      .get('/api/settings/key')
      .end((err, res) => {
        expect(err).toEqual(null);
        expect(res.status).toBe(200);
        expect(res.headers['content-type']).toMatch(/json/);
        expect(res.body.type).toBe('type');
        expect(res.body.key).toBe('key');
        expect(res.body.value).toBe('value');
        done();
      });
  });

  it('should disable set setting when unauthorized', (done) => {
    request(server)
      .put('/api/protected/settings/threshold/20')
      .end((err, res) => {
        expect(err).toEqual(null);
        expect(res.status).toBe(401);
        done();
      });
  });

  it('should allow set setting when authorized', (done) => {
    var resolve = (err, res) => {
      expect(err).toEqual(null);
      expect(res.status).toBe(200);
      expect(res.body.ok).toBe(1);
      expect(res.body.value.type).toBe('type');
      expect(res.body.value.key).toBe('key');
      expect(res.body.value.value).toBe('value');
      done();
    };

    auth.authenticatedRequest(
      server,
      request(server)
        .put('/api/protected/settings/key/value'),
      resolve);
  });

});