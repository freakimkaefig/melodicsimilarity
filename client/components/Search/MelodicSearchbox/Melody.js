import React, {
  PropTypes
} from 'react';
import AbcViewer from '../../AbcViewer';
import MelodyHelper from '../../../helpers/MelodyHelper';
import Switch from 'react-bootstrap-switch';
import {
  OverlayTrigger,
  Popover
} from 'react-bootstrap';
import InputRange from 'react-input-range';
import MelodyActions from '../../../actions/MelodyActions';
import {
  MELODY_DEFAULT_ABC,
  MODES,
  NOTE_TYPES,
  ALTER_VALUES
} from '../../../constants/MelodyConstants';
import SearchStore from '../../../stores/SearchStore';

export default class Melody extends React.Component {
  static propTypes = {
    submit: PropTypes.func.isRequired
  };
  
  constructor(props) {
    super(props);

    this.state = {
      mode: SearchStore.melodyMode,
      abc: SearchStore.melodyAbc,
      melody: SearchStore.melodyQuery,
      disabled: true,
      threshold: SearchStore.threshold,

      step: 'C',
      sharpSteps: [],
      flatSteps: [],
      octave: 4,
      accidental: '',
      rest: false,
      duration: 8,
      type: 'eighth',
      dot: false
    };
    
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.addNote = this.addNote.bind(this);
    this.deleteNote = this.deleteNote.bind(this);
    this.onSearchStoreChange = this.onSearchStoreChange.bind(this);
  }
  
  componentDidMount() {
    SearchStore.addChangeListener(this.onSearchStoreChange);
  }
  
  componentWillUnmount() {
    SearchStore.removeChangeListener(this.onSearchStoreChange);
  }
  
  onSearchStoreChange() {
    this.setState({
      mode: SearchStore.melodyMode,
      abc: SearchStore.melodyAbc,
      melody: SearchStore.melodyQuery,
      threshold: SearchStore.threshold,
      disabled: SearchStore.melodyQuery.length === 0
    });
  }

  onSwitchChange(component, state) {
    this.setState({
      dot: state
    });
  }

  onInputChange(event) {
    let stateObject = function() {
      let returnObj = {};
      let id = event.target.children[0].name;
      let value = event.target.children[0].value;

      if (id === 'step') {
        if (value === '*') {
          value = 'C';
          returnObj.octave = 5;
          returnObj.accidental = '';
          returnObj.rest = true;
        } else {
          returnObj.rest = false;
        }
      } else if (id === 'duration') {
        returnObj.type = NOTE_TYPES[value];
      }

      if (id === 'octave' || id === 'duration') {
        value = parseInt(value);
      }

      returnObj[id] = value;
      return returnObj;
    }.bind(event)();

    this.setState(stateObject);
  }

  addNote() {
    let {melody, step, octave, accidental, rest, duration, type, dot} = this.state;
    let noteDuration = dot === true ? duration * 1.5 : duration;
    let nextMelody = melody.concat({
      pitch: {
        step: step,
        octave: octave,
        alter: ALTER_VALUES[accidental],
        accidental: accidental
      },
      rest: rest,
      duration: noteDuration,
      type: type,
      dot: dot
    });

    MelodyActions.updateMelodyQuery(nextMelody, MelodyHelper.generateAbc(MELODY_DEFAULT_ABC, nextMelody));
  }

  deleteNote() {
    console.log("Delete Note");
    let nextMelody = this.state.melody;
    nextMelody.pop();

    MelodyActions.updateMelodyQuery(nextMelody, MelodyHelper.generateAbc(MELODY_DEFAULT_ABC, nextMelody));
  }

  handleThresholdChange(component, value) {
    MelodyActions.updateThreshold(value);
  }
  
  handleSubmit(e) {
    e.preventDefault();
    
    this.setState({
      disabled: true
    });
    
    this.props.submit();
  }

  render() {
    let {melody, mode, abc, disabled, threshold, step, octave, accidental, rest, duration, dot} = this.state;

    let abcViewer;
    if (mode === MODES.indexOf('MELODY') && melody.length > 0) {
      abcViewer = (
        <AbcViewer abc={abc} itemKey={1} />
      );
    }

    let deleteEnabled = melody.length > 0 ? '' : 'disabled';
    let octaveEnabled = rest === true ? 'disabled' : '';
    let accidentalEnabled = rest === true ? 'disabled' : '';

    let accidentalTutorial = (
      <Popover title="Versetzungszeichen" id="accidental-tutorial">
        <p>Versetzungszeichen gelten nur für die jeweilige Note, nicht für den ganzen Takt.</p>
      </Popover>
    );

    return (
      <form onSubmit={this.handleSubmit} id="melody-form">
        <div className="container">
          <div className="row">
            <div className="col-xs-12">{abcViewer}</div>
          </div>

          <div className="row">
            <div className="col-xs-12 col-md-6">
              <div className="btn-row">
                <label>Tonhöhe</label><br/>
                <div className="btn-group" data-toggle="buttons">
                  <label onClick={this.onInputChange} className={`btn btn-sm btn-default ${step === 'C' ? 'active' : ''}`}>
                    <input type="radio" name="step" value="C"/>C
                  </label>
                  <label onClick={this.onInputChange} className={`btn btn-sm btn-default ${step === 'D' ? 'active' : ''}`}>
                    <input type="radio" name="step" value="D"/>D
                  </label>
                  <label onClick={this.onInputChange} className={`btn btn-sm btn-default ${step === 'E' ? 'active' : ''}`}>
                    <input type="radio" name="step" value="E"/>E
                  </label>
                  <label onClick={this.onInputChange} className={`btn btn-sm btn-default ${step === 'F' ? 'active' : ''}`}>
                    <input type="radio" name="step" value="F"/>F
                  </label>
                  <label onClick={this.onInputChange} className={`btn btn-sm btn-default ${step === 'G' ? 'active' : ''}`}>
                    <input type="radio" name="step" value="G"/>G
                  </label>
                  <label onClick={this.onInputChange} className={`btn btn-sm btn-default ${step === 'A' ? 'active' : ''}`}>
                    <input type="radio" name="step" value="A"/>A
                  </label>
                  <label onClick={this.onInputChange} className={`btn btn-sm btn-default ${step === 'B' ? 'active' : ''}`}>
                    <input type="radio" name="step" value="B"/>H
                  </label>
                  <label onClick={this.onInputChange} className={`btn btn-sm btn-default ${rest === true ? 'active' : ''}`}>
                    <input type="radio" name="step" value="*"/>Pause
                  </label>
                </div>
              </div>

              <div className="btn-row">
                <label>Oktave</label><br/>
                <div className="btn-group" data-toggle="buttons">
                  <label onClick={this.onInputChange} className={`btn btn-sm btn-default ${octaveEnabled} ${octave === 1 ? 'active' : ''}`}>
                    <input type="radio" name="octave" value="1"/>1
                  </label>
                  <label onClick={this.onInputChange} className={`btn btn-sm btn-default ${octaveEnabled} ${octave === 2 ? 'active' : ''}`}>
                    <input type="radio" name="octave" value="2"/>2
                  </label>
                  <label onClick={this.onInputChange} className={`btn btn-sm btn-default ${octaveEnabled} ${octave === 3 ? 'active' : ''}`}>
                    <input type="radio" name="octave" value="3"/>3
                  </label>
                  <label onClick={this.onInputChange} className={`btn btn-sm btn-default ${octaveEnabled} ${octave === 4 ? 'active' : ''}`}>
                    <input type="radio" name="octave" value="4"/>4
                  </label>
                  <label onClick={this.onInputChange} className={`btn btn-sm btn-default ${octaveEnabled} ${octave === 5 ? 'active' : ''}`}>
                    <input type="radio" name="octave" value="5"/>5
                  </label>
                  <label onClick={this.onInputChange} className={`btn btn-sm btn-default ${octaveEnabled} ${octave === 6 ? 'active' : ''}`}>
                    <input type="radio" name="octave" value="6"/>6
                  </label>
                  <label onClick={this.onInputChange} className={`btn btn-sm btn-default ${octaveEnabled} ${octave === 7 ? 'active' : ''}`}>
                    <input type="radio" name="octave" value="7"/>7
                  </label>
                </div>
              </div>

              <div className="btn-row">
                <OverlayTrigger trigger={['hover', 'focus']} placement="top" overlay={accidentalTutorial}>
                  <label>Versetzungszeichen <small><i className="fa fa-question-circle" aria-hidden="true"></i></small></label>
                </OverlayTrigger><br/>
                <div className="btn-group" data-toggle="buttons">
                  <label onClick={this.onInputChange} className={`btn btn-sm btn-default ${accidentalEnabled} ${accidental === '' ? 'active' : ''}`}>
                    <input type="radio" name="accidental" value=""/>&nbsp;
                  </label>
                  <label onClick={this.onInputChange} className={`btn btn-sm btn-default ${accidentalEnabled} ${accidental === 'flat' ? 'active' : ''}`}>
                    <input type="radio" name="accidental" value="flat"/>&#9837;
                  </label>
                  <label onClick={this.onInputChange} className={`btn btn-sm btn-default ${accidentalEnabled} ${accidental === 'natural' ? 'active' : ''}`}>
                    <input type="radio" name="accidental" value="natural"/>&#9838;
                  </label>
                  <label onClick={this.onInputChange} className={`btn btn-sm btn-default ${accidentalEnabled} ${accidental === 'sharp' ? 'active' : ''}`}>
                    <input type="radio" name="accidental" value="sharp"/>&#9839;
                  </label>
                </div>
              </div>
            </div>

            <div className="col-xs-12 col-md-6">
              <div className="btn-row">
                <label>Notenwert</label><br/>
                <div className="btn-group" data-toggle="buttons">
                  <label onClick={this.onInputChange} className={`btn btn-sm btn-default ${duration >= 64 ? 'active' : ''}`}>
                    <input type="radio" name="duration" value="64"/>1/1
                  </label>
                  <label onClick={this.onInputChange} className={`btn btn-sm btn-default ${duration >= 32 && duration < 64 ? 'active' : ''}`}>
                    <input type="radio" name="duration" value="32"/>1/2
                  </label>
                  <label onClick={this.onInputChange} className={`btn btn-sm btn-default ${duration >= 16 && duration < 32 ? 'active' : ''}`}>
                    <input type="radio" name="duration" value="16"/>1/4
                  </label>
                  <label onClick={this.onInputChange} className={`btn btn-sm btn-default ${duration >= 8 && duration < 16 ? 'active' : ''}`}>
                    <input type="radio" name="duration" value="8"/>1/8
                  </label>
                  <label onClick={this.onInputChange} className={`btn btn-sm btn-default ${duration >= 4 && duration < 8 ? 'active' : ''}`}>
                    <input type="radio" name="duration" value="4"/>1/16
                  </label>
                  <label onClick={this.onInputChange} className={`btn btn-sm btn-default ${duration >= 2 && duration < 4 ? 'active' : ''}`}>
                    <input type="radio" name="duration" value="2"/>1/32
                  </label>
                  <label onClick={this.onInputChange} className={`btn btn-sm btn-default ${duration >= 1 && duration < 2 ? 'active' : ''}`}>
                    <input type="radio" name="duration" value="1"/>1/64
                  </label>
                </div>
              </div>

              <label>Punktiert</label><br/>
              <Switch
                onText="Ja"
                onColor="success"
                offText="Nein"
                offColor="danger"
                state={dot}
                size="small"
                onChange={this.onSwitchChange.bind(this)} />
              <div className="action-buttons">
                <button type="button" className="btn btn-sm btn-success" onClick={this.addNote}>
                  <i className="fa fa-plus" aria-hidden="true"></i>
                </button>
                <button type="button" className={`btn btn-sm btn-danger ${deleteEnabled}`} onClick={this.deleteNote}>
                  <i className="fa fa-minus" aria-hidden="true"></i>
                </button>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-xs-12 col-sm-6 col-md-4">
              <InputRange
                maxValue={100}
                minValue={30}
                step={10}
                value={threshold}
                onChange={this.handleThresholdChange.bind(this)} />
            </div>
          </div>

          <div className="row">
            <div className="col-xs-12 text-right">
              <button
                type="submit"
                className="btn btn-default"
                disabled={disabled}>
                <i className="fa fa-search" aria-hidden="true"></i>
              </button>
            </div>
          </div>
        </div>
      </form>
    );
  }
}