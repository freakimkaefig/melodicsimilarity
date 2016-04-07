var request = require('supertest');
var should = require('should');
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
var userConfig = require('../../config/user.config.json');

var testUser = {
  username: 'test',
  password: 'mysecrettest'
};

describe('Authentication', function() {

  it('should disable unauthorized access to protected routes', function(done) {
    this.timeout(5000);
    request(process.env.BASE_URL)
      .get('/api/protected/random-quote')
      .expect(401, done);
  });

  it('should return error trying to login empty credentials', function(done) {
    this.timeout(5000);
    request(process.env.BASE_URL)
      .post('/user/login')
      .expect(400, done);
  });

  it('should return error trying to login with wrong username', function(done) {
    this.timeout(5000);
    var wrongUser = { "username": "user", "password": "password"};
    request(process.env.BASE_URL)
      .post('/user/login')
      .set('Accept', 'application/json')
      .send(wrongUser)
      .expect(401, done);
  });

  it('should return error trying to login with wrong password', function(done) {
    this.timeout(5000);
    var wrongUser = { "username": testUser.username, "password": "password"};
    request(process.env.BASE_URL)
      .post('/user/login')
      .set('Accept', 'application/json')
      .send(wrongUser)
      .expect(401, done);
  });

  it('should allow creating new users', function(done) {
    this.timeout(5000);
    var correctUser = { "username": testUser.username, "password": testUser.password };
    request(process.env.BASE_URL)
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
    this.timeout(5000);
    var correctUser = { "username": testUser.username, "password": testUser.password };
    request(process.env.BASE_URL)
      .post('/user/create')
      .set('Accept', 'application/json')
      .send(correctUser)
      .expect(400, done);
  });

  it('should return id_token when login with correct credentials', function(done) {
    this.timeout(5000);
    var correctUser = { "username": testUser.username, "password": testUser.password };
    request(process.env.BASE_URL)
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
    this.timeout(5000);
    request(process.env.BASE_URL)
      .get('/api/protected/random-quote')
      .set('Authorization', 'Bearer ' + testUser.id_token)
      .expect(200, done);
  });

  after(function(done) {
    MongoClient.connect(process.env.MONGOLAB_URI, function(err, db) {
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

