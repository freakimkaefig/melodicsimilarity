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

that.getStats = getStats;
that.updateStats = updateStats;

module.exports = that;