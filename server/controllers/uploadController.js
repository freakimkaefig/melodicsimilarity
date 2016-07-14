/**
 * Backend controller for handling uploads.
 */

'use strict';
var storageService = require('../services/storageService');

var that = {};

/**
 * Handles POST request for uploading songhseet data.
 * @param {object} req - request object
 * @param {object} res - response object
 */
var postUpload = function(req, res) {
  if (!req.body.image) {
    return res.status(500).send('No image');
  }

  var file = req.body;
  storageService.upload(file.image, file.imageName, file.imageType, function(err, data) {
    if (err) {
      console.log(err);
      res.json(err);
      return;
    }
    res.json({
      response: data,
      file: file
    });
  });
};

that.postUpload = postUpload;

module.exports = that;