var AWS = require('aws-sdk');

var that = {};

AWS.config.loadFromPath('./config/aws-config.json');

var bucket = new AWS.S3();

// http://stackoverflow.com/questions/7511321/uploading-base64-encoded-image-to-amazon-s3-via-node-js
var uploadToS3 = function(file, destFileName, type, callback) {
  var buffer = new Buffer(file.replace(/^data:image\/\w+;base64,/, ""), 'base64');
  bucket.upload({
    Bucket: 'melodicsimilarity',
    ACL: 'public-read',
    Body: buffer,
    Key: destFileName.toString(),
    ContentType: type
  })
    .send(callback);
};

that.uploadToS3 = uploadToS3;

module.exports = that;