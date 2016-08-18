/**
 * Backend controller for general app settings.
 */

'use strict';
var databaseService = require('../services/databaseService');

var that = {};

/**
 * Handles GET request for settings field.
 * Returns stored value for field (requested via param).
 * @param {object} req - request object
 * @param {object} res - response object
 */
var getField = function(req, res) {
  databaseService.getSetting(req.params.key, function(result) {
    res.json(result);
  });
};

/**
 * Handles PUT request for settings field.
 * Returns stored value for field or error.
 * @param {object} req - request object
 * @param {object} res - response object
 */
var setField = function(req, res) {
  databaseService.setSetting(req.params.key, req.params.value, function(result) {
    res.json(result);
  });
};

that.getField = getField;
that.setField = setField;

module.exports = that;