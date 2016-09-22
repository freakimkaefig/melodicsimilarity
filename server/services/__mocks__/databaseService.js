const databaseConfig = require('../../config/database.config.json');
const databaseService = jest.genMockFromModule('../databaseService');

var dummySimilarity1 = {
  signature: 'test1',
  distances: [ {signature: "test2", distance: 0.5} ]
};
var dummySimilarity2 = {
  signature: 'test2',
  distances: [ {signature: "test1", distance: 0.5} ]
};

var dummySongsheet1 = {
  signature: 'test1',
  name: 'test1.json',
  json: require('../../test/test1.json')
};
var dummySongsheet2 = {
  signature: 'test2',
  name: 'test2.json',
  json: require('../../test/test2.json')
};

var dummyStatistics = {
  labels: ["A", "B", "C"],
  values: [10, 0, 20]
};

databaseService.getStats = (callback) => {
  callback({
    'key': 'value'
  });
};

databaseService.getCollection = (collection, start, rows, callback) => {
  if (collection === databaseConfig.collections.users) {
    callback([{
      username: 'admin',
      hash: '$2a$10$fa5PEv5KiADJtD5jlL8b1e48vbcVmTW4mSObSH/rgKqplquA7mJki'
    }], 1);
  }

  if (collection === databaseConfig.collections.similarity) {
    callback([dummySimilarity1, dummySimilarity2], 2);
  }

  if (collection === databaseConfig.collections.songsheets) {
    callback([dummySongsheet1, dummySongsheet2], 2)
  }
};

databaseService.getDocuments = (collection, query, callback) => {
  callback([dummySongsheet1, dummySongsheet2]);
};

databaseService.getDocument = (collection, query, callback) => {
  if (query.signature === 'test1') {
    callback(dummySongsheet1);
  } else if (query.signature === 'test2') {
    callback(dummySongsheet2);
  } else {
    callback(undefined);
  }
};

databaseService.addUser = (username, password, callback) => {
  if (username !== 'fail') {
    callback({
      value: {
        username: username,
        password: password
      },
      ok: 1
    });
  } else {
    callback({
      message: "Username is to short"
    });
  }
};

databaseService.getSetting = (key, callback) => {
  callback({
    type: 'type',
    key: key,
    value: 'value'
  });
};

databaseService.setSetting = (key, value, callback) => {
  callback({
    value: {
      type: 'type',
      key: key,
      value: value
    },
    ok: 1
  });
};

databaseService.getStatistics = (mode, callback) => {
  if (mode === 'notes'
    || mode === 'intervals'
    || mode === 'durations'
    || mode === 'keys'
    || mode === 'rests'
    || mode === 'meters') {
    callback({
      mode: mode,
      songsheetsCount: 2,
      data: dummyStatistics
    });
  } else if (mode === 'counts') {
    callback({
      mode: mode,
      songsheetsCount: 2,
      data: [
        { name: 'Series 1', data: [ [1, 2, 3], [4, 5, 6], [7, 8, 9] ] },
        { name: 'Series 2', data: [ [3, 2, 1], [6, 5, 4], [9, 8, 7] ] },
      ]
    });
  } else {
    callback(undefined);
  }
};

databaseService.updateStatistics = (mode, count, data, callback) => {
  if (mode === 'notes'
    || mode === 'intervals'
    || mode === 'durations'
    || mode === 'keys'
    || mode === 'rests'
    || mode === 'meters') {
    callback({
      value: {
        mode: mode,
        songsheetsCount: count,
        data: dummyStatistics
      },
      ok: 1
    });
  } else if (mode === 'counts') {
    callback({
      value: {
        mode: mode,
        songsheetsCount: count,
        data: [
          {name: 'Series 1', data: [[1, 2, 3], [4, 5, 6], [7, 8, 9]]},
          {name: 'Series 2', data: [[3, 2, 1], [6, 5, 4], [9, 8, 7]]},
        ]
      },
      ok: 1
    });
  } else {
    callback(undefined);
  }
};

databaseService.getSimilarity = (signature, callback) => {
  if (signature === dummySimilarity1.signature) {
    callback(dummySimilarity1);
  } else if (signature === dummySimilarity2.signature) {
    callback(dummySimilarity2);
  } else {
    callback(undefined);
  }
};

databaseService.updateSimilarity = (signature, distances, callback) => {
  if (signature === dummySimilarity1.signature) {
    callback({
      value: dummySimilarity1,
      ok: 1
    });
  } else if (signature === dummySimilarity2.signature) {
    callback({
      value: dummySimilarity2,
      ok: 1
    });
  } else {
    callback(undefined);
  }
};

databaseService.addDocument = (data, callback) => {
  callback({
    value: {
      signature: data.signature,
      name: data.name,
      json: data.json
    },
    signature: data.signature,
    ok: 1
  });
};

module.exports = databaseService;