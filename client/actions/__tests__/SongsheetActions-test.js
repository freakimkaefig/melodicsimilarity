import {
  UPDATE_SONGSHEET_START,
  LOAD_LIST,
  LOAD_ITEM,
  UPDATE_SIMILAR,
  LOAD_SIMILAR_ITEM
} from '../../constants/SongsheetConstants';

jest.mock('../../dispatchers/AppDispatcher');

describe('SongsheetActions', () => {

  var AppDispatcher;
  var SongsheetActions;

  beforeEach(() => {
    jest.resetModules();
    AppDispatcher = require('../../dispatchers/AppDispatcher').default;
    SongsheetActions = require('../SongsheetActions').default;
  });

  it('dispatches list start', () => {
    SongsheetActions.updateStart(10);
    expect(AppDispatcher.dispatch).toBeCalledWith({
      actionType: UPDATE_SONGSHEET_START,
      value: 10
    });
  });

  it('dispatches songsheets list', () => {
    SongsheetActions.renderList([
      { signature: 'abc123', title: 'Title 1' },
      { signature: 'xyz456', title: 'Title 2' }
    ], 20);
    expect(AppDispatcher.dispatch).toBeCalledWith({
      actionType: LOAD_LIST,
      songsheets: [
        { signature: 'abc123', title: 'Title 1' },
        { signature: 'xyz456', title: 'Title 2' }
      ],
      totalCount: 20
    });
  });

  it('dispatches songsheet detail', () => {
    SongsheetActions.renderItem({ signature: 'abc123', title: 'Title 1' });
    expect(AppDispatcher.dispatch).toBeCalledWith({
      actionType: LOAD_ITEM,
      songsheet: { signature: 'abc123', title: 'Title 1' }
    });
  });

  it('dispatches similar songsheet detail', () => {
    SongsheetActions.updateSimilar({ signature: 'abc123', title: 'Title 1' });
    expect(AppDispatcher.dispatch).toBeCalledWith({
      actionType: UPDATE_SIMILAR,
      similar: { signature: 'abc123', title: 'Title 1' }
    });
  });

  it('dispatches similar songsheet metadata', () => {
    SongsheetActions.renderSimilarItem({ signature: 'abc123', title: 'Title 1' });
    expect(AppDispatcher.dispatch).toBeCalledWith({
      actionType: LOAD_SIMILAR_ITEM,
      songsheet: { signature: 'abc123', title: 'Title 1' }
    });
  });

});