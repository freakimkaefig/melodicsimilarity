import BaseStore from './BaseStore';
import { MIDI_PLUGIN_LOADED } from '../constants/MidiConstants';


class MidiStore extends BaseStore {

  constructor() {
    super();
    this.subscribe(() => this._registerToActions.bind(this));
    this._midiPlayer = null;
  }

  _registerToActions(action) {
    switch (action.actionType) {
      case MIDI_PLUGIN_LOADED:
        this._midiPlayer = action.player;
        this.emitChange();
        break;

      default:
        break;
    }
  }

  get midiPlayer() {
    return this._midiPlayer;
  }
}

export default new MidiStore();