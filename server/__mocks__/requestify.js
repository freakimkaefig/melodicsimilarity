const Q = require('q');
const requestify = jest.genMockFromModule('requestify');

requestify.get = function() {
  var defer = Q.defer();
  var response = {
    status: 200,
    headers: {
      "content-type": "application/json"
    },
    getBody: function() {
      return {
        highlighting: [
          { key: 'key', value: 'value' },
          { key: 'key', value: 'value' }
        ],
        response: {
          docs: [
            { key: 'key', value: 'value' },
            { key: 'key', value: 'value' }
          ]
        }
      }
    }
  };
  defer.resolve(response);
  return defer.promise;
};


module.exports = requestify;