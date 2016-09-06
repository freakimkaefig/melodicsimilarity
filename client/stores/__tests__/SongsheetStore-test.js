import {
  UPDATE_SONGSHEET_START,
  LOAD_LIST,
  LOAD_ITEM,
  UPDATE_SIMILAR,
  LOAD_SIMILAR_ITEM
} from '../../constants/SongsheetConstants';
import {
  UPDATE_METADATA,
  METADATA_PLACEHOLDER_IMAGE,
  METADATA_PLACEHOLDER_TITLE,
  METADATA_PLACEHOLDER_TEXT,
  UPDATE_SIMILAR_METADATA
} from '../../constants/SolrConstants';

jest.mock('../../dispatchers/AppDispatcher');
jest.mock('../../helpers/ArrayHelper');
jest.mock('../../services/SongsheetService');

describe('SongsheetStore', () => {

  var AppDispatcher;
  var ArrayHelper;
  var SongsheetStore;
  var callback;

  var songsheet1 = { signature: 'abc123', name: 'Songsheet 1', json: {} };
  var songsheet2 = { signature: 'xyz456', name: 'Songsheet 2', json: {} };
  var metadata1 = { signature: 'abc123', imagename: 'abc123.jpg', title: 'Songsheet 1' };
  var metadataPlaceholder1 = { signature: 'abc123', title: 'Kein Incipit vorhanden', text: 'Kein Liedtext vorhanden', imagename: 'placeholder.jpg' };
  var metadataPlaceholder2 = { signature: 'xyz456', title: 'Kein Incipit vorhanden', text: 'Kein Liedtext vorhanden', imagename: 'placeholder.jpg' };
  var similar1 = { distance: 0.75, signature: 'xyz456' };
  var similar2 = { distance: 0.3, signature: 'def789' };

  var actionUpdateStart = {
    actionType: UPDATE_SONGSHEET_START,
    value: 10
  };

  var actionRenderList = {
    actionType: LOAD_LIST,
    songsheets: [songsheet1, songsheet2],
    totalCount: 2
  };

  var actionRenderItem = {
    actionType: LOAD_ITEM,
    songsheet: songsheet1
  };

  var actionRenderMetadata = {
    actionType: UPDATE_METADATA,
    response: {
      response: {
        docs: [metadata1],
        numFound: 1,
        start: 0
      },
      responseHeader: {}
    }
  };

  var actionUpdateSimilar = {
    actionType: UPDATE_SIMILAR,
    similar: [similar1, similar2]
  };

  var actionRenderSimilarItem = {
    actionType: LOAD_SIMILAR_ITEM,
    songsheet: songsheet1
  };

  var actionUpdateSimilarMetadata = {
    actionType: UPDATE_SIMILAR_METADATA,
    response: {
      response: {
        docs: [metadata1],
        numFound: 1,
        start: 0
      },
      responseHeader: {}
    }
  };

  beforeEach(() => {
    jest.resetModules();
    AppDispatcher = require('../../dispatchers/AppDispatcher').default;
    ArrayHelper = require('../../helpers/ArrayHelper').default;
    SongsheetStore = require('../SongsheetStore').default;
    callback = AppDispatcher.register.mock.calls[0][0];
  });

  it('registers a callback with the dispatcher', () => {
    expect(AppDispatcher.register.mock.calls.length).toBe(1);
  });

  it('should initialize empty', () => {
    let {
      start,
      totalCount,
      songsheets,
      metadata,
      songsheet,
      similarityScores,
      similarSongsheets,
      similarMetadata
    } = SongsheetStore;
    expect(start).toBe(0);
    expect(totalCount).toBe(0);
    expect(songsheets.length).toBe(0);
    expect(metadata.length).toBe(0);
    expect(songsheet).toEqual({});
    expect(similarityScores.length).toBe(0);
    expect(similarSongsheets.length).toBe(0);
    expect(similarMetadata.length).toBe(0);
  });

  it('should update pager start', () => {
    callback(actionUpdateStart);
    expect(SongsheetStore.start).toBe(10);
  });

  it('should store list of songsheets', () => {
    ArrayHelper.mergeByProperty = jest.fn()
      .mockImplementationOnce(() => {
        SongsheetStore._metadata = [metadataPlaceholder1];
      })
      .mockImplementationOnce(() => {
        SongsheetStore._metadata = [metadataPlaceholder1, metadataPlaceholder2];
      });
    callback(actionRenderList);
    expect(SongsheetStore.songsheets.length).toBe(2);
    expect(SongsheetStore.songsheets).toEqual([songsheet1, songsheet2]);
    expect(SongsheetStore.totalCount).toBe(2);
    expect(ArrayHelper.mergeByProperty).toBeCalledWith([], [metadataPlaceholder1], 'signature');
    expect(ArrayHelper.mergeByProperty).toBeCalledWith([metadataPlaceholder1], [metadataPlaceholder2], 'signature');
    expect(SongsheetStore.metadata.length).toBe(2);
    expect(SongsheetStore.metadata).toEqual([metadataPlaceholder1, metadataPlaceholder2]);
  });

  it('should store selected songsheet', () => {
    callback(actionRenderItem);
    expect(SongsheetStore.songsheets.length).toBe(1);
    expect(SongsheetStore.songsheets).toEqual([songsheet1]);
    expect(SongsheetStore.songsheet).toEqual(songsheet1);
  });

  it('should update metadata', () => {
    callback({ actionType: UPDATE_METADATA, response: { response: { numFound: 0 } } });

    ArrayHelper.mergeByProperty = jest.fn()
      .mockImplementationOnce(() => {
        SongsheetStore._metadata = [metadata1];
      });
    callback(actionRenderMetadata);
    expect(ArrayHelper.mergeByProperty).toBeCalledWith([], [metadata1], 'signature');
    expect(SongsheetStore.metadata.length).toBe(1);
    expect(SongsheetStore.metadata).toEqual([metadata1]);
  });

  it('should update similar songsheets', () => {
    ArrayHelper.arrayDiff = jest.fn()
      .mockImplementationOnce(() => {
        return [similar1, similar2];
      });
    var SongsheetService = require('../../services/SongsheetService').default;
    callback(actionUpdateSimilar);
    expect(SongsheetStore.similarityScores.length).toBe(2);
    expect(SongsheetStore.similarityScores).toEqual([similar1, similar2]);
    expect(SongsheetService.loadSimilarItem).toBeCalledWith(similar2.signature);
  });

  it('should store similar items', () => {
    ArrayHelper.mergeByProperty = jest.fn()
      .mockImplementationOnce(() => {
        SongsheetStore._similarSongsheets = [songsheet1];
      });
    callback(actionRenderSimilarItem);
    expect(ArrayHelper.mergeByProperty).toBeCalledWith([], [songsheet1], 'signature');
    expect(SongsheetStore.similarSongsheets.length).toBe(1);
    expect(SongsheetStore.similarSongsheets).toEqual([songsheet1]);
  });

  it('should store similar item\'s metadata', () => {
    ArrayHelper.mergeByProperty = jest.fn()
      .mockImplementationOnce(() => {
        SongsheetStore._similarMetadata = [metadata1];
      });
    callback(actionUpdateSimilarMetadata);
    expect(ArrayHelper.mergeByProperty).toBeCalledWith([], [metadata1], 'signature');
    expect(SongsheetStore.similarMetadata.length).toBe(1);
    expect(SongsheetStore.similarMetadata).toEqual([metadata1]);
  });

});