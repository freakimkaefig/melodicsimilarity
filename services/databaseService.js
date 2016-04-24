var mongo = require('mongodb');
var databaseConfig = require('../config/database.config.json');
var MongoClient = mongo.MongoClient;
var bcrypt = require('bcryptjs');

var that = {};

var url = process.env.MONGOLAB_URI;

var getStats = function(callback) {
  MongoClient.connect(url, function(err, db) {
    if (err) {
      throw err;
    }
    db.stats(function (err, stats) {
      if (err) {
        throw err;
      }
      callback(stats);
      db.close();
    });
  })
};

var getCollection = function(collectionName, callback) {
  MongoClient.connect(url, function(err, db) {
    if (err) {
      throw err;
    }
    var collection = db.collection(collectionName);
    collection.find({}).toArray(function(err, result) {
      if (err) {
        throw err;
      }
      callback(result);
      db.close();
    });
  });
};

var getDocument = function(collectionName, query, callback) {
  MongoClient.connect(url, function(err, db) {
    if (err) {
      throw err;
    }
    var collection = db.collection(collectionName);
    collection.find(query).limit(1).toArray(function(err, result) {
      if (err) {
        throw err;
      }
      callback(result.pop());
      db.close();
    });
  });
};

var addUser = function(username, password, callback) {
  MongoClient.connect(url, function(err, db) {
    if (err) {
      throw err;
    }
    var collection = db.collection(databaseConfig.collections.users);
    collection.findOneAndUpdate(
      { username: username },
      { username: username, hash: bcrypt.hashSync(password, 10) },
      { upsert: true, returnOriginal: false },
      function(err, result) {
        if (err) {
          throw err;
        }
        callback(result);
        db.close();
      }
    );
  });
};

var addDocument = function(data, callback) {
  MongoClient.connect(url, function(err, db) {
    if (err) {
      throw err;
    }
    var collection = db.collection(databaseConfig.collections.songsheets);
    collection.findOneAndUpdate(
      { signature: data.signature },
      data,
      { upsert: true, returnOriginal: false },
      function(err, result) {
        if (err) {
          throw err;
        }
        callback({
          value: result.value,
          ok: result.ok,
          signature: result.value.signature
        });
        db.close();
      }
    )
  });
};

that.getStats = getStats;
that.getCollection = getCollection;
that.getDocument = getDocument;
that.addUser = addUser;
that.addDocument = addDocument;

module.exports = that;