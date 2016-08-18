import AppDispatcher from '../dispatchers/AppDispatcher';
import { MIDI_PLUGIN_LOADED } from '../constants/MidiConstants';

export default {
  setMidiLoaded: (player) => {
    AppDispatcher.dispatch({
      actionType: MIDI_PLUGIN_LOADED,
      player: player
    });
  }
}
