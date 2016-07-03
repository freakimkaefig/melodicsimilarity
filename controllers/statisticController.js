var MusicJsonToolbox = require('musicjson-toolbox');
var _ = require('lodash');
var databaseConfig = require('../config/database.config.json');
var databaseService = require('../services/databaseService');
var apiConfig = require('../config/api.config.json');

var that = {};

var getStats = function(req, res) {
  databaseService.getStatistics(apiConfig.statistics[req.params.mode].mode, function(result) {
    res.json(result);
  });
};

var updateStats = function(req, res) {
  switch (req.params.mode) {
    case 'notes':
      updateNotes(req, res);
      break;
    case 'intervals':
      updateIntervals(req, res);
      break;
    case 'durations':
      updateDurations(req, res);
      break;
    case 'keys':
      updateKeys(req, res);
      break;
    case 'rests':
      updateRests(req, res);
      break;
    case 'meters':
      updateMeters(req, res);
      break;
    case 'counts':
      updateCounts(req, res);
      break;
    default:
      res.status(404);
      break;
  }
};

var updateNotes = function(req, res) {
  var values = apiConfig.statistics.notes.values;
  var labels = apiConfig.statistics.notes.labels;

  databaseService.getCollection(
    databaseConfig.collections.songsheets,
    0,
    0,
    function(songsheets, count) {
      for (var i = 0; i < count; i++) {
        var notes = MusicJsonToolbox.notes(songsheets[i].json, false, false);
        for (var j = 0; j < notes.length; j++) {
          var step = notes[j].pitch.step;
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
          var index = labels.indexOf(step);
          if (index > -1 && index < labels.length) {
            values[index]++;
          }
        }
      }
      databaseService.updateStatistics(
        apiConfig.statistics.notes.mode,
        values,
        function(result) {
          res.json(result);
        }
      );
    }
  );
};

var updateIntervals = function(req, res) {
  var values = apiConfig.statistics.intervals.values;

  databaseService.getCollection(
    databaseConfig.collections.songsheets,
    0,
    0,
    function(songsheets, count) {
      for (var i = 0; i < count; i++) {
        var intervals = MusicJsonToolbox.intervals(MusicJsonToolbox.notes(songsheets[i].json, false, false), 0);
        for (var j = 0; j < intervals.length; j++) {
          if (intervals[j].value !== '*') {
            var interval = Math.abs(intervals[j].value);
            while (interval > 12) interval -= 12;
            console.log(interval);
            values[interval]++;
          }
        }
      }
      databaseService.updateStatistics(
        apiConfig.statistics.intervals.mode,
        values,
        function(result) {
          res.json(result);
        }
      );
    }
  );
};

var updateDurations = function(req, res) {
  var values = apiConfig.statistics.durations.values;

  databaseService.getCollection(
    databaseConfig.collections.songsheets,
    0,
    0,
    function(songsheets, count) {
      for (var i = 0; i < count; i++) {
        var notes = MusicJsonToolbox.notes(songsheets[i].json, false, false);
        for (var j = 0; j < notes.length; j++) {
          var type = notes[j].type;
          var name = apiConfig.statistics.durations.translation[type];
          if (notes[j].dot === 'true' || notes[j].dot === true) {
            name = apiConfig.statistics.durations.dotted + name;
          }

          var index = _.findIndex(values, ['name', name]);
          if (index > -1) {
            values[index].y++;
          } else {
            values.push({
              name: name,
              y: 1
            });
          }
        }
      }
      databaseService.updateStatistics(
        apiConfig.statistics.durations.mode,
        values,
        function(result) {
          res.json(result);
        }
      );
    }
  );
};

var updateKeys = function(req, res) {
  var values = apiConfig.statistics.keys.values;

  databaseService.getCollection(
    databaseConfig.collections.songsheets,
    0,
    0,
    function(songsheets, count) {
      for (var i = 0; i < count; i++) {
        var fifths = parseInt(songsheets[i].json.attributes.key.fifths);
        var index = fifths+5;
        if (index === -1) index = 11;
        values[index]++;
      }
      databaseService.updateStatistics(
        apiConfig.statistics.keys.mode,
        values,
        function(result) {
          res.json(result);
        }
      );
    }
  );
};

var updateRests = function(req, res) {
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
            var type = notes[j].type;
            var name = apiConfig.statistics.durations.translation[type];
            if (notes[j].dot === 'true' || notes[j].dot === true) {
              name = apiConfig.statistics.durations.dotted + name;
            }
            
            var index = _.findIndex(values, ['name', name]);
            if (index > -1) {
              values[index].y++;
            } else {
              values.push({
                name: name,
                y: 1
              });
            }
          }
        }
      }
      databaseService.updateStatistics(
        apiConfig.statistics.rests.mode,
        values,
        function(result) {
          res.json(result);
        }
      );
    }
  );
};

var updateMeters = function(req, res) {
  var values = apiConfig.statistics.meters.values;

  databaseService.getCollection(
    databaseConfig.collections.songsheets,
    0,
    0,
    function(songsheets, count) {
      for (var i = 0; i < count; i++) {
        var meter = songsheets[i].json.attributes.time.beats + '/' + songsheets[i].json.attributes.time['beat-type'];
        var index = _.findIndex(values, ['name', meter]);
        if (index > -1) {
          values[index].y++;
        } else {
          values.push({
            name: meter,
            y: 1
          });
        }
      }
      databaseService.updateStatistics(
        apiConfig.statistics.meters.mode,
        values,
        function(result) {
          res.json(result);
        }
      );
    }
  );
};

var updateCounts = function(req, res) {
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
        console.log(countData[x], x);
        var boxplot = getBoxplotValues(countData[x], x);
        values[0].data[x] = boxplot.data;
        values[1].data = values[1].data.concat(boxplot.outliers);
      }

      databaseService.updateStatistics(
        apiConfig.statistics.counts.mode,
        values,
        function(result) {
          res.json(result);
        }
      );
    }
  );
};

function getBoxplotValues(data, series) {
  var q1 = getPercentile(data, 25);
  var median = getPercentile(data, 50);
  var q3 = getPercentile(data, 75);

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

//get any percentile from an array
function getPercentile(data, percentile) {
  data.sort(numSort);
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

//because .sort() doesn't sort numbers correctly
function numSort(a,b) {
  return a - b;
}

that.getStats = getStats;
that.updateStats = updateStats;

module.exports = that;