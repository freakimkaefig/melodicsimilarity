import { MIDI_PLUGIN_LOADED } from '../../constants/MidiConstants';

jest.mock('../../dispatchers/AppDispatcher');

describe('MidiStore', () => {

  var AppDispatcher;
  var MidiStore;
  var callback;

  var actionMidiPluginLoaded = {
    actionType: MIDI_PLUGIN_LOADED,
    player: true
  };

  beforeEach(() => {
    jest.resetModules();
    AppDispatcher = require('../../dispatchers/AppDispatcher').default;
    MidiStore = require('../MidiStore').default;
    callback = AppDispatcher.register.mock.calls[0][0];
  });

  it('registers a callback with the dispatcher', () => {
    expect(AppDispatcher.register.mock.calls.length).toBe(1);
  });

  it('should initialize with no player', () => {
    expect(MidiStore.midiPlayer).toBeNull();
  });

  it('stores global midi plugin', () => {
    callback(actionMidiPluginLoaded);
    expect(MidiStore.midiPlayer).toBe(true);
  });

});