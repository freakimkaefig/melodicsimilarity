/**
 * Backend controller for handling similarity data.
 */

'use strict';
var MusicJsonToolbox = require('musicjson-toolbox');
var databaseConfig = require('../config/database.config.json');
var databaseService = require('../services/databaseService');

var that = {};

var getAll = function(req, res) {
  databaseService.getCollection(databaseConfig.collections.similarity, 0, 0, function(result, count) {
    res.json(result);
  });
};

var getOne = function(req, res) {
  databaseService.getSimilarity(req.params.signature, function(result) {
    if (typeof result !== 'undefined') {
      res.json(result);
    } else {
      res.status(404).send('Songsheet not found!');
    }
  });
};

var updateOne = function(req, res) {
  var signature = req.params.signature;
  databaseService.getDocument(
    databaseConfig.collections.songsheets,
    {signature: signature},
    function(search) {
      if (typeof search !== 'undefined') {
        update(req, res, search);
      } else {
        res.status(404).send('Songsheet not found!');
      }
    }
  );
};

var update = function(req, res, search) {
  databaseService.getDocuments(
    databaseConfig.collections.songsheets,
    {signature: {$ne: search.signature}},
    function(songsheets) {
      var distances = [];
      for (var i = 0; i < songsheets.length; i++) {
        var distance = MusicJsonToolbox.pitchDurationSimilarity(songsheets[i].json, search.json);
        distances.push({
          signature: songsheets[i].signature,
          distance: distance
        });
      }
      databaseService.updateSimilarity(
        search.signature,
        distances,
        function(result) {
          res.json(result);
        }
      );
    }
  );
};

that.getAll = getAll;
that.getOne = getOne;
that.updateOne = updateOne;

module.exports = that;