import request from 'supertest';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
jest.mock('../../services/databaseService');

describe('userController', () => {

  var server;
  var auth;

  beforeEach(() => {
    server = require('../../test/server-helper');
    auth = require('../../test/auth-helper');
  });

  afterEach(() => {
    server.close();
  });

  it('should disable when unauthorized', (done) => {
    request(server)
      .get('/api/protected/users')
      .end((err, res) => {
        expect(err).toEqual(null);
        expect(res.status).toBe(401);
        done();
      });
  });

  it('should return list of users when authorized', (done) => {
    var resolve = (err, res) => {
      expect(err).toEqual(null);
      expect(res.status).toBe(200);
      expect(res.body.users.length).toBe(1);
      expect(res.body.totalCount).toBe(1);
      done();
    };

    auth.authenticatedRequest(
      server,
      request(server)
        .get('/api/protected/users'),
      resolve);
  });

  it('should return error for wrong signup of user', (done) => {
    var resolve = (err, res) => {
      expect(err).toEqual(null);
      expect(res.status).toBe(400);
      expect(res.error.text).toBeDefined();
      done();
    };

    auth.authenticatedRequest(
      server,
      request(server)
        .put('/user/create')
        .send({
          username: 'username'
        }),
      resolve);
  });

  it('should return error for database error on signup', (done) => {
    var resolve = (err, res) => {
      expect(err).toEqual(null);
      expect(res.status).toBe(400);
      expect(res.error.text).toBeDefined();
      done();
    };

    auth.authenticatedRequest(
      server,
      request(server)
        .put('/user/create')
        .send({
          username: 'fail',
          password: 'password'
        }),
      resolve);
  });

  it('should allow signup of user', (done) => {
    var resolve = (err, res) => {
      expect(err).toEqual(null);
      expect(res.status).toBe(201);
      expect(res.body.ok).toBe(1);
      expect(res.body.value.username).toBe('username');
      expect(res.body.value.password).toBe('password');
      done();
    };

    auth.authenticatedRequest(
      server,
      request(server)
        .put('/user/create')
        .send({
          username: 'username',
          password: 'password'
        }),
      resolve);
  });

  it('should handle empty username|password on login', (done) => {
    request(server)
      .post('/user/login')
      .send({password: 'password'})
      .end((err, res) => {
        expect(err).toEqual(null);
        expect(res.status).toBe(400);
        expect(res.error.text).toBeDefined();
        done();
      });
  });

  it('should handle unknown user on login', (done) => {
    request(server)
      .post('/user/login')
      .send({username: 'username', password: 'password'})
      .end((err, res) => {
        expect(err).toEqual(null);
        expect(res.status).toBe(401);
        expect(res.error.text).toBeDefined();
        done();
      });
  });

  it('should handle wrong password on login', (done) => {
    request(server)
      .post('/user/login')
      .send({username: 'admin', password: 'password'})
      .end((err, res) => {
        expect(err).toEqual(null);
        expect(res.status).toBe(401);
        expect(res.error.text).toBeDefined();
        done();
      });
  });

});