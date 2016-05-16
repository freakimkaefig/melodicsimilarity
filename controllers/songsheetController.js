var path = require('path');
var databaseService = require('../services/databaseService');
var databaseConfig = require('../config/database.config.json');

var that = {};

var handleUpload = function(req, res) {
  databaseService.addDocument(req.body, function(results) {
    res.json(results);
  });
};

var getUploads = function(req, res) {
  databaseService.getCollection(databaseConfig.collections.songsheets, function(songsheets) {
    res.json(songsheets);
  });
};

var getSongsheetBySignature = function(req, res) {
  databaseService.getDocument(databaseConfig.collections.songsheets, {signature: req.params.signature}, function(songsheet) {
    res.json(songsheet);
  });
};

var getImageByName = function(req, res) {
  if (req.params.name == 'placeholder.jpg') {
    res.sendFile(path.join(__dirname, '../public/uploads/placeholder.jpg'));
  } else {
    res.redirect('http://localhost:8080/SolrInteractionServer/FrontEnd/img/jpegs/' + req.params.name);
  }
};


that.handleUpload = handleUpload;
that.getUploads = getUploads;
that.getSongsheetBySignature = getSongsheetBySignature;
that.getImageByName = getImageByName;

module.exports = that;