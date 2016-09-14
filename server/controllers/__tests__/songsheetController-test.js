import request from 'supertest';

jest.mock('../../services/databaseService');

describe('songsheetController', () => {

  var server;
  var auth;

  var dummySongsheet = require('../../test/test1.json');

  beforeEach(() => {
    server = require('../../test/server-helper');
    auth = require('../../test/auth-helper');
  });

  afterEach(() => {
    server.close();
  });

  it('should disable upload when unauthorized', (done) => {
    request(server)
      .put('/api/protected/similarity/update/test1')
      .end((err, res) => {
        expect(err).toEqual(null);
        expect(res.status).toBe(401);
        done();
      });
  });

  it('should handle songsheet upload', (done) => {
    var resolve = (err, res) => {
      expect(err).toEqual(null);
      expect(res.status).toBe(200);
      expect(res.body.ok).toBe(1);
      expect(res.body.value.signature).toBe(dummySongsheet.id);
      expect(res.body.value.name).toBe('test1');
      done();
    };

    auth.authenticatedRequest(
      server,
      request(server)
        .put('/api/protected/songsheet/add')
        .set('Content-Type', 'application/json')
        .send(JSON.stringify({
          signature: dummySongsheet.id,
          name: 'test1',
          json: dummySongsheet
        })),
      resolve);
  });

  it('should return list of songsheets', (done) => {
    request(server)
      .get('/api/songsheets')
      .end((err, res) => {
        expect(err).toEqual(null);
        expect(res.status).toBe(200);
        expect(res.body.items.length).toBe(2);
        expect(res.body.totalCount).toBe(2);
        done();
      });
  });

  it('should return not found when no songsheet found', (done) => {
    request(server)
      .get('/api/songsheets/null')
      .end((err, res) => {
        expect(err).toEqual(null);
        expect(res.status).toBe(404);
        expect(res.error.text).toBe('Songsheet not found!');
        done();
      });
  });

  it('should return single songsheet', (done) => {
    request(server)
      .get('/api/songsheets/test1')
      .end((err, res) => {
        expect(err).toEqual(null);
        expect(res.status).toBe(200);
        expect(res.body.signature).toBe('test1');
        done();
      });
  });

  it('should return placeholder image', (done) => {
    request(server)
      .get('/api/image/placeholder.jpg')
      .end((err, res) => {
        expect(err).toEqual(null);
        expect(res.status).toBe(200);
        expect(res.type).toMatch(/image/);
        done();
      })
  });

  it('should return image from SolrInteractionServer', (done) => {
    request(server)
      .get('/api/image/test.jpg')
      .end((err, res) => {
        expect(err).toEqual(null);
        expect(res.status).toBe(200);
        expect(res.type).toMatch(/image/);
        done();
      });
  });

});