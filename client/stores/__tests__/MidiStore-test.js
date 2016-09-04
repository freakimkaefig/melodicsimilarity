import { MIDI_PLUGIN_LOADED } from '../../constants/MidiConstants';
import AppDispatcher from '../../dispatchers/AppDispatcher';
import MidiStore from '../MidiStore';

describe('MidiStore', () => {

  var actionMidiPluginLoaded = {
    actionType: MIDI_PLUGIN_LOADED,
    player: true
  };

  it('should initialize with no player', () => {
    let {
      midiPlayer
    } = MidiStore;

    expect(midiPlayer).toBeNull();
  });

  it('stores global midi plugin', () => {
    AppDispatcher.dispatch(actionMidiPluginLoaded);
    let {
      midiPlayer
    } = MidiStore;

    expect(midiPlayer).toBe(true);
  });

});