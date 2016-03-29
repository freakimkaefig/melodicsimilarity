var mongo = require('mongodb');
var databaseConfig = require('../config/database.config');
var userConfig = require('../config/user.config');
var MongoClient = mongo.MongoClient;
var bcrypt = require('bcryptjs');

var that = {};

var url = 'mongodb://' + databaseConfig.host + ':' + databaseConfig.port + '/' + databaseConfig.database;

var getCollection = function(collection, callback) {
  MongoClient.connect(url, function(err, db) {
    if (err) {
      throw err;
    }
    db.collection(collection).find().toArray(function(err, result) {
      if (err) {
        throw err;
      }
      callback(result);
    })
  });
};

var addUser = function(username, password) {
  MongoClient.connect(url, function(err, db) {
    if (err) {
      throw err;
    }
    var collection = db.collection('usercollection');
    collection.insertMany([
      {
        username: username,
        hash: bcrypt.hashSync(password, 10)
      }
    ], function(err, result) {
      console.log("inserted");
    });
  });
};

// that.addUser = addUser;
that.getCollection = getCollection;

module.exports = that;