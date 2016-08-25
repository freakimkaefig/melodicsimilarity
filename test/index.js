var env = require('../.env.json');
var should = require('should');

process.env.BASE_URL = env.BASE_URL;
process.env.MONGO_URI = env.MONGO_URI;

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



