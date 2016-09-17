/**
 * Backend controller for handling api requests.
 */

'use strict';
var express = require('express');
var databaseService = require('../services/databaseService');
var apiConfig = require('../config/api.config');

var that = {};

/**
 * Handle GET request for api status.
 * @param {object} req - request object
 * @param {object} res - response object
 */
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
