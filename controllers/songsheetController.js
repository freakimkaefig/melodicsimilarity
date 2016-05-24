var path = require('path');
var request = require('sync-request');
var databaseService = require('../services/databaseService');
var databaseConfig = require('../config/database.config.json');

var that = {};

var handleUpload = function(req, res) {
  databaseService.addDocument(req.body, function(results) {
    res.json(results);
  });
};

var getUploads = function(req, res) {
  console.log(req.query);
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
    res.json(songsheet);
  });
};

var getImageByName = function(req, res) {
  var placeholder = path.join(__dirname, '../public/uploads/placeholder.jpg');

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