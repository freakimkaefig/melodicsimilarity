/**
 * Backend controller for handling similarity data.
 */

'use strict';
var MusicJsonToolbox = require('musicjson-toolbox');
var databaseConfig = require('../config/database.config.json');
var databaseService = require('../services/databaseService');

var that = {};

/**
 * Handles GET request for similarity data.
 * Returns similarity data for all songsheets.
 * @param {object} req - request object
 * @param {object} res - response object
 */
var getAll = function(req, res) {
  databaseService.getCollection(databaseConfig.collections.similarity, 0, 0, function(result, count) {
    res.json(result);
  });
};

/**
 * Handles GET request for similarity data.
 * Returns similarity data for single songsheet specified by signature param.
 * @param {object} req - request object
 * @param {object} res - response object
 */
var getOne = function(req, res) {
  databaseService.getSimilarity(req.params.signature, function(result) {
    if (typeof result !== 'undefined') {
      res.json(result);
    } else {
      res.status(404).send('Songsheet not found!');
    }
  });
};

/**
 * Handles PUT request for similarity data.
 * Updates similarity data for songsheet specified by signature param.
 * @param {object} req - request object
 * @param {object} res - response object
 */
var updateOne = function(req, res) {
  var signature = req.params.signature;

  // Retrieve document by signature from Mongo DB
  databaseService.getDocument(
    databaseConfig.collections.songsheets,
    {signature: signature},
    function(search) {
      if (typeof search !== 'undefined') {
        // Update similarity values in database
        update(search, function(result) {
          res.json(result);
        });
      } else {
        res.status(404).send('Songsheet not found!');
      }
    }
  );
};

/**
 * Updates similarity data in Mongo DB.
 * @param {object} search - The specified document returned from Mongo DB
 * @param {updateCallback} callback - The callback when data is updated
 */
var update = function(search, callback) {
  // Get setting 'method'
  databaseService.getSetting('method', function(result) {
    var method = result.value;

    // Get all songsheets (except searched)
    databaseService.getDocuments(
      databaseConfig.collections.songsheets,
      {signature: {$ne: search.signature}},
      function(songsheets) {
        var distances = [];
        for (var i = 0; i < songsheets.length; i++) {
          // Calculate distance between songsheets and the searched one
          var distance;
          switch (method) {
            case 'ms':
              distance = MusicJsonToolbox.pitchDurationSimilarity(songsheets[i].json, search.json, false);
              break;

            case 'gar':
              distance = MusicJsonToolbox.pitchDurationSimilarity(songsheets[i].json, search.json, true);
              break;

            case 'interval':
              distance = MusicJsonToolbox.intervalSimilarity(songsheets[i].json, search.json);
              break;

            case 'parson':
              distance = MusicJsonToolbox.parsonSimilarity(songsheets[i].json, search.json);
              break;

            default:
              distance = MusicJsonToolbox.pitchDurationSimilarity(songsheets[i].json, search.json, true);
              break;
          }

          distances.push({
            signature: songsheets[i].signature,
            distance: distance
          });
        }

        // Update data in database
        databaseService.updateSimilarity(
          search.signature,
          distances,
          callback
        );
      }
    );
  });
};

that.getAll = getAll;
that.getOne = getOne;
that.updateOne = updateOne;
that.update = update;

module.exports = that;