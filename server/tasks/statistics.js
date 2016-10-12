'use strict';
var statisticController = require('../controllers/statisticController');
var apiConfig = require('../config/api.config.json');
var timestamp = require('../config/timestamp.helper');

var that = {};

var run = function() {
  for (var prop in apiConfig.statistics) {
    if (!apiConfig.statistics.hasOwnProperty(prop)) continue;

    if (apiConfig.statistics[prop].datatype === 'melodic') {
      console.log(timestamp(), 'Enqueue updating statistics for', prop);
      statisticController.updateStats(apiConfig.statistics[prop].mode, function (result) {
        console.log(timestamp(), 'Updated statistics for', result.value.mode);
      });
    }
  }
};

that.run = run;

module.exports = that;