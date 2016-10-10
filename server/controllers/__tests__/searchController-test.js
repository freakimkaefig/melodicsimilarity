import request from 'supertest';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
describe('searchController', () => {

  var server;

  beforeEach(() => {
    server = require('../../test/server-helper');
  });

  afterEach(() => {
    server.close();
  });

  it('should return solr results for "liebe"', (done) => {
    request(server)
      .post('/api/search')
      .send({
        "solrQuery": "http://127.0.0.1:8983/solr/searchableDocs/query?wt=json&hl=true&hl.simple.pre=<em>&hl.simple.post=</em>&hl.fragsize=300&hl.snippets=3&q=liebe&fq=signature:*",
        "melodyMode": "MELODY",
        "melodyQuery": false
      })
      .end((err, res) => {
        expect(err).toEqual(null);
        expect(res.status).toBe(200);
        expect(res.headers['content-type']).toMatch(/json/);
        expect(res.body.length).toBeGreaterThan(0);
        done();
      });
  });

  it('should return melody results for "*udr"', (done) => {
    request(server)
      .post('/api/search')
      .send({
        "solrQuery": false,
        "melodyMode": "PARSONS",
        "melodyQuery": {
          "parson": "udr",
          "threshold": 76
        }
      })
      .end((err, res) => {
        expect(err).toEqual(null);
        expect(res.status).toBe(200);
        expect(res.headers['content-type']).toMatch(/json/);
        expect(res.body.length).toBeGreaterThan(0);
        done();
      });
  });

  it('should return melody results for "* 2 -4 0"', (done) => {
    request(server)
      .post('/api/search')
      .send({
        "solrQuery": false,
        "melodyMode": "INTERVALS",
        "melodyQuery": {
          "intervals": "2 -4 0",
          "threshold": 75
        }
      })
      .end((err, res) => {
        expect(err).toEqual(null);
        expect(res.status).toBe(200);
        expect(res.headers['content-type']).toMatch(/json/);
        expect(res.body.length).toBeGreaterThan(0);
        done();
      });
  });

  it('should return melody results for "C D A A (default)"', (done) => {
    request(server)
      .post('/api/search')
      .send({
        "solrQuery": false,
        "melodyMode": "MELODY",
        "melodyQuery": {
          "melody": [
            { "pitch": { "step": "C", "octave": 4, "accidental": "" }, "rest": false, "duration": 8, "type": "eighth", "dot": false },
            { "pitch": { "step": "D", "octave": 4, "accidental": "" }, "rest": false, "duration": 8, "type": 'eighth', "dot": false },
            { "pitch": { "step": "A", "octave": 3, "alter": 1, "accidental": "sharp" }, "rest": false, "duration": 16, "type": "quarter", "dot": false },
            { "pitch": { "step": "A", "octave": 3, "alter": 1, "accidental": "sharp" }, "rest": false, "duration": 8, "type": "eighth", "dot": false }
          ],
          "threshold": 20
        }
      })
      .end((err, res) => {
        expect(err).toEqual(null);
        expect(res.status).toBe(200);
        expect(res.headers['content-type']).toMatch(/json/);
        expect(res.body.length).toBeGreaterThanOrEqual(0);
        done();
      });
  });

  it('should return melody results for "C D A A (ms)"', (done) => {
    request(server)
      .post('/api/search')
      .send({
        "solrQuery": false,
        "melodyMode": "MELODY",
        "melodyQuery": {
          "melody": [
            { "pitch": { "step": "C", "octave": 4, "accidental": "" }, "rest": false, "duration": 8, "type": "eighth", "dot": false },
            { "pitch": { "step": "D", "octave": 4, "accidental": "" }, "rest": false, "duration": 8, "type": 'eighth', "dot": false },
            { "pitch": { "step": "A", "octave": 3, "alter": 1, "accidental": "sharp" }, "rest": false, "duration": 16, "type": "quarter", "dot": false },
            { "pitch": { "step": "A", "octave": 3, "alter": 1, "accidental": "sharp" }, "rest": false, "duration": 8, "type": "eighth", "dot": false }
          ],
          "threshold": 20,
          "method": "ms"
        }
      })
      .end((err, res) => {
        expect(err).toEqual(null);
        expect(res.status).toBe(200);
        expect(res.headers['content-type']).toMatch(/json/);
        expect(res.body.length).toBeGreaterThanOrEqual(0);
        done();
      });
  });

  it('should return melody results for "C D A A (gar)"', (done) => {
    request(server)
      .post('/api/search')
      .send({
        "solrQuery": false,
        "melodyMode": "MELODY",
        "melodyQuery": {
          "melody": [
            { "pitch": { "step": "C", "octave": 4, "accidental": "" }, "rest": false, "duration": 8, "type": "eighth", "dot": false },
            { "pitch": { "step": "D", "octave": 4, "accidental": "" }, "rest": false, "duration": 8, "type": 'eighth', "dot": false },
            { "pitch": { "step": "A", "octave": 3, "alter": 1, "accidental": "sharp" }, "rest": false, "duration": 16, "type": "quarter", "dot": false },
            { "pitch": { "step": "A", "octave": 3, "alter": 1, "accidental": "sharp" }, "rest": false, "duration": 8, "type": "eighth", "dot": false }
          ],
          "threshold": 20,
          "method": "gar"
        }
      })
      .end((err, res) => {
        expect(err).toEqual(null);
        expect(res.status).toBe(200);
        expect(res.headers['content-type']).toMatch(/json/);
        expect(res.body.length).toBeGreaterThanOrEqual(0);
        done();
      });
  });

  it('should return melody results for "C D A A (interval)"', (done) => {
    request(server)
      .post('/api/search')
      .send({
        "solrQuery": false,
        "melodyMode": "MELODY",
        "melodyQuery": {
          "melody": [
            { "pitch": { "step": "C", "octave": 4, "accidental": "" }, "rest": false, "duration": 8, "type": "eighth", "dot": false },
            { "pitch": { "step": "D", "octave": 4, "accidental": "" }, "rest": false, "duration": 8, "type": 'eighth', "dot": false },
            { "pitch": { "step": "A", "octave": 3, "alter": 1, "accidental": "sharp" }, "rest": false, "duration": 16, "type": "quarter", "dot": false },
            { "pitch": { "step": "A", "octave": 3, "alter": 1, "accidental": "sharp" }, "rest": false, "duration": 8, "type": "eighth", "dot": false }
          ],
          "threshold": 20,
          "method": "interval"
        }
      })
      .end((err, res) => {
        expect(err).toEqual(null);
        expect(res.status).toBe(200);
        expect(res.headers['content-type']).toMatch(/json/);
        expect(res.body.length).toBeGreaterThanOrEqual(0);
        done();
      });
  });

  it('should return melody results for "C D A A (parson)"', (done) => {
    request(server)
      .post('/api/search')
      .send({
        "solrQuery": false,
        "melodyMode": "MELODY",
        "melodyQuery": {
          "melody": [
            { "pitch": { "step": "C", "octave": 4, "accidental": "" }, "rest": false, "duration": 8, "type": "eighth", "dot": false },
            { "pitch": { "step": "D", "octave": 4, "accidental": "" }, "rest": false, "duration": 8, "type": 'eighth', "dot": false },
            { "pitch": { "step": "A", "octave": 3, "alter": 1, "accidental": "sharp" }, "rest": false, "duration": 16, "type": "quarter", "dot": false },
            { "pitch": { "step": "A", "octave": 3, "alter": 1, "accidental": "sharp" }, "rest": false, "duration": 8, "type": "eighth", "dot": false }
          ],
          "threshold": 20,
          "method": "parson"
        }
      })
      .end((err, res) => {
        expect(err).toEqual(null);
        expect(res.status).toBe(200);
        expect(res.headers['content-type']).toMatch(/json/);
        expect(res.body.length).toBeGreaterThanOrEqual(0);
        done();
      });
  });

  it('should return combined results', (done) => {
    request(server)
      .post('/api/search')
      .send({
        "solrQuery": "http://127.0.0.1:8983/solr/searchableDocs/query?wt=json&hl=true&hl.simple.pre=<em>&hl.simple.post=</em>&hl.fragsize=300&hl.snippets=3&q=liebe&fq=signature:*",
        "melodyMode": "PARSONS",
        "melodyQuery": {
          "parson": "udr",
          "threshold": 10
        }
      })
      .end((err, res) => {
        expect(err).toEqual(null);
        expect(res.status).toBe(200);
        expect(res.headers['content-type']).toMatch(/json/);
        expect(res.body.length).toBeGreaterThan(0);
        done();
      });
  });

});