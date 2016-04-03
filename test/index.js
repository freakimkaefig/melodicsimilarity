var should = require('should');
var request = require('supertest');
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
var $ = require('jquery');

var apiConfig = require('../config/api.config');
var databaseConfig = require('../config/database.config');
var userConfig = require('../config/user.config');

describe('Routing', function() {
  var url = 'http://localhost:3000';
  var dbUrl = 'mongodb://' + databaseConfig.host + ':' + databaseConfig.port + '/' + databaseConfig.database;
  var testUser = {
    username: 'test',
    password: 'mysecrettest'
  };

  describe('Frontend', function() {
    it('should return home page when navigating', function(done) {
      request(url)
        .get('/')
        .expect('Content-Type', 'text/html; charset=utf-8')
        .end(function(err, res) {
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

  describe('Api', function() {
    it('should return api version as json', function(done) {
      request(url)
        .get('/api')
        .end(function(err, res) {
          if (err) {
            throw err;
          }
          res.should.have.property('status', 200);
          res.body.should.have.property('version', apiConfig.version);
          done();
        })
    });

    it('should disable unauthorized access to protected routes', function(done) {
      request(url)
        .get('/api/protected/random-quote')
        .expect(401, done);
    });

    it('should return error trying to login empty credentials', function(done) {
      request(url)
        .post('/user/login')
        .expect(400, done);
    });

    it('should return error trying to login with wrong username', function(done) {
      var wrongUser = { "username": "user", "password": "password"};
      request(url)
        .post('/user/login')
        .set('Accept', 'application/json')
        .send(wrongUser)
        .expect(401, done);
    });

    it('should return error trying to login with wrong password', function(done) {
      var wrongUser = { "username": testUser.username, "password": "password"};
      request(url)
        .post('/user/login')
        .set('Accept', 'application/json')
        .send(wrongUser)
        .expect(401, done);
    });

    it('should allow creating new users', function(done) {
      var correctUser = { "username": testUser.username, "password": testUser.password };
      request(url)
        .post('/user/create')
        .set('Accept', 'application/json')
        .send(correctUser)
        .end(function(err, res) {
          if (err) {
            throw err;
          }
          res.should.have.property('status', 201);
          res.body.should.have.property('result');
          res.body.should.have.property('ops');
          res.body.should.have.property('insertedCount', 1);
          res.body.should.have.property('insertedIds');
          res.body.result.should.have.property('ok', 1);
          res.body.result.should.have.property('n', 1);
          res.body.result.should.have.property('n', 1);
          res.body.ops.should.be.an.Array();
          res.body.insertedIds.should.be.an.Array();
          testUser.id = res.body.ops[0]._id;
          done();
        });
    });

    it('should notify of existing users', function(done) {
      var correctUser = { "username": testUser.username, "password": testUser.password };
      request(url)
        .post('/user/create')
        .set('Accept', 'application/json')
        .send(correctUser)
        .expect(400, done);
    });

    it('should return id_token when login with correct credentials', function(done) {
      var correctUser = { "username": testUser.username, "password": testUser.password };
      request(url)
        .post('/user/login')
        .set('Accept', 'application/json')
        .send(correctUser)
        .end(function(err, res) {
          if (err) {
            throw err;
          }
          res.should.have.property('status', 201);
          res.body.should.have.property('id_token');
          testUser.id_token = res.body.id_token;
          done();
        });
    });

    it('should allow authorized access to protected routes', function(done) {
      request(url)
        .get('/api/protected/random-quote')
        .set('Authorization', 'Bearer ' + testUser.id_token)
        .expect(200, done);
    });
  });
  
  // describe('Apache Solr Instance', function() {
  //   it('should return docs', function(done) {
  //     request('http://localhost:8983')
  //       .post('/solr/searchableDocs/query')
  //       .send({ params: { signature: "A 59440"} })
  //       .end(function(err, res) {
  //         if (err) {
  //           throw err;
  //         }
  //         res.body.should.have.property('response');
  //         res.body.response.should.have.property('numFound');
  //         parseInt(res.body.response.numFound).should.be.above(0);
  //         done();
  //       });
  //   });
  // });

  after(function(done) {
    MongoClient.connect(dbUrl, function(err, db) {
      if (err) {
        throw err;
      }
      db.collection(userConfig.databaseCollection).deleteOne({ username: testUser.username }, function(err, result) {
        if (err) {
          throw err;
        }
        done();
      });
    });
  });
  
});