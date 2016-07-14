/**
 * Backend controller for handling api requests.
 */

'use strict';
var express = require('express');
var databaseService = require('../services/databaseService');
var apiConfig = require('../config/api.config');

var that = {};

var getStats = function (req, res) {
  databaseService.getStats(function(stats) {
    res.json({
      version: apiConfig.version,
      db: stats
    });
  });
};

that.getStats = getStats;

module.exports = that;
