import {
  UPDATE_SONGSHEET_START,
  LOAD_LIST,
  LOAD_ITEM,
  UPDATE_SIMILAR,
  DELETE_SONGSHEET,
  LOAD_SIMILAR_ITEM
} from '../../constants/SongsheetConstants';
import {
  UPDATE_METADATA,
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
  var songsheetPlaceholder1 = { signature: 'abc123', name: 'Songsheet 1', json: {}, title: 'Kein Incipit vorhanden', text: 'Kein Liedtext vorhanden', imagename: 'placeholder.jpg' };
  var songsheetPlaceholder2 = { signature: 'xyz456', name: 'Songsheet 2', json: {}, title: 'Kein Incipit vorhanden', text: 'Kein Liedtext vorhanden', imagename: 'placeholder.jpg' };
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

  var actionDeleteSongsheet = {
    actionType: DELETE_SONGSHEET,
    signature: 'abc123'
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
      similarityScores,
    } = SongsheetStore;
    expect(start).toBe(0);
    expect(totalCount).toBe(0);
    expect(songsheets.length).toBe(0);
    expect(similarityScores.length).toBe(0);
  });

  it('should update pager start', () => {
    callback(actionUpdateStart);
    expect(SongsheetStore.start).toBe(10);
  });

  it('should load list of songsheets', () => {
    ArrayHelper.mergeByProperty = jest.fn()
      .mockImplementationOnce(() => {
        SongsheetStore._songsheets = [songsheet1, songsheet2];
      })
      .mockImplementationOnce(() => {
        SongsheetStore._songsheets = [songsheetPlaceholder1, songsheet2];
      })
      .mockImplementationOnce(() => {
        SongsheetStore._songsheets = [songsheetPlaceholder1, songsheetPlaceholder2];
      });
    callback(actionRenderList);
    expect(ArrayHelper.mergeByProperty).toBeCalledWith([], [songsheet1, songsheet2], 'signature');
    expect(SongsheetStore.songsheets.length).toBe(2);
    expect(SongsheetStore.totalCount).toBe(2);
    expect(ArrayHelper.mergeByProperty).toBeCalledWith([songsheet1, songsheet2], [metadataPlaceholder1], 'signature');
    expect(ArrayHelper.mergeByProperty).toBeCalledWith([songsheetPlaceholder1, songsheet2], [metadataPlaceholder2], 'signature');
    expect(SongsheetStore.songsheets).toEqual([songsheetPlaceholder1, songsheetPlaceholder2]);
  });

  it('should load single songsheet', () => {
    ArrayHelper.mergeByProperty = jest.fn()
      .mockImplementationOnce(() => {
        SongsheetStore._songsheets = [songsheet1];
      })
      .mockImplementationOnce(() => {
        SongsheetStore._songsheets = [songsheetPlaceholder1];
      });
    callback(actionRenderItem);
    expect(ArrayHelper.mergeByProperty).toBeCalledWith([], [songsheet1], 'signature');
    expect(SongsheetStore.songsheets.length).toBe(1);
    expect(ArrayHelper.mergeByProperty).toBeCalledWith([songsheet1], [metadataPlaceholder1], 'signature');
    expect(SongsheetStore.songsheets).toEqual([songsheetPlaceholder1]);
  });

  it('should update metadata', () => {
    callback({ actionType: UPDATE_METADATA, response: { response: { numFound: 0 } } });

    ArrayHelper.mergeByProperty = jest.fn()
      .mockImplementationOnce(() => {
        SongsheetStore._songsheets = [metadata1];
      });
    callback(actionRenderMetadata);
    expect(ArrayHelper.mergeByProperty).toBeCalledWith([], [metadata1], 'signature');
    expect(SongsheetStore.songsheets.length).toBe(1);
    expect(SongsheetStore.songsheets).toEqual([metadata1]);
  });

  it('should update similar songsheets', () => {
    ArrayHelper.differenceByProperty = jest.fn()
      .mockImplementationOnce(() => {
        return [similar1, similar2];
      });
    var SongsheetService = require('../../services/SongsheetService').default;
    callback(actionUpdateSimilar);
    expect(SongsheetStore.similarityScores.length).toBe(2);
    expect(SongsheetStore.similarityScores).toEqual([similar1, similar2]);
    expect(ArrayHelper.differenceByProperty).toBeCalledWith([], [similar1, similar2], 'signature');
    expect(SongsheetService.loadItem).toBeCalledWith(similar1.signature);
    expect(SongsheetService.loadItem).toBeCalledWith(similar2.signature);
  });

  it('should remove item from list of songsheets', () => {
    ArrayHelper.mergeByProperty = jest.fn()
      .mockImplementationOnce(() => {
        SongsheetStore._songsheets = [songsheet1, songsheet2];
      })
      .mockImplementationOnce(() => {
        SongsheetStore._songsheets = [songsheetPlaceholder1, songsheet2];
      })
      .mockImplementationOnce(() => {
        SongsheetStore._songsheets = [songsheetPlaceholder1, songsheetPlaceholder2];
      });
    callback(actionRenderList);
    expect(ArrayHelper.mergeByProperty).toBeCalledWith([], [songsheet1, songsheet2], 'signature');
    expect(SongsheetStore.songsheets.length).toBe(2);
    expect(SongsheetStore.totalCount).toBe(2);
    expect(ArrayHelper.mergeByProperty).toBeCalledWith([songsheet1, songsheet2], [metadataPlaceholder1], 'signature');
    expect(ArrayHelper.mergeByProperty).toBeCalledWith([songsheetPlaceholder1, songsheet2], [metadataPlaceholder2], 'signature');
    expect(SongsheetStore.songsheets).toEqual([songsheetPlaceholder1, songsheetPlaceholder2]);

    callback(actionDeleteSongsheet);
    expect(SongsheetStore.songsheets.length).toBe(1);
    expect(SongsheetStore.totalCount).toBe(1);
    expect(SongsheetStore.songsheets).toEqual([songsheetPlaceholder2]);
  });

});