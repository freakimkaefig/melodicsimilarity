var dotenv = require('dotenv');
var env = dotenv.config({silent: true});
var should = require('should');


require('../bin/www');

describe('Backend', function() {
  require('./backend/api');
  require('./backend/auth');
  // require('./backend/solr'); // TODO: Fix testing solr instance queries
});

describe('Frontend', function() {
  require('./frontend/pages');
  // require('./frontend/components');
});



