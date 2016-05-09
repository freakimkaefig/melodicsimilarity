var storageService = require('../services/storageService');

var that = {};

var postUpload = function(req, res) {
  if (!req.body.image) {
    return res.status(500).send('No image');
  }

  var file = req.body;
  storageService.uploadToS3(file.image, file.imageName, file.imageType, function(err, data) {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    return res.json({
      response: data,
      file: file
    });
  });
};

that.postUpload = postUpload;

module.exports = that;