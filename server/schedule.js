/**
 * Created by Lukas Lamm on 26.03.2016.
 */
'use strict';
var schedule = require('node-schedule');
var statisticController = require('./controllers/statisticController');
var apiConfig = require('./config/api.config.json');

var that = {};
that.jobs = {};
that.init = function() {
  console.log('Waiting for next job ...');

  // schedule statistics updates
  that.jobs.statistics = schedule.scheduleJob('0 4 * * *', function() {
    for (var prop in apiConfig.statistics) {
      if (!apiConfig.statistics.hasOwnProperty(prop)) continue;

      if (apiConfig.statistics[prop].datatype === 'melodic') {
        console.log('Enqueue updating statistics for', prop);
        statisticController.updateStats(apiConfig.statistics[prop].mode, function (result) {
          console.log('Updated values for', result.value.mode);
        });
      }
    }
  });

  // schedule similarity calculation
  that.jobs.similarity = schedule.scheduleJob('0 5 * * *', function() {
    console.log('Huh?! What should i do now?');
    // TODO: implement cronjob for similarity calculation
  });
};

module.exports = that;