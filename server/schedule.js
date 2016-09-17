/**
 * Schedules processes for updating statistics and similarity on a regular basis.
 */

'use strict';
var schedule = require('node-schedule');
var statisticsTask = require('./tasks/statistics');
var similarityTask = require('./tasks/similarity');

var that = {};
that.jobs = {};
that.init = function() {
  console.log('Waiting for next job ...');

  // schedule statistics updates
  that.jobs.statistics = schedule.scheduleJob('0 4 * * *', function() {
    statisticsTask.run();
  });

  // schedule similarity calculation
  that.jobs.similarity = schedule.scheduleJob('0 5 * * *', function() {
    similarityTask.run();
  });
};

module.exports = that;