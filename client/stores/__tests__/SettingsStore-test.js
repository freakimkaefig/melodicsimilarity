import {
  BEGIN_UPDATE_FIELD,
  UPDATE_FIELD
} from '../../constants/SettingsConstants';
import {
  settings
} from '../../../server/config/api.config.json';

jest.mock('../../dispatchers/AppDispatcher');

describe('SettingsStore', () => {

  var AppDispatcher;
  var SettingsStore;
  var callback;

  var actionBeginUpdateField = {
    actionType: BEGIN_UPDATE_FIELD,
    field: settings[0].key
  };

  var actionUpdateFieldFloat = {
    actionType: UPDATE_FIELD,
    type: settings[0].type,
    field: settings[0].key,
    value: 0.6
  };

  var actionUpdateFieldText = {
    actionType: UPDATE_FIELD,
    type: settings[1].type,
    field: settings[1].key,
    value: 'value'
  };

  beforeEach(() => {
    jest.resetModules();
    AppDispatcher = require('../../dispatchers/AppDispatcher').default;
    SettingsStore = require('../SettingsStore').default;
    callback = AppDispatcher.register.mock.calls[0][0];
  });

  it('registers a callback with the dispatcher', () => {
    expect(AppDispatcher.register.mock.calls.length).toBe(1);
  });

  it('should initialize correctly', () => {
    var keys = Object.keys(SettingsStore.settings);
    expect(SettingsStore.ready).toBe(false);
    expect(keys.length).toBe(settings.length);
  });

  it('updates fields loading state', () => {
    callback(actionBeginUpdateField);
    expect(SettingsStore.settings[settings[0].key].loading).toBe(true);
  });

  it('updates fields value (float)', () => {
    callback(actionUpdateFieldFloat);
    var setting = SettingsStore.settings[settings[0].key];
    expect(setting.loading).toBe(false);
    expect(setting.value).toBe(0.6);
    expect(SettingsStore.ready).toBe(true);
  });

  it('updates fields value (text)', () => {
    callback(actionUpdateFieldText);
    var setting = SettingsStore.settings[settings[1].key];
    expect(setting.loading).toBe(false);
    expect(setting.value).toBe('value');
    expect(SettingsStore.ready).toBe(true);
  });

});