'use strict';
var databaseService = require('../services/databaseService');
var databaseConfig = require('../config/database.config.json');
var similarityController = require('../controllers/similarityController');
var timestamp = require('../../config/timestamp.helper');

var that = {};

var run = function() {
  databaseService.getCollection(databaseConfig.collections.songsheets, 0, 0, function(results, count) {
    for (var i = 0; i < count; i++) {
      var songsheet = results[i];

      console.log(timestamp(), 'Enqueue updating similarity for', songsheet.signature);

      similarityController.update(songsheet, function(result) {
        console.log(timestamp(), 'Updated similarity for', result.value.signature);
      });
    }
  })
};

that.run = run;

module.exports = that;