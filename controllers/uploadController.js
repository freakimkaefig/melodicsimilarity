var databaseService = require('../services/databaseService');

var that = {};

var handleUpload = function(req, res) {
  databaseService.addDocument(req.body.documents, function(documents) {
    res.send(documents);
  });
};

that.handleUpload = handleUpload;

module.exports = that;