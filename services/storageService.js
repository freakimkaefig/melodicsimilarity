var AWS = require('aws-sdk');
var fs = require('fs');
var path = require('path');
var urljoin = require('url-join');
var env = require('../.env');
var apiConfig = require('../config/api.config.json');

var that = {};

var upload = function(file, destFileName, type, callback) {
  switch(apiConfig.uploads.driver) {
    case apiConfig.uploads.connections.s3.driver:
      AWS.config.update({
        accessKeyId: env.AWS_CONFIG.ACCESS_KEY_ID,
        secretAccessKey: env.AWS_CONFIG.SECRET_ACCESS_KEY,
        region: env.AWS_CONFIG.REGION
      });
      _uploadToS3(file, destFileName, type, callback);
      break;

    case apiConfig.uploads.connections.mongo.driver:
      _uploadToMongo(file, callback);
      break;

    default:
      _uploadToDisk(file, destFileName, callback);
      break;
  }
};

var _uploadToDisk = function(file, destFileName, callback) {
  var buffer = new Buffer(file.replace(/^data:image\/\w+;base64,/, ""), 'base64');
  var urlPath = urljoin(env.BASE_URL, apiConfig.uploads.connections.disk.path, destFileName);
  var filePath = path.join('public/', apiConfig.uploads.connections.disk.path, destFileName);
  fs.writeFile(
    filePath,
    buffer,
    function(err) {
      callback(err, {Location: urlPath});
    }
  )
};

// http://stackoverflow.com/questions/7511321/uploading-base64-encoded-image-to-amazon-s3-via-node-js
var _uploadToS3 = function(file, destFileName, type, callback) {
  var buffer = new Buffer(file.replace(/^data:image\/\w+;base64,/, ""), 'base64');
  var bucket = new AWS.S3();
  bucket.upload({
    Bucket: apiConfig.uploads.connections.s3.bucketName,
    ACL: 'public-read',
    Body: buffer,
    Key: destFileName.toString(),
    ContentType: type
  })
    .send(callback);
};

var _uploadToMongo = function(file, callback) {
  callback(false, {Location: file});
};

that.upload = upload;

module.exports = that;