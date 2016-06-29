var requestify = require('requestify');
var when = require('when');
var _ = require('lodash');
var MusicJsonToolbox = require('musicjson-toolbox');
var databaseService = require('../services/databaseService');
var databaseConfig = require('../config/database.config.json');

var that = {};

var store = {
  solrResults: [],
  solrQuery: null,
  solrResponse: null,
  melodyMode: null,
  melodyQuery: null,
  melodyResponse: {
    results: [],
    rankingFactor: 0
  },
  res: null
};

var mergeResults = function() {
  var results = store.melodyResponse.results;

  _.each(store.solrResults, function(solrResult) {
    var find = _.find(results, function(result) {
      return result.id === solrResult.id;
    });

    if (find) {
      find.metadata = solrResult.metadata;
      find.highlighting = solrResult.highlighting;
      find.rank += solrResult.rank;
    } else {
      solrResult.rank += store.melodyResponse.rankingFactor;
      results.push(solrResult)
    }

  });
  
  // if (results.length <= 0) return false;

  return results.sort(function(a, b) {
    return a.rank - b.rank;
  });
};

var search = function(req, res) {
  resetStore();
  store.solrQuery = req.body.solrQuery;
  store.melodyMode = req.body.melodyMode;
  store.melodyQuery = req.body.melodyQuery;
  store.res = res;

  var callback = null;
  if (store.melodyQuery) {
    switch(store.melodyMode) {
      case 'MELODY':
        break;

      case 'INTERVALS':
        callback = searchIntervals;
        break;

      case 'PARSONS':
        callback = searchParson;
        break;
    }
  }

  if (store.solrQuery !== false) {
    var solrRequest = requestify.get(store.solrQuery);
    return handleSolrSearch(when(solrRequest), callback);
  } else {
    callback();
  }
};

var handleSolrSearch = function(solrSearchPremise, callback) {
  return solrSearchPremise
    .then(function(response) {
      var solrResponse = response.getBody();
      var highlights = [];
      for (var item in solrResponse.highlighting) {
        if (!solrResponse.highlighting.hasOwnProperty(item)) continue;
        highlights.push({
          id: item,
          fields: solrResponse.highlighting[item]
        });
      }

      var solrResults = [];
      for (var i = 0; i < solrResponse.response.docs.length; i++) {
        solrResults.push({
          id: solrResponse.response.docs[i].signature,
          metadata: solrResponse.response.docs[i],
          highlighting: _.find(highlights, function(item) {
            return item.id === solrResponse.response.docs[i].id;
          }),
          rank: i
        });
      }
      store.solrResults = solrResults;

      if (callback !== null) {
        callback();
      } else {
        handleResults();
      }
    });
};

var handleResults = function() {
  var results = mergeResults();

  store.res.json(results);
};

var resetStore = function() {
  store = {
    solrResults: [],
    solrQuery: null,
    solrResponse: null,
    melodyMode: null,
    melodyQuery: null,
    melodyResponse: {
      results: [],
      rankingFactor: 0
    },
    res: null
  };
};

var searchParson = function() {
  var parson = store.melodyQuery.parson;
  var threshold = store.melodyQuery.threshold;
  databaseService.getCollection(
    databaseConfig.collections.songsheets,
    0,
    0,
    function(songsheets, count) {
      var results = [];
      for (var i = 0; i < count; i++) {
        var distance = MusicJsonToolbox.distanceParsonsNgrams(songsheets[i].json, parson);
        var minDistance = Math.min(...distance.map(function(item) {
          return item.distance;
        }));

        if (100 - ((100 / parson.length) * minDistance) >= threshold) {
          results.push({
            id: songsheets[i].signature,
            abc: songsheets[i].abc,
            json: songsheets[i].json,
            melodic: distance,
            minDistance: minDistance,
            rank: minDistance
          });
        }
      }
      store.melodyResponse = {
        results: results.sort(function(a, b) {
          return a.rank - b.rank;
        }),
        rankingFactor: parson.length
      };
      handleResults();
    }
  );
};

var searchIntervals = function() {
  var intervals = store.melodyQuery.intervals.split(' ').map(function(item) {
    return parseInt(item);
  });
  var threshold = store.melodyQuery.threshold;
  databaseService.getCollection(
    databaseConfig.collections.songsheets,
    0,
    0,
    function(songsheets, count) {
      var results = [];
      for (var i = 0; i < count; i++) {
        var distance = MusicJsonToolbox.distanceIntervalsNgrams(songsheets[i].json, intervals);
        var minDistance = Math.min(...distance.map(function(item) {
          return item.distance;
        }));

        console.log(threshold, intervals.length);
        console.log(100 - ((100 / intervals.length) * minDistance) >= threshold);

        if (100 - ((100 / intervals.length) * minDistance) >= threshold) {
          results.push({
            id: songsheets[i].signature,
            abc: songsheets[i].abc,
            json: songsheets[i].json,
            melodic: distance,
            minDistance: minDistance,
            rank: minDistance
          });
        }
      }
      store.melodyResponse = {
        results: results.sort(function(a, b) {
          return a.rank - b.rank;
        }),
        rankingFactor: intervals.length
      };
      handleResults();
    }
  );
};

that.search = search;

module.exports = that;