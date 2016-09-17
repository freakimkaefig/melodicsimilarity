import {
  BEGIN_UPDATE_FIELD,
  UPDATE_FIELD
} from '../../constants/SettingsConstants';

jest.mock('../../dispatchers/AppDispatcher');

describe('SettingsActions', () => {

  var AppDispatcher;
  var SettingsActions;

  beforeEach(() => {
    jest.resetModules();
    AppDispatcher = require('../../dispatchers/AppDispatcher').default;
    SettingsActions = require('../SettingsActions').default;
  });

  it('dispatches begin update field', () => {
    SettingsActions.beginUpdateField('field');
    expect(AppDispatcher.dispatch).toBeCalledWith({
      actionType: BEGIN_UPDATE_FIELD,
      field: 'field'
    });
  });

  it('dispatches update field', () => {
    SettingsActions.updateField({
      type: 'type',
      key: 'key',
      value: 'value'
    });
    expect(AppDispatcher.dispatch).toBeCalledWith({
      actionType: UPDATE_FIELD,
      type: 'type',
      field: 'key',
      value: 'value'
    });
  });

});