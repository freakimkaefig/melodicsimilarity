import request from 'supertest';

describe('similarityController', () => {

  var server;
  var auth;

  var signature = 'A 59124';

  beforeEach(() => {
    server = require('../../test/server-helper');
    auth = require('../../test/auth-helper');
  });

  afterEach(() => {
    server.close();
  });

  it('should return all available similarity scores', (done) => {
    request(server)
      .get('/api/similarity')
      .end((err, res) => {
        expect(err).toEqual(null);
        expect(res.status).toBe(200);
        expect(res.headers['content-type']).toMatch(/json/);
        expect(res.body.length).toBeGreaterThanOrEqual(0);
        done();
      });
  });

  it('should return not found retrieving unknown songsheet', (done) => {
    request(server)
      .get('/api/similarity/null')
      .end((err, res) => {
        expect(err).toEqual(null);
        expect(res.status).toBe(404);
        expect(res.headers['content-type']).toMatch(/text\/html/);
        expect(res.error.text).toBe('Songsheet not found!');
        done();
      });
  });

  it('should return one specific similarity score', (done) => {
    request(server)
      .get('/api/similarity/' + encodeURI(signature))
      .end((err, res) => {
        expect(err).toEqual(null);
        expect(res.status).toBe(200);
        expect(res.headers['content-type']).toMatch(/json/);
        expect(res.body.signature).toBe(signature);
        expect(res.body.distances.length).toBeGreaterThan(0);
        done();
      });
  });

  it('should disable similarity update when unauthorized', (done) => {
    request(server)
      .put('/api/protected/similarity/update/' + encodeURI(signature))
      .end((err, res) => {
        expect(err).toEqual(null);
        expect(res.status).toBe(401);
        done();
      });
  });

  it('should return not found updating unknown songsheet', (done) => {
    var resolve = (err, res) => {
      expect(err).toEqual(null);
      expect(res.status).toBe(404);
      expect(res.headers['content-type']).toMatch(/text\/html/);
      expect(res.error.text).toBe('Songsheet not found!');
      done();
    };

    auth.authenticatedRequest(
      server,
      request(server)
        .put('/api/protected/similarity/update/null'),
      resolve);
  });

  it('should update similarity when authorized', (done) => {
    var resolve = (err, res) => {
      expect(err).toEqual(null);
      expect(res.status).toBe(200);
      expect(res.body.ok).toBe(1);
      expect(res.body.value).toBeDefined();
      expect(res.body.value.signature).toBe(signature);
      expect(res.body.value.distances.length).toBeGreaterThan(0);
      done();
    };

    auth.authenticatedRequest(
      server,
      request(server)
        .put('/api/protected/similarity/update/' + encodeURI(signature)),
      resolve);
  });

});