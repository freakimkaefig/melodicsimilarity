var databaseService = require('../services/databaseService');

var that = {};

var handleUpload = function(req, res) {
  databaseService.addDocument(req.body, function(results) {
    res.send(results);
  });
};

that.handleUpload = handleUpload;

module.exports = that;