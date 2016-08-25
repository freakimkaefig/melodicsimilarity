/**
 * Service component for file upload.
 *
 * Implements 3 different storage connections:
 *   - Disk
 *   - AWS S3
 *   - MongoDB
 */

'use strict';
var AWS = require('aws-sdk');
var fs = require('fs');
var path = require('path');
var urljoin = require('url-join');
var env = require('../../.env.json');
var apiConfig = require('../config/api.config.json');

var that = {};

/**
 * @callback uploadCallback
 * @param {object|boolean} err - Error object
 * @param {object} data - The uploaded data
 */

/**
 * Handles post request for upload
 * @param {object} file - The uploaded file content
 * @param {string} destFileName - The file name
 * @param {string} type - The file type
 * @param {uploadCallback} callback - The upload callback function
 */
var upload = function(file, destFileName, type, callback) {
  switch(apiConfig.uploads.driver) {
    case apiConfig.uploads.connections.s3.driver:
      AWS.config.update({
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
        region: env.AWS_REGION
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

/**
 * Uploads file to disk
 * @param {object} file - The uploaded file content
 * @param {string} destFileName - The file name
 * @param {uploadCallback} callback - The upload callback function
 * @private
 */
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

/**
 * Uploads file to AWS S3
 * Source: {@link // http://stackoverflow.com/questions/7511321/uploading-base64-encoded-image-to-amazon-s3-via-node-js}
 * @param {object} file - The uploaded file content
 * @param {string} destFileName - The file name
 * @param {string} type - The file type
 * @param {uploadCallback} callback - The upload callback function
 * @private
 */
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

/**
 * Uploads file to Mongo DB
 * @param {object} file - The uploaded file content
 * @param {uploadCallback} callback - The upload callback function
 * @private
 */
var _uploadToMongo = function(file, callback) {
  callback(false, {Location: file});
};

that.upload = upload;

module.exports = that;