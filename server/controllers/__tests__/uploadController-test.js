import request from 'supertest';

jest.mock('../../services/storageService');

describe('uploadController', () => {

  var server;
  var auth;

  beforeEach(() => {
    server = require('../../test/server-helper');
    auth = require('../../test/auth-helper');
  });

  afterEach(() => {
    server.close();
  });

  it('should disable upload when unauthorized', (done) => {
    request(server)
      .put('/api/protected/scan/add')
      .end((err, res) => {
        expect(err).toEqual(null);
        expect(res.status).toBe(401);
        done();
      });
  });

  it('should abort when no image', () => {
    var resolve = (err, res) => {
      expect(err).toEqual(null);
      expect(res.status).toBe(500);
      expect(res.headers['content-type']).toMatch(/text\/html/);
      expect(res.error.text).toBe('No image');
      done();
    };

    auth.authenticatedRequest(
      server,
      request(server)
        .put('/api/protected/scan/add')
        .set('Content-Type', 'application/json')
        .send({test: 'test'}),
      resolve);
  });

});