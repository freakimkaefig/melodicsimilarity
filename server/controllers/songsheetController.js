/**
 * Backend controller for handling create and update operations for songsheets.
 */

'use strict';
var path = require('path');
var request = require('sync-request');
var databaseService = require('../services/databaseService');
var databaseConfig = require('../config/database.config.json');

var that = {};

/**
 * Handles POST request for uploading songhseet data.
 * @param {object} req - request object
 * @param {object} res - response object
 */
var handleUpload = function(req, res) {
  databaseService.addDocument(req.body, function(results) {
    res.json(results);
  });
};

/**
 * Handles GET request for uploaded songhseet data.
 * Returns all songsheets.
 * @param {object} req - request object
 * @param {object} res - response object
 */
var getSongsheets = function(req, res) {
  databaseService.getCollection(
    databaseConfig.collections.songsheets,
    parseInt(req.query.start),
    parseInt(req.query.rows),
    function(songsheets, count) {
      res.json({
        items: songsheets,
        totalCount: count
      });
    }
  );
};

/**
 * Handles GET request for uploaded songhseet data.
 * Returns single songsheet specified by signature param.
 * @param {object} req - request object
 * @param {object} res - response object
 */
var getSongsheetBySignature = function(req, res) {
  databaseService.getDocument(databaseConfig.collections.songsheets, {signature: req.params.signature}, function(songsheet) {
    if (typeof songsheet !== 'undefined') {
      res.json(songsheet);
    } else {
      res.status(404).send('Songsheet not found!');
    }
  });
};

/**
 * Handles GET request for songsheet image.
 * Delivers image from SolrInteractionServer instance or placeholder if no file found.
 * @param {object} req - request object
 * @param {object} res - response object
 */
var getImageByName = function(req, res) {
  var placeholder = path.join(__dirname, '../assets/placeholder.jpg');
  if (req.params.name == 'placeholder.jpg') {
    res.sendFile(placeholder);
  } else {
    var url = 'http://localhost:8080/SolrInteractionServer/FrontEnd/img/jpegs/' + req.params.name
    var image = request('HEAD', url);
    if (image.statusCode === 200) {
      res.redirect(url);
    } else {
      res.sendFile(placeholder);
    }
  }
};


that.handleUpload = handleUpload;
that.getSongsheets = getSongsheets;
that.getSongsheetBySignature = getSongsheetBySignature;
that.getImageByName = getImageByName;

module.exports = that;