var mongo = require('mongodb');
var databaseConfig = require('../config/database.config.json');
var MongoClient = mongo.MongoClient;
var bcrypt = require('bcryptjs');
var env = require('../../.env');

var that = {};

var url = env.MONGO_URI;

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

var getCollection = function(collectionName, start, rows, callback) {
  MongoClient.connect(url, function(err, db) {
    if (err) {
      throw err;
    }
    var collection = db.collection(collectionName);
    collection.find({}).count(function (err, count) {
      if (err) {
        throw err;
      }
      collection.find({}).skip(start).limit(rows).toArray(function(err, result) {
        if (err) {
          throw err;
        }
        callback(result, count);
        db.close();
      });
    });
    
  });
};

var getDocuments = function(collectionName, query, callback) {
  MongoClient.connect(url, function(err, db) {
    if (err) {
      throw err;
    }
    var collection = db.collection(collectionName);
    collection.find(query).toArray(function(err, result) {
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

var getStatistics = function(mode, callback) {
  that.getDocument(databaseConfig.collections.statistics, { mode: mode}, callback);
};

var updateStatistics = function(mode, values, callback) {
  MongoClient.connect(url, function(err, db) {
    if (err) {
      throw err;
    }
    var collection = db.collection(databaseConfig.collections.statistics);
    collection.findOneAndUpdate(
      { mode: mode },
      { mode: mode, data: data, lastUpdated: new Date() },
      { upsert: true, returnOriginal: false },
      function(err, result) {
        if (err) {
          throw err;
        }
        callback(result);
        db.close();
      }
    )
  });
};

var getSimilarity = function(signature, callback) {
  that.getDocument(databaseConfig.collections.similarity, {signature: signature}, callback);
};

var updateSimilarity = function(signature, distances, callback) {
  MongoClient.connect(url, function(err, db) {
    if (err) {
      throw err;
    }
    var collection = db.collection(databaseConfig.collections.similarity);
    collection.findOneAndUpdate(
      { signature: signature },
      { signature: signature, distances: distances },
      { upsert: true, returnOriginal: false },
      function(err, result) {
        if (err) {
          throw err;
        }
        callback(result);
        db.close();
      }
    )
  });
};

var addDocument = function(data, callback) {
  console.log(typeof data.json.attributes.divisions);
  MongoClient.connect(url, function(err, db) {
    if (err) {
      throw err;
    }
    var collection = db.collection(databaseConfig.collections.songsheets);
    collection.findOneAndUpdate(
      { signature: data.signature },
      {
        signature: data.signature,
        name: data.name,
        json: data.json,
        abc: data.abc
      },
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
that.getDocuments = getDocuments;
that.getDocument = getDocument;
that.addUser = addUser;
that.getStatistics = getStatistics;
that.updateStatistics = updateStatistics;
that.getSimilarity = getSimilarity;
that.updateSimilarity = updateSimilarity;
that.addDocument = addDocument;

module.exports = that;