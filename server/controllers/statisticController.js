/**
 * Backend controller for handling statistic data.
 */

'use strict';
var MusicJsonToolbox = require('musicjson-toolbox');
var _ = require('lodash');
var databaseConfig = require('../config/database.config.json');
var databaseService = require('../services/databaseService');
var apiConfig = require('../config/api.config.json');

var that = {};

/**
 * Handles GET request for statistics data
 * @param {object} req - request object
 * @param {object} res - response object
 */
var getStats = function(req, res) {
  var modeConfig = apiConfig.statistics[req.params.mode];
  if (typeof modeConfig !== 'undefined') {
    databaseService.getStatistics(modeConfig.mode, function (result) {
      res.json(result);
    });
  } else {
    res.status(404).send('Mode not available!');
  }
};

/**
 * Handles PUT request for statistics data
 * @param {object} req - request object
 * @param {object} res - response object
 */
var putStats = function(req, res) {
  /**
   * @callback updateCallback
   * @param {object} - The database result
   */
  updateStats(req.params.mode, function(result) {
    if (result) {
      res.json(result);
    } else {
      res.status(404).send('Mode not available!');
    }
  });
};

/**
 * Update stats for given mode
 * @param {strong} mode - The required mode
 * @param callback
 */
var updateStats = function(mode, callback) {
  // Select correct calculation function for given mode
  switch (mode) {
    case 'notes':
      updateNotes(callback);
      break;
    case 'intervals':
      updateIntervals(callback);
      break;
    case 'durations':
      updateDurations(callback);
      break;
    case 'keys':
      updateKeys(callback);
      break;
    case 'rests':
      updateRests(callback);
      break;
    case 'meters':
      updateMeters(callback);
      break;
    case 'counts':
      updateCounts(callback);
      break;
    default:
      callback(false);
      break;
  }
};

/**
 * Updates statistics for notes
 * @param {updateCallback} callback - The callback function
 */
var updateNotes = function(callback) {
  var labels = apiConfig.statistics.notes.labels;
  var values = apiConfig.statistics.notes.values;

  databaseService.getCollection(
    databaseConfig.collections.songsheets,
    0,
    0,
    function(songsheets, count) {
      for (var i = 0; i < count; i++) {
        // Extract notes from songsheet
        var notes = MusicJsonToolbox.notes(songsheets[i].json, false, false);
        for (var j = 0; j < notes.length; j++) {
          var step = notes[j].pitch.step;

          // Determine alter value
          if (typeof notes[j].pitch.alter !== 'undefined') {
            var alter = parseInt(notes[j].pitch.alter);
            switch (alter) {
              case -1:
                step += 'b';
                break;
              case 1:
                step += '#';
                break;
            }
          }

          // Increase value for calculated note
          var index = labels.indexOf(step);
          if (index > -1 && index < labels.length) {
            values[index]++;
          }
        }
      }

      // Update database entry for notes
      databaseService.updateStatistics(
        apiConfig.statistics.notes.mode,
        {
          labels: labels,
          values: values
        },
        callback
      );
    }
  );
};

/**
 * Updates statistics for intervals
 * @param {updateCallback} callback - The callback function
 */
var updateIntervals = function(callback) {
  var labels = apiConfig.statistics.intervals.labels;
  var values = apiConfig.statistics.intervals.values;

  databaseService.getCollection(
    databaseConfig.collections.songsheets,
    0,
    0,
    function(songsheets, count) {
      for (var i = 0; i < count; i++) {
        // extract intervals from songsheet
        var intervals = MusicJsonToolbox.intervals(MusicJsonToolbox.notes(songsheets[i].json, false, false), 0);
        for (var j = 0; j < intervals.length; j++) {
          if (intervals[j].value !== '*') {
            // determine interval and increase values
            var interval = Math.abs(intervals[j].value);
            while (interval > 12) interval -= 12;
            values[interval]++;
          }
        }
      }

      // Update database entry for intervals
      databaseService.updateStatistics(
        apiConfig.statistics.intervals.mode,
        {
          labels: labels,
          values: values
        },
        callback
      );
    }
  );
};

/**
 * Updates statistics for durations
 * @param {updateCallback} callback - The callback function
 */
var updateDurations = function(callback) {
  var labels = apiConfig.statistics.durations.labels;
  var values = apiConfig.statistics.durations.values;

  databaseService.getCollection(
    databaseConfig.collections.songsheets,
    0,
    0,
    function(songsheets, count) {
      for (var i = 0; i < count; i++) {
        var notes = MusicJsonToolbox.notes(songsheets[i].json, false, false);
        for (var j = 0; j < notes.length; j++) {
          // get note duration
          var type = notes[j].type;
          var name = apiConfig.statistics.durations.translation[type];
          if (notes[j].dot === 'true' || notes[j].dot === true) {
            name = apiConfig.statistics.durations.dotted + name;
          }

          // increase or add value
          var index = labels.indexOf(name);
          if (index > -1) {
            values[index]++;
          } else {
            labels.push(name);
            values.push(1);
          }
        }
      }

      // Update database entry for durations
      databaseService.updateStatistics(
        apiConfig.statistics.durations.mode,
        {
          labels: labels,
          values: values
        },
        callback
      );
    }
  );
};

/**
 * Updates statistics for keys
 * @param {updateCallback} callback - The callback function
 */
var updateKeys = function(callback) {
  var labels = apiConfig.statistics.keys.labels;
  var values = apiConfig.statistics.keys.values;

  databaseService.getCollection(
    databaseConfig.collections.songsheets,
    0,
    0,
    function(songsheets, count) {
      for (var i = 0; i < count; i++) {
        var fifths = parseInt(songsheets[i].json.attributes.key.fifths);

        // increase or add value
        var index = fifths+5;
        if (index === -1) index = 11;
        values[index]++;
      }

      // Update database entry for keys
      databaseService.updateStatistics(
        apiConfig.statistics.keys.mode,
        {
          labels: labels,
          values: values
        },
        callback
      );
    }
  );
};

/**
 * Updates statistics for rests
 * @param {updateCallback} callback - The callback function
 */
var updateRests = function(callback) {
  var labels = apiConfig.statistics.rests.labels;
  var values = apiConfig.statistics.rests.values;

  databaseService.getCollection(
    databaseConfig.collections.songsheets,
    0,
    0,
    function(songsheets, count) {
      for (var i = 0; i < count; i++) {
        var notes = MusicJsonToolbox.notes(songsheets[i].json, false, true);
        for (var j = 0; j < notes.length; j++) {
          if (notes[j].rest === 'true' || notes[j].rest === true) {
            // get rest duration
            var type = notes[j].type;
            var name = apiConfig.statistics.durations.translation[type];
            if (notes[j].dot === 'true' || notes[j].dot === true) {
              name = apiConfig.statistics.durations.dotted + name;
            }

            // increase or add value
            var index = labels.indexOf(name);
            if (index > -1) {
              values[index]++;
            } else {
              labels.push(name);
              values.push(1);
            }
          }
        }
      }

      // Update database entry for rests
      databaseService.updateStatistics(
        apiConfig.statistics.rests.mode,
        {
          labels: labels,
          values: values
        },
        callback
      );
    }
  );
};

/**
 * Updates statistics for meters
 * @param {updateCallback} callback - The callback function
 */
var updateMeters = function(callback) {
  var labels = apiConfig.statistics.meters.labels;
  var values = apiConfig.statistics.meters.values;

  databaseService.getCollection(
    databaseConfig.collections.songsheets,
    0,
    0,
    function(songsheets, count) {
      for (var i = 0; i < count; i++) {
        // get meter from songsheet
        var meter = songsheets[i].json.attributes.time.beats + '/' + songsheets[i].json.attributes.time['beat-type'];

        // increase or add value
        var index = labels.indexOf(meter);
        if (index > -1) {
          values[index]++;
        } else {
          labels.push(meter);
          values.push(1);
        }
      }

      // Update database entry for meters
      databaseService.updateStatistics(
        apiConfig.statistics.meters.mode,
        {
          labels: labels,
          values: values
        },
        callback
      );
    }
  );
};

/**
 * Updates statistics for note, rest and measure counts per songsheet
 * @param {updateCallback} callback - The callback function
 */
var updateCounts = function(callback) {
  var values = apiConfig.statistics.counts.values;

  databaseService.getCollection(
    databaseConfig.collections.songsheets,
    0,
    0,
    function(songsheets, count) {
      var countData = [
        [], // 0 = notes
        [], // 1 = rests
        []  // 2 = measures
      ];

      // count notes, rests and measures for each songsheet
      for (var i = 0; i < count; i++) {
        var notes = MusicJsonToolbox.notes(songsheets[i].json, false, false).length;
        countData[0].push(notes);
        var rests = MusicJsonToolbox.notes(songsheets[i].json, false, true).length - notes;
        countData[1].push(rests);
        var measures = songsheets[i].json.measures.length;
        countData[2].push(measures);
      }

      // generate box plot values for notes, rests and measures
      for (var x = 0; x < countData.length; x++) {
        var boxplot = _getBoxplotValues(countData[x], x);
        values[0].data[x] = boxplot.data;
        values[1].data = values[1].data.concat(boxplot.outliers);
      }

      // Update database entry for note, rest and measure counts per songsheet
      databaseService.updateStatistics(
        apiConfig.statistics.counts.mode,
        values,
        callback
      );
    }
  );
};

/**
 * Calculate boxplot values for data.
 * Source: {@link http://jsfiddle.net/jlbriggs/pvq03hr8/}
 * @param {Array} data - The raw data for boxplot
 * @param {number} series - The series number
 * @returns {{data: *[], outliers: *}}
 * @private
 */
function _getBoxplotValues(data, series) {
  var q1 = _getPercentile(data, 25);
  var median = _getPercentile(data, 50);
  var q3 = _getPercentile(data, 75);

  var iqr = Math.abs(q3 - q1);

  var min = Math.min.apply(Math, data);
  var allowedMin = q1 - (1.5 * iqr);
  allowedMin = allowedMin < 0 ? 0 : allowedMin;
  var low = min >= allowedMin ? min : allowedMin;

  var max = Math.max.apply(Math, data);
  var allowedMax = q3 + (1.5 * iqr);
  var high = min <= allowedMax ? max : allowedMax;

  var outliers = data.filter(function(value) {
    return value < low || value > high;
  }).map(function(value) {
    return [series, value];
  });

  return {
    data: [low, q1, median, q3, high],
    outliers: outliers
  };
}

/**
 * get any percentile from an array
 * Source: {@link http://jsfiddle.net/jlbriggs/pvq03hr8/}
 * @param {Array} data - The data for which the percentile should be calculated
 * @param {number} percentile - The percentile that should be calculated
 * @returns {number} Return the percentile value
 * @private
 */
function _getPercentile(data, percentile) {
  data.sort(_numSort);
  var index = (percentile/100) * data.length;
  var result;
  if (Math.floor(index) == index) {
    result = (data[(index-1)] + data[index])/2;
  }
  else {
    result = data[Math.floor(index)];
  }
  return result;
}

/**
 * Fix sort, because .sort() doesn't sort numbers correctly
 * Source: {@link http://jsfiddle.net/jlbriggs/pvq03hr8/}
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} Returns sort
 * @private
 */
function _numSort(a,b) {
  return a - b;
}

that.getStats = getStats;
that.putStats = putStats;
that.updateStats = updateStats;

module.exports = that;