import { MIDI_PLUGIN_LOADED } from '../../constants/MidiConstants';

jest.mock('../../dispatchers/AppDispatcher');

describe('MidiActions', () => {

  var AppDispatcher;
  var MidiActions;

  beforeEach(() => {
    jest.resetModules();
    AppDispatcher = require('../../dispatchers/AppDispatcher').default;
    MidiActions = require('../MidiActions').default;
  });

  it('dispatches midi loaded', () => {
    MidiActions.setMidiLoaded({ key: 'value' });
    expect(AppDispatcher.dispatch).toBeCalledWith({
      actionType: MIDI_PLUGIN_LOADED,
      player: { key: 'value' }
    });
  });

});