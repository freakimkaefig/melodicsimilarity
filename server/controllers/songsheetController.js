var path = require('path');
var request = require('sync-request');
var databaseService = require('../services/databaseService');
var databaseConfig = require('../config/database.config.json');

var that = {};

var handleUpload = function(req, res) {
  console.log("Hey");
  databaseService.addDocument(req.body, function(results) {
    res.json(results);
  });
};

var getUploads = function(req, res) {
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

var getSongsheetBySignature = function(req, res) {
  databaseService.getDocument(databaseConfig.collections.songsheets, {signature: req.params.signature}, function(songsheet) {
    if (typeof songsheet !== 'undefined') {
      res.json(songsheet);
    } else {
      res.status(404).send('Songsheet not found!');
    }
  });
};

var getImageByName = function(req, res) {
  console.log(req.params.name);
  var placeholder = path.join(__dirname, '../assets/placeholder.jpg');
  console.log(placeholder);
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
that.getUploads = getUploads;
that.getSongsheetBySignature = getSongsheetBySignature;
that.getImageByName = getImageByName;

module.exports = that;