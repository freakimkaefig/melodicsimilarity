import request from 'supertest';

jest.mock('../../services/databaseService');

describe('statisticController', () => {

  var server;
  var auth;

  beforeEach(() => {
    server = require('../../test/server-helper');
    auth = require('../../test/auth-helper');
  });

  afterEach(() => {
    server.close();
  });

  it('should return not found for unavailable mode', (done) => {
    request(server)
      .get('/api/index/null')
      .end((err, res) => {
        expect(err).toEqual(null);
        expect(res.status).toBe(404);
        expect(res.error.text).toBe('Mode not available!');
        done();
      });
  });

  it('should return statistics by mode', (done) => {
    request(server)
      .get('/api/index/notes')
      .end((err, res) => {
        expect(err).toEqual(null);
        expect(res.status).toBe(200);
        expect(res.headers['content-type']).toMatch(/json/);
        expect(res.body.mode).toBe('notes');
        expect(res.body.data.labels.length).toBe(3);
        expect(res.body.data.values.length).toBe(3);
        done();
      });
  });

  it('should disable statistics update when unauthorized', (done) => {
    request(server)
      .put('/api/protected/index/update/notes')
      .end((err, res) => {
        expect(err).toEqual(null);
        expect(res.status).toBe(401);
        done();
      });
  });

  it('should return not found when updating unavailable mode', (done) => {
    var resolve = (err, res) => {
      expect(err).toEqual(null);
      expect(res.status).toBe(404);
      expect(res.headers['content-type']).toMatch(/text\/html/);
      expect(res.error.text).toBe('Mode not available!');
      done();
    };

    auth.authenticatedRequest(
      server,
      request(server)
        .put('/api/protected/index/update/null'),
      resolve);
  });

  it('should update stats for mode notes', (done) => {
    var resolve = (err, res) => {
      expect(err).toEqual(null);
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toMatch(/json/);
      expect(res.body.ok).toBe(1);
      expect(res.body.value.mode).toBe('notes');
      expect(res.body.value.data.labels.length).toBe(3);
      expect(res.body.value.data.values.length).toBe(3);
      done();
    };

    auth.authenticatedRequest(
      server,
      request(server)
        .put('/api/protected/index/update/notes'),
      resolve);
  });

  it('should update stats for mode intervals', (done) => {
    var resolve = (err, res) => {
      expect(err).toEqual(null);
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toMatch(/json/);
      expect(res.body.ok).toBe(1);
      expect(res.body.value.mode).toBe('intervals');
      expect(res.body.value.data.labels.length).toBe(3);
      expect(res.body.value.data.values.length).toBe(3);
      done();
    };

    auth.authenticatedRequest(
      server,
      request(server)
        .put('/api/protected/index/update/intervals'),
      resolve);
  });

  it('should update stats for mode durations', (done) => {
    var resolve = (err, res) => {
      expect(err).toEqual(null);
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toMatch(/json/);
      expect(res.body.ok).toBe(1);
      expect(res.body.value.mode).toBe('durations');
      expect(res.body.value.data.labels.length).toBe(3);
      expect(res.body.value.data.values.length).toBe(3);
      done();
    };

    auth.authenticatedRequest(
      server,
      request(server)
        .put('/api/protected/index/update/durations'),
      resolve);
  });

  it('should update stats for mode keys', (done) => {
    var resolve = (err, res) => {
      expect(err).toEqual(null);
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toMatch(/json/);
      expect(res.body.ok).toBe(1);
      expect(res.body.value.mode).toBe('keys');
      expect(res.body.value.data.labels.length).toBe(3);
      expect(res.body.value.data.values.length).toBe(3);
      done();
    };

    auth.authenticatedRequest(
      server,
      request(server)
        .put('/api/protected/index/update/keys'),
      resolve);
  });

  it('should update stats for mode rests', (done) => {
    var resolve = (err, res) => {
      expect(err).toEqual(null);
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toMatch(/json/);
      expect(res.body.ok).toBe(1);
      expect(res.body.value.mode).toBe('rests');
      expect(res.body.value.data.labels.length).toBe(3);
      expect(res.body.value.data.values.length).toBe(3);
      done();
    };

    auth.authenticatedRequest(
      server,
      request(server)
        .put('/api/protected/index/update/rests'),
      resolve);
  });

  it('should update stats for mode meters', (done) => {
    var resolve = (err, res) => {
      expect(err).toEqual(null);
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toMatch(/json/);
      expect(res.body.ok).toBe(1);
      expect(res.body.value.mode).toBe('meters');
      expect(res.body.value.data.labels.length).toBe(3);
      expect(res.body.value.data.values.length).toBe(3);
      done();
    };

    auth.authenticatedRequest(
      server,
      request(server)
        .put('/api/protected/index/update/meters'),
      resolve);
  });

  it('should update stats for mode counts', (done) => {
    var resolve = (err, res) => {
      expect(err).toEqual(null);
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toMatch(/json/);
      expect(res.body.ok).toBe(1);
      expect(res.body.value.mode).toBe('counts');
      expect(res.body.value.data.length).toBe(2);
      done();
    };

    auth.authenticatedRequest(
      server,
      request(server)
        .put('/api/protected/index/update/counts'),
      resolve);
  });

});