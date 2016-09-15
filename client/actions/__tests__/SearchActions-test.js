import sinon from 'sinon';
import {
  UPDATE_FIELD_VALUE,
  UPDATE_SEARCH_OPERATOR,
  UPDATE_SEARCH_START,
  RESET_SEARCH,
  START_SEARCH,
  UPDATE_RESULTS
} from '../../constants/SearchConstants';

jest.mock('../../dispatchers/AppDispatcher');
jest.mock('react-router');

describe('SearchActions', () => {

  var AppDispatcher;
  var SearchActions;
  var browserHistory;

  beforeEach(() => {
    jest.resetModules();
    AppDispatcher = require('../../dispatchers/AppDispatcher').default;
    SearchActions = require('../SearchActions').default;

    browserHistory = require('react-router').browserHistory;
  });

  it('dispatches field update', () => {
    SearchActions.updateFieldValue('field', 'value');
    expect(AppDispatcher.dispatch).toBeCalledWith({
      actionType: UPDATE_FIELD_VALUE,
      field: 'field',
      value: 'value'
    });
  });

  it('dispatches operator update', () => {
    SearchActions.updateOperator(true);
    expect(AppDispatcher.dispatch).toBeCalledWith({
      actionType: UPDATE_SEARCH_OPERATOR,
      value: true
    });
  });

  it('dispatches start update', () => {
    SearchActions.updateStart(20);
    expect(AppDispatcher.dispatch).toBeCalledWith({
      actionType: UPDATE_SEARCH_START,
      value: 20
    });
  });

  it('dispatches search reset', () => {
    SearchActions.resetSearch();
    expect(AppDispatcher.dispatch).toBeCalledWith({
      actionType: RESET_SEARCH
    });
  });

  it('dispatches search start', () => {
    SearchActions.startSearch();
    expect(AppDispatcher.dispatch).toBeCalledWith({
      actionType: START_SEARCH
    });
  });

  it('dispatches result update', () => {
    sinon.spy(browserHistory, 'push');

    SearchActions.updateResults([
      { signature: 'abc123', title: 'Title 1' },
      { signature: 'xyz456', title: 'Title 2' }
    ]);
    expect(AppDispatcher.dispatch).toBeCalledWith({
      actionType: UPDATE_RESULTS,
      results: [
        { signature: 'abc123', title: 'Title 1' },
        { signature: 'xyz456', title: 'Title 2' }
      ]
    });
    expect(browserHistory.push.callCount).toBe(1);
    expect(browserHistory.push.args[0][0]).toBe('/search/result');

    browserHistory.push.restore();
  });

});