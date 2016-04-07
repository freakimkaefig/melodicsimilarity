var mongo = require('mongodb');
var userConfig = require('../config/user.config');
var MongoClient = mongo.MongoClient;
var bcrypt = require('bcryptjs');

var that = {};

var url = process.env.MONGOLAB_URI;

var getCollection = function(collection, callback) {
  MongoClient.connect(url, function(err, db) {
    if (err) {
      throw err;
    }
    db.collection(collection).find({}).toArray(function(err, result) {
      if (err) {
        throw err;
      }
      callback(result);
    })
  });
};

var addUser = function(collection, username, password, callback) {
  MongoClient.connect(url, function(err, db) {
    if (err) {
      throw err;
    }


    var getCollection = function(collection, callback) {
      MongoClient.connect(url, function(err, db) {
        if (err) {
          throw err;
        }
        db.collection(collection).find({}).toArray(function(err, result) {
          if (err) {
            throw err;
          }
          callback(result);
        })
      });
    };


    var collection = db.collection(userConfig.databaseCollection);
    collection.find({ "username": username }).toArray(function(err, result) {
      if (err) {
        throw err;
      }
      if (result.length > 0) {
        callback({ result: { ok: 0, message: "User already exists" }});
      } else {
        collection.insertMany([
          {
            username: username,
            hash: bcrypt.hashSync(password, 10)
          }
        ], function(err, result) {
          if (err) {
            throw err;
          }
          callback(result);
        });
      }
    });

  });
};

that.getCollection = getCollection;
that.addUser = addUser;

module.exports = that;