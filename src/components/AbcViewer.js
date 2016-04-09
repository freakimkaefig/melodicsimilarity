import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';

import 'expose?Base64Binary!exports?Base64Binary!../../node_modules/midi/inc/base64binary.js';
import 'expose?atob&btoa!exports?atob&btoa!../../node_modules/midi/inc/Base64.js';
import 'expose?Stream!exports?Stream!../../node_modules/midi/inc/jasmid/stream.js';
import 'expose?MidiFile!exports?MidiFile!../../node_modules/midi/inc/jasmid/midifile.js';
import 'expose?Replayer!exports?Replayer!../../node_modules/midi/inc/jasmid/replayer.js';

import MIDI from 'exports?MIDI!script!../../node_modules/midi/build/MIDI';
import ABCJS from 'exports?ABCJS!script!../../lib/abcjs_basic_2.3-min.js';

import '../stylesheets/AbcViewer.less';


export default class AbcViewer extends React.Component {

  static propTypes = {
    abc: PropTypes.string.isRequired,
    itemKey: PropTypes.number.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      midiLoaded: false,
      player: {},
      playerProgress: 0,
      playing: false,
      parserParams: {},
      renderParams: {},
      engraverParams: {
        staffwidth: 600,
        paddingtop: 5,
        paddingbottom: 30,
        paddingleft: 0,
        paddingright: 0,
        add_classes: true,
        listener: {
          highlight: this._onHighlight,
          modelChanged: this._modelChanged
        }
      },
      midiParams: {},
      midiPluginConf: {
        soundfontUrl: '/build/soundfont/',
        instrument: 'acoustic_grand_piano',
        callback: this._midiPluginLoaded
      }
    };
    this.onPlayClick = () => this._onPlayClick();
    this.onStopClick = () => this._onStopClick();
  }

  componentDidMount() {
    this._renderAbc();
    this._renderMidi();
  }

  _renderAbc() {
    ABCJS.renderAbc('notation-' + this.props.itemKey, this.props.abc, this.state.parserParams, this.state.engraverParams, this.state.renderParams);
  }

  _renderMidi() {
    ABCJS.renderMidi('midi-' + this.props.itemKey, this.props.abc, this.state.parserParams, this.state.midiParams, this.state.renderParams);

    let conf = this.state.midiPluginConf;
    MIDI.loadPlugin(conf);
  }

  _midiPluginLoaded = () => {
    let player = MIDI.Player;
    let midi = document.getElementById('midi-' + this.props.itemKey);
    let song = midi.getElementsByTagName('a')[0].href;
    player.loadFile(song, function() {
      player.addListener(this._midiEventListener.bind(this));
      this.setState({midiLoaded: true});
    }.bind(this));
    this.setState({player: player});
  };

  _onMidiLoaded(player) {
    player.addListener(this._midiEventListener.bind(this));
    this.setState({midiLoaded: true});
    return player;
  }

  _midiEventListener(data) {
    this.setState({playerProgress: (data.now / data.end) * 100});
  }

  _onPlayClick() {
    if(this.state.playing) {
      this.state.player.pause();
    } else {
      this.state.player.resume();
    }
    this.setState({playing: this.state.player.playing});
  }

  _onStopClick() {
    this.state.player.stop();
    this.setState({playing: this.state.player.playing, playerProgress: 0});
  }

  _onHighlight() {}

  _modelChanged() {}

  render() {
    let key = this.props.itemKey;
    let playClass = this.state.player.playing ? 'pause' : 'play';

    return (
      <div>
        <div id={`notation-${key}`} className="notation"></div>
        <div id={`midi-player-${key}`}>
          <div id={`midi-${key}`}></div>
          <div id={`player-${key}`}>
            {this.state.player.playing}
            <div className="progress">
              <div className="progress-bar" style={{width: this.state.playerProgress + '%'}}></div>
            </div>
            <Button bsStyle="primary" disabled={!this.state.midiLoaded} onClick={this.state.midiLoaded ? this.onPlayClick : null}><span className={`fa fa-${playClass}-circle-o`}></span></Button>
            <Button bsStyle="primary" disabled={!this.state.midiLoaded} onClick={this.state.midiLoaded ? this.onStopClick : null}><span className={`fa fa-stop-circle-o`}></span></Button>
          </div>
        </div>
      </div>
    )
  }

}
