/**
 * Schedules processes for updating statistics and similarity on a regular basis.
 */

'use strict';
var schedule = require('node-schedule');
var scheduleConfig = require('./config/schedule.config.json');
var statisticsTask = require('./tasks/statistics');
var similarityTask = require('./tasks/similarity');
var timestamp = require('../config/timestamp.helper');

var that = {};
that.jobs = {};
that.init = function() {
  // schedule statistics updates
  console.log(timestamp(), 'Start scheduling statistics with interval ' + scheduleConfig.jobs.statistics);
  that.jobs.statistics = schedule.scheduleJob(scheduleConfig.jobs.statistics, function() {
    statisticsTask.run();
  });

  // schedule similarity calculation
  console.log(timestamp(), 'Start scheduling similarity with interval ' + scheduleConfig.jobs.similarity);
  that.jobs.similarity = schedule.scheduleJob(scheduleConfig.jobs.similarity, function() {
    similarityTask.run();
  });
};

module.exports = that;