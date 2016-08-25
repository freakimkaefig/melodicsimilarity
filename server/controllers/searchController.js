/**
 * Backend controller for handling search queries.
 */

'use strict';
var requestify = require('requestify');
var when = require('when');
var _ = require('lodash');
var MusicJsonToolbox = require('musicjson-toolbox');
var databaseService = require('../services/databaseService');
var apiConfig = require('../config/api.config.json');
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

/**
 * Merges results of solr and melody search.
 * @returns {Array.<object>} The merged results, that should be returned to the user
 * @private
 */
var _mergeResults = function() {
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

  _.each(results, function(melodyResult) {
    var find = _.find(store.solrResults, function(solrResult) {
      return solrResult.id === melodyResult.id;
    });

    if (!find) {
      melodyResult.rank += 0.5;
    }
  });

  return results.sort(function(a, b) {
    return a.rank - b.rank || b.maxSimilarityCount - a.maxSimilarityCount;
  });
};

/**
 * Handle POST request for search form.
 * @param {object} req - request object
 * @param {object} res - response object
 */
var search = function(req, res) {
  // Reset stored variables from earlier search sessions
  _resetStore();

  // Update stored search
  store.solrQuery = req.body.solrQuery;
  store.melodyMode = req.body.melodyMode;
  store.melodyQuery = req.body.melodyQuery;

  store.res = res;

  // Determine callback by melody mode
  var callback = null;
  if (store.melodyQuery) {
    switch(store.melodyMode) {
      case apiConfig.search.melodyMode.melody.name:
        callback = _searchMelody;
        break;

      case apiConfig.search.melodyMode.intervals.name:
        callback = _searchIntervals;
        break;

      case apiConfig.search.melodyMode.parsons.name:
        callback = _searchParson;
        break;
    }
  }

  // Request solr API if necessary
  if (store.solrQuery !== false) {
    var solrRequest = requestify.get(store.solrQuery);
    return _handleSolrSearch(when(solrRequest), callback);
  } else {
    callback();
  }
};

/**
 * Manages response from solr search
 * @param {Promise} solrSearchPromise - The solr search promise
 * @param {onSolrCallback} callback - The callback function defined by melody search mode
 * @private
 */
var _handleSolrSearch = function(solrSearchPromise, callback) {
  return solrSearchPromise
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
      // Preprocess solr response
      for (var i = 0; i < solrResponse.response.docs.length; i++) {
        solrResults.push({
          id: solrResponse.response.docs[i].signature,
          metadata: solrResponse.response.docs[i],
          highlighting: _.find(highlights, function(item) {
            return item.id === solrResponse.response.docs[i].id;
          }),
          maxSimilarityCount: 0,
          rank: i / solrResponse.response.docs.length / 2
        });
      }

      // store solr response for later usage
      store.solrResults = solrResults;

      if (callback !== null) {
        callback();
      } else {
        _handleResults();
      }
    });
};

/**
 * Triggers result merging and sends response through response object.
 * @private
 */
var _handleResults = function() {
  var results = _mergeResults();

  // send results
  store.res.json(results);
};

/**
 * Reset stored variables from earlier search sessions.
 * @private
 */
var _resetStore = function() {
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

/**
 * Search in songsheets by parsons code
 * @callback onSolrCallback
 * @private
 */
var _searchParson = function() {
  var parson = '*' + store.melodyQuery.parson;
  var threshold = store.melodyQuery.threshold / 100;
  databaseService.getCollection(
    databaseConfig.collections.songsheets,
    0,
    0,
    function(songsheets, count) {
      var results = [];
      for (var i = 0; i < count; i++) {
        // Calculate similarities between songsheets and search
        var similarities = MusicJsonToolbox.parsonsNgramSimilarity(songsheets[i].json, parson);

        // Determine maximum similarity
        var maxSimilarity = Math.max(...similarities.map(function(item) {
          return item.similarity;
        }));


        // only return results above threshold
        if (maxSimilarity >= threshold) {
          let maxSimilarityCount = similarities.filter(function(item) {
            return item.similarity === maxSimilarity;
          }).length;
          results.push({
            id: songsheets[i].signature,
            abc: songsheets[i].abc,
            json: songsheets[i].json,
            melodic: similarities,
            maxSimilarity: maxSimilarity,
            maxSimilarityCount: maxSimilarityCount,
            rank: 1 - maxSimilarity
          });
        }
      }

      // store response
      store.melodyResponse = {
        results: results.sort(function(a, b) {
          return a.rank - b.rank;
        }),
        rankingFactor: 1
      };
      _handleResults();
    }
  );
};

/**
 * Search in songsheets by intervals
 * @callback onSolrCallback
 * @private
 */
var _searchIntervals = function() {
  var defaultIntervals = ['*'];
  var intervals = defaultIntervals.concat(store.melodyQuery.intervals.split(' ').map(function(item) {
    return parseInt(item);
  }));
  var threshold = store.melodyQuery.threshold / 100;
  databaseService.getCollection(
    databaseConfig.collections.songsheets,
    0,
    0,
    function(songsheets, count) {
      var results = [];
      for (var i = 0; i < count; i++) {
        // Calculate similarities between songsheets and search
        var similarities = MusicJsonToolbox.intervalNgramSimilarity(songsheets[i].json, intervals);

        // Determine maximum similarity
        var maxSimilarity = Math.max(...similarities.map(function(item) {
          return item.similarity;
        }));

        // only return results above threshold
        if (maxSimilarity >= threshold) {
          let maxSimilarityCount = similarities.filter(function(item) {
            return item.similarity === maxSimilarity;
          }).length;
          results.push({
            id: songsheets[i].signature,
            abc: songsheets[i].abc,
            json: songsheets[i].json,
            melodic: similarities,
            maxSimilarity: maxSimilarity,
            maxSimilarityCount: maxSimilarityCount,
            rank: 1 - maxSimilarity
          });
        }
      }

      // store response
      store.melodyResponse = {
        results: results.sort(function(a, b) {
          return a.rank - b.rank;
        }),
        rankingFactor: 1
      };
      _handleResults();
    }
  );
};

/**
 * Search in songsheets by pitch and duration
 * @callback onSolrCallback
 * @private
 */
var _searchMelody = function() {
  var melody = store.melodyQuery.melody;
  var threshold = store.melodyQuery.threshold / 100;
  databaseService.getCollection(
    databaseConfig.collections.songsheets,
    0,
    0,
    function(songsheets, count) {
      var results = [];
      for (var i = 0; i < count; i++) {
        // Calculate distance between songsheets and search
        var similarities = MusicJsonToolbox.pitchDurationNgramSimilarity(
          songsheets[i].json,
          MusicJsonToolbox.pitchDurationValues(
            melody,
            0, 16, 4
          )
        );

        // Determine minimum distance
        var maxSimilarity = Math.max(...similarities.map(function(item) {
          return item.similarity;
        }));

        // only return results above threshold
        if (maxSimilarity >= threshold) {
          let maxSimilarityCount = similarities.filter(function(item) {
            return item.similarity === maxSimilarity;
          }).length;
          results.push({
            id: songsheets[i].signature,
            abc: songsheets[i].abc,
            json: songsheets[i].json,
            melodic: similarities,
            maxSimilarity: maxSimilarity,
            maxSimilarityCount: maxSimilarityCount,
            rank: 1 - maxSimilarity
          });
        }
      }

      // store response
      store.melodyResponse = {
        results: results.sort(function(a, b) {
          return a.rank - b.rank;
        }),
        rankingFactor: 1
      };
      _handleResults();
    }
  );
};

that.search = search;

module.exports = that;