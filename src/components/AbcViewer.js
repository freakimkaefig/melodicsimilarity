import React from 'react';
import AbcStore from '../stores/AbcStore';
import { convert2Abc } from 'musicjson2abc';
import Solr from '../services/SolrService';
import MetadataViewer from './MetadataViewer';
import { Button } from 'react-bootstrap';

require('expose?Base64Binary!exports?Base64Binary!../../node_modules/midi/inc/base64binary.js');
require('expose?atob&btoa!exports?atob&btoa!../../node_modules/midi/inc/Base64.js');
require('expose?Stream!exports?Stream!../../node_modules/midi/inc/jasmid/stream.js');
require('expose?MidiFile!exports?MidiFile!../../node_modules/midi/inc/jasmid/midifile.js');
require('expose?Replayer!exports?Replayer!../../node_modules/midi/inc/jasmid/replayer.js');

var MIDI = require('exports?MIDI!script!../../node_modules/midi/build/MIDI.min');
var ABCJS = require('exports?ABCJS!script!../../lib/abcjs_basic_2.3-min.js');
// require('script!../../node_modules/midi/build/MIDI');
// require('script!../../node_modules/midi/inc/jasmid/stream');
// require('script!../../node_modules/midi/inc/jasmid/midifile');
// require('script!../../node_modules/midi/inc/jasmid/replayer');
// require('script!../../node_modules/midi/inc/Base64');

require('../stylesheets/AbcViewer.less');


export default class AbcViewer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      json: {},
      midiLoaded: false,
      player: {},
      playerProgress: 0,
      playing: false,
      parserParams: {},
      renderParams: {},
      engraverParams: {
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
    this.onJsonChange = () => this._onJsonChange();
    this.onPlayClick = () => this._onPlayClick();
    this.onStopClick = () => this._onStopClick();
  }

  componentDidMount() {
    AbcStore.addChangeListener(this.onJsonChange);
  }
  componentWillUnmount() {
    AbcStore.removeChangeListener(this.onJsonChange);
  }

  _onHighlight() {}

  _modelChanged() {}

  _onJsonChange() {
    this.setState({json: AbcStore.json});
    let notation = document.getElementById('notation');

    this._renderAbc();
    this._renderMidi();

    let signatureId = this.state.json.id;
    Solr.findDoc(signatureId);
  };

  _renderAbc() {
    ABCJS.renderAbc('notation', convert2Abc(JSON.stringify(this.state.json)), this.state.parserParams, this.state.engraverParams, this.state.renderParams);
  }

  _renderMidi() {
    ABCJS.renderMidi('midi', convert2Abc(JSON.stringify(this.state.json)), this.state.parserParams, this.state.midiParams, this.state.renderParams);

    let conf = this.state.midiPluginConf;
    MIDI.loadPlugin(conf);
  }

  _midiPluginLoaded = () => {
    let player = MIDI.Player;
    let song = $('#midi a').attr('href');
    player.loadFile(song, function() {
      player.addListener(function(data) {
        this.setState({playerProgress: (data.now / data.end) * 100});
        console.log(data);
      }.bind(this));
      this.setState({midiLoaded: true});
    }.bind(this));
    this.setState({player: player});
  }

  _midiListener(data) {
    console.log(data);
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

  render() {
    return (
      <div>
        <h3>Notation</h3>
        <div id="notation"></div>
        <div id="midi-player">
          <div id="midi"></div>
          <div id="player">
            {this.state.player.playing}
            <div className="progress">
              <div className="progress-bar" style={{width: this.state.playerProgress + '%'}}></div>
            </div>
            <Button bsStyle="primary" disabled={!this.state.midiLoaded} onClick={this.state.midiLoaded ? this.onPlayClick : null}>
              {this.state.player.playing ? 'Pause' : 'Play'}
            </Button>
            <Button bsStyle="primary" disabled={!this.state.midiLoaded} onClick={this.state.midiLoaded ? this.onStopClick : null}>
              Stop
            </Button>
          </div>
        </div>
        <MetadataViewer />
      </div>
    )
  }

}
