import {
  UPDATE_MODE,
  UPDATE_PARSON_QUERY,
  UPDATE_INTERVAL_QUERY,
  UPDATE_MELODY_QUERY,
  UPDATE_THRESHOLD
} from '../../constants/MelodyConstants';

jest.mock('../../dispatchers/AppDispatcher');

describe('MelodyActions', () => {

  var AppDispatcher;
  var MelodyActions;

  beforeEach(() => {
    jest.resetModules();
    AppDispatcher = require('../../dispatchers/AppDispatcher').default;
    MelodyActions = require('../MelodyActions').default;
  });

  it('dispatches update mode', () => {
    MelodyActions.updateMode('mode');
    expect(AppDispatcher.dispatch).toBeCalledWith({
      actionType: UPDATE_MODE,
      mode: 'mode'
    });
  });

  it('dispatches update threshold', () => {
    MelodyActions.updateThreshold(50);
    expect(AppDispatcher.dispatch).toBeCalledWith({
      actionType: UPDATE_THRESHOLD,
      threshold: 50
    });
  });

  it('dispatches update parson query', () => {
    MelodyActions.updateParsonQuery('*udr');
    expect(AppDispatcher.dispatch).toBeCalledWith({
      actionType: UPDATE_PARSON_QUERY,
      parson: '*udr'
    });
  });

  it('dispatches update interval query', () => {
    MelodyActions.updateIntervalQuery('* 2 -4 0', 'abc');
    expect(AppDispatcher.dispatch).toBeCalledWith({
      actionType: UPDATE_INTERVAL_QUERY,
      intervals: '* 2 -4 0',
      abc: 'abc'
    });
  });

  it('dispatches update melody query', () => {
    MelodyActions.updateMelodyQuery([
      { pitch: {}, duration: 4 },
      { pitch: {}, duration: 8 }
    ], 'abc');
    expect(AppDispatcher.dispatch).toBeCalledWith({
      actionType: UPDATE_MELODY_QUERY,
      melody: [
        { pitch: {}, duration: 4 },
        { pitch: {}, duration: 8 }
      ],
      abc: 'abc'
    });
  });

});