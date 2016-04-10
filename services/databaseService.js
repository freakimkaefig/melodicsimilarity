var mongo = require('mongodb');
var databaseConfig = require('../config/database.config.json');
var MongoClient = mongo.MongoClient;
var bcrypt = require('bcryptjs');

var that = {};

var url = process.env.MONGOLAB_URI;

var getCollection = function(collection, callback) {
  MongoClient.connect(url, function(err, db) {
    if (err) {
      throw err;
    }

    var collection = db.collection(collection);
    collection.find({}).toArray(function(err, result) {
      if (err) {
        throw err;
      }
      callback(result);
      db.close();
    });
  });
};

var addUser = function(collection, username, password, callback) {
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
    for (var i = 0, f; f = data[i]; i++) {
      collection.findOneAndUpdate(
        { id: f.id },
        f,
        { upsert: true, returnOriginal: false },
        function(err, result) {
          if (err) {
            throw err;
          }
          console.log(result);
          db.close();
        }
      )
    }
    // collection.updateMany(
    //   {},
    //   {},
    //   { upsert: true, w: 1 },
    //   function(err, result) {
    //     if (err) {
    //       throw err;
    //     }
    //     callback(result);
    //   }
    // )
  });
};

that.getCollection = getCollection;
that.addUser = addUser;
that.addDocument = addDocument;

module.exports = that;