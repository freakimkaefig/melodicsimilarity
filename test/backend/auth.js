var request = require('supertest');
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
var bcrypt = require('bcryptjs');
var databaseConfig = require('../../config/database.config.json');

var testUser = {
  username: 'test',
  password: 'mysecrettest'
};

describe('Authentication', function() {

  it('should disable unauthorized access to protected routes', function(done) {
    this.timeout(5000);
    request(process.env.BASE_URL)
      .get('api/protected/random-quote')
      .expect(401, done);
  });

  it('should return error trying to login empty credentials', function(done) {
    this.timeout(5000);
    request(process.env.BASE_URL)
      .post('user/login')
      .expect(400, done);
  });

  it('should return error trying to login with wrong username', function(done) {
    this.timeout(5000);
    var wrongUser = { "username": "user", "password": "password"};
    request(process.env.BASE_URL)
      .post('user/login')
      .set('Accept', 'application/json')
      .send(wrongUser)
      .expect(401, done);
  });

  it('should return error trying to login with wrong password', function(done) {
    this.timeout(5000);
    var wrongUser = { "username": testUser.username, "password": "password"};
    request(process.env.BASE_URL)
      .post('user/login')
      .set('Accept', 'application/json')
      .send(wrongUser)
      .expect(401, done);
  });

  it('should allow creating new users', function(done) {
    this.timeout(5000);
    var correctUser = { "username": testUser.username, "password": testUser.password };
    request(process.env.BASE_URL)
      .post('user/create')
      .set('Accept', 'application/json')
      .send(correctUser)
      .end(function(err, res) {
        if (err) {
          throw err;
        }
        res.should.have.property('status', 201);
        res.body.should.have.property('ok', 1);
        res.body.should.have.property('lastErrorObject');
        res.body.should.have.property('value');
        res.body.value.should.have.property('username', correctUser.username);
        res.body.value.should.have.property('hash');
        bcrypt.compareSync(correctUser.password, res.body.value.hash).should.be.ok;
        testUser.id = res.body.value._id;
        done();
      });
  });

  it('should return id_token when login with correct credentials', function(done) {
    this.timeout(5000);
    var correctUser = { "username": testUser.username, "password": testUser.password };
    request(process.env.BASE_URL)
      .post('user/login')
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
      .get('api/protected/random-quote')
      .set('Authorization', 'Bearer ' + testUser.id_token)
      .expect(200, done);
  });

  after(function(done) {
    MongoClient.connect(process.env.MONGO_URI, function(err, db) {
      if (err) {
        throw err;
      }
      db.collection(databaseConfig.collections.users).deleteOne({ username: testUser.username }, function(err, result) {
        if (err) {
          throw err;
        }
        done();
      });
    });
  });
});

