var host = typeof process.env.HOST !== 'undefined' ? process.env.HOST : '127.0.0.1';
var port = typeof process.env.PORT !== 'undefined' ? process.env.PORT : 3000;
var baseUrl = 'http://' + host + ':' + port + '/';
var mongoUri = typeof process.env.MONGO_URI !== 'undefined' ? process.env.MONGO_URI : 'mongodb://127.0.0.1:27017/melodicsimilarity';
var solrUri = typeof process.env.SOLR_URI !== 'undefined' ? process.env.SOLR_URI : 'http://127.0.0.1:8983/';
var solrInteractionUri = typeof process.env.SOLRINTERACTION_BASE_URI !== 'undefined' ? process.env.SOLRINTERACTION_BASE_URI : 'http://127.0.0.1:8080/';
var awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID;
var awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
var awsRegion = process.env.AWS_REGION;

module.exports = {
  HOST: host,
  PORT: port,
  BASE_URL: baseUrl,
  MONGO_URI: mongoUri,
  SOLR_URI: solrUri,
  SOLRINTERACTION_BASE_URI: solrInteractionUri,
  AWS_ACCESS_KEY_ID: awsAccessKeyId,
  AWS_SECRET_ACCESS_KEY: awsSecretAccessKey,
  AWS_REGION: awsRegion
};