/**
 * Manages Mongo DB database connection.
 */

'use strict';
var mongo = require('mongodb');
var databaseConfig = require('../config/database.config.json');
var MongoClient = mongo.MongoClient;
var bcrypt = require('bcryptjs');
var env = require('../../.env.json');

var that = {};

var url = env.MONGO_URI;

// Get Mongo DB status
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

// Retrieve database collection by name
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

// Retrieve multiple documents from Mongo DB collection by query
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

// Retrieve single documents from Mongo DB collection by query
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

// Add user to database
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

// Retrieve setting
var getSetting = function(field, callback) {
  MongoClient.connect(url, function(err, db) {
    if (err) {
      throw err;
    }
    var collection = db.collection(databaseConfig.collections.settings);
    collection.find({key: field}).limit(1).next(function(err, result){
      if (err) {
        throw err;
      }
      callback(result);
      db.close();
    })
  })
};

// Update or create setting
var setSetting = function(field, value, callback) {
  MongoClient.connect(url, function(err, db) {
    if (err) {
      throw err;
    }
    var collection = db.collection(databaseConfig.collections.settings);
    collection.findOneAndUpdate(
      { key: field },
      { $set: { value: value }, $currentDate: { lastUpdated: true } },
      { upsert: true, returnOriginal: false },
      function(err, result) {
        if (err) {
          return err;
        }
        callback(result);
        db.close();
      }
    )
  })
};

// Get statistic by mode
var getStatistics = function(mode, callback) {
  that.getDocument(databaseConfig.collections.statistics, { mode: mode}, callback);
};

// Update statistics in database
var updateStatistics = function(mode, data, callback) {
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

// Get similarity data by songsheet number
var getSimilarity = function(signature, callback) {
  that.getDocument(databaseConfig.collections.similarity, {signature: signature}, callback);
};

// Update similarity data for given songsheet
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

// Add songsheet to database
var addDocument = function(data, callback) {
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
        json: data.json
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

// Remove single document from Mongo DB collection by query
var deleteDocument = function(collectionName, query, callback) {
  MongoClient.connect(url, function(err, db) {
    if (err) {
      throw err;
    }
    var collection = db.collection(collectionName);
    collection.deleteOne(query, function(err, result) {
      if (err) {
        throw err;
      }
      callback(result, query);
      db.close();
    });
  });
};

that.getStats = getStats;
that.getCollection = getCollection;
that.getDocuments = getDocuments;
that.getDocument = getDocument;
that.addUser = addUser;
that.getSetting = getSetting;
that.setSetting = setSetting;
that.getStatistics = getStatistics;
that.updateStatistics = updateStatistics;
that.getSimilarity = getSimilarity;
that.updateSimilarity = updateSimilarity;
that.addDocument = addDocument;
that.deleteDocument = deleteDocument;

module.exports = that;