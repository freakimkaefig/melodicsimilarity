import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import MidiStore from '../stores/MidiStore';
import ABCJS from 'exports?ABCJS!script!../../lib/abcjs_basic_2.3-min.js';
import '../stylesheets/AbcViewer.less';


export default class AbcViewer extends React.Component {

  static propTypes = {
    abc: PropTypes.string,
    file: PropTypes.object,
    itemKey: PropTypes.number
  };

  constructor(props) {
    super(props);
    this.state = {
      midiLoaded: false,
      abcRendered: false,
      midiRendered: false,
      player: null,
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
      midiParams: {}
    };
    this.onPlayClick = () => this._onPlayClick();
    this.onStopClick = () => this._onStopClick();
    this.onStoreChange = this.onStoreChange.bind(this);
  }

  componentDidMount() {
    MidiStore.addChangeListener(this.onStoreChange);

    let player = MidiStore.midiPlayer;
    if (player !== null) {
      this.setState({player: player});

      if (!this.state.abcRendered) {
        this._renderAbc(this.props.abc, this.props.itemKey);
      }

      if (!this.state.midiRendered) {
        this._renderMidi(this.props.abc, this.props.itemKey);
      }

      this._midiPluginLoaded(player);
    }
  }

  componentWillUnmount() {
    MidiStore.removeChangeListener(this.onStoreChange);
  }

  onStoreChange() {
    let player = MidiStore.midiPlayer;
    this.setState({
      player: player
    });

    if (player !== null) {
      if (!this.state.abcRendered) {
        this._renderAbc(this.props.abc, this.props.itemKey);
      }

      if (!this.state.midiRendered) {
        this._renderMidi(this.props.abc, this.props.itemKey);
      }

      this._midiPluginLoaded(player);
    }
  }

  _renderAbc(abc, itemKey) {
    ABCJS.renderAbc('notation-' + itemKey, abc, this.state.parserParams, this.state.engraverParams, this.state.renderParams);
    this.setState({abcRendered: true});
  }

  _renderMidi(abc, itemKey) {
    ABCJS.renderMidi('midi-' + itemKey, abc, this.state.parserParams, this.state.midiParams, this.state.renderParams);
    this.setState({midiRendered: true});
  }

  _midiPluginLoaded = (player) => {
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
    let playClass = this.state.playing ? 'pause' : 'play';

    return (
      <div>
        <div className="scroll-x-container">
          <div id={`notation-${key}`} className="notation"></div>
        </div>
        <div id={`midi-player-${key}`}>
          <div id={`player-${key}`} className="player-container">
            {this.state.playing}
            <div className="progress">
              <div className="progress-bar" style={{width: this.state.playerProgress + '%'}}></div>
            </div>
            <Button bsStyle="primary" disabled={!this.state.midiLoaded} onClick={this.state.midiLoaded ? this.onPlayClick : null}><span className={`fa fa-${playClass}-circle-o`}></span></Button>
            <Button bsStyle="primary" disabled={!this.state.midiLoaded} onClick={this.state.midiLoaded ? this.onStopClick : null}><span className={`fa fa-stop-circle-o`}></span></Button>
            <div id={`midi-${key}`} className="midi-container"></div>
          </div>
        </div>
      </div>
    )
  }

}
