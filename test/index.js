var dotenv = require('dotenv');
var env = dotenv.config({silent: true});
var should = require('should');


require('../bin/www');

describe('Backend', function() {
  require('./backend/api');
  require('./backend/auth');
  require('./backend/solr');
});

describe('Frontend', function() {
  require('./frontend/HomePage');
});



