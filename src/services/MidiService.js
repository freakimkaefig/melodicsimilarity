import MidiActions from '../actions/MidiActions';
import 'expose?Base64Binary!exports?Base64Binary!../../node_modules/midi/inc/base64binary.js';
import 'expose?atob&btoa!exports?atob&btoa!../../node_modules/midi/inc/Base64.js';
import 'expose?Stream!exports?Stream!../../node_modules/midi/inc/jasmid/stream.js';
import 'expose?MidiFile!exports?MidiFile!../../node_modules/midi/inc/jasmid/midifile.js';
import 'expose?Replayer!exports?Replayer!../../node_modules/midi/inc/jasmid/replayer.js';
import MIDI from 'exports?MIDI!script!../../node_modules/midi/build/MIDI';
import {SOUNDFONT_URL} from '../constants/MidiConstants';

class MidiService {

  loadPlugin() {
    MIDI.loadPlugin({
      soundfontUrl: '/build/soundfont/',
      instrument: 'acoustic_grand_piano',
      callback: this.handlePluginLoaded
    });
  }

  handlePluginLoaded() {
    console.log("Midiloaded");
    MidiActions.setMidiLoaded(MIDI.Player);
  }

}

export default new MidiService();