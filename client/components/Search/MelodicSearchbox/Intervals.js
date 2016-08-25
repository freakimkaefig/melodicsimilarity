import React, {PropTypes} from 'react';
import AbcViewer from '../../AbcViewer';
import MusicjsonToolbox from 'musicjson-toolbox';
import {
  OverlayTrigger,
  Popover
} from 'react-bootstrap';
import InputRange from 'react-input-range';
import MelodyActions from '../../../actions/MelodyActions';
import {
  INTERVAL_DEFAULT_ABC,
  MODES
} from '../../../constants/MelodyConstants';
import {
  search
} from '../../../../server/config/api.config.json';
import SearchStore from '../../../stores/SearchStore';
import '../../../stylesheets/InputRange.less';

export default class Intervals extends React.Component {
  static propTypes = {
    submit: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.INPUT_REGEX = /^-?(-?\d{1,2}){0,1}(\s{1}-?\d{0,2})*\s?$/;
    this.BASE_PITCH = MusicjsonToolbox.base12Pitch('C', 0, 4, 0, true);
    this.DEFAULT_ABC = 'X:1\nL:1/4\nM:none\nK:C\nK:treble\nC';

    this.state = {
      mode: SearchStore.melodyMode,
      abc: this.DEFAULT_ABC,
      intervals: [],
      error: false,
      errorMessage: '',
      threshold: SearchStore.threshold
    };

    this.handleSubmit = this.handleSubmit.bind(this);
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
      abc: SearchStore.intervalAbc,
      intervals: SearchStore.intervalQuery,
      threshold: SearchStore.threshold,
      disabled: SearchStore.intervalQuery.length === 0
    });
  }
  
  generateAbc(intervals) {
    if (this.validateIntervalString(intervals)) {
      return INTERVAL_DEFAULT_ABC + intervals.split(' ').map((item, index, items) => {
        let base = this.BASE_PITCH;
        for (var i = index; i > 0; i--) {
          base += parseInt(items[i-1]);
        }
        return MusicjsonToolbox.interval2AbcStep(parseInt(item), base);
      }).join(' ');
    } else {
      return false;
    }
  }

  validateIntervalString(value) {
    let regex = new RegExp(this.INPUT_REGEX);

    let error = false;
    let errorMessage = '';
    if (!regex.test(value)) {
      error = true;
      if (value.split(' ').length < 1) {
        errorMessage = 'Die Intervallfolge muss mindestens ein Intervall beinhalten.';
      } else if (/[a-zA-Z]/.test(value)) {
        errorMessage = 'Intervalle dürfen keine Buchstaben enthalten.';
      } else if (value.split(' ').filter(x => { return x > 79; }).length) {
        errorMessage = 'Der Maximalwert für Intervalle beträgt 79.';
      } else if (/(\.|\,)/.test(value)) {
        errorMessage = 'Die Intervalle dürfen keine Dezimalzahlen enthalten.'
      } else {
        errorMessage = 'Bitte überprüfen Sie ihre Eingabe.';
      }

      if (value.length < 1) {
        error = true;
        errorMessage = '';
      }
    } else {
      if (value === '- ') {
        error = true;
      }
    }

    this.setState({
      error: error,
      errorMessage: errorMessage
    });

    return !error;
  }

  onSearchChange(event) {
    let intervals = event.target.value;
    let abc = this.generateAbc(intervals);
    if (abc !== false) {
      MelodyActions.updateIntervalQuery(intervals, abc);
    }
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
    let { mode, abc, intervals, threshold, disabled, error, errorMessage } = this.state;
    let validationClass = error ? 'has-error' : 'has-success';

    let tutorial = (
      <Popover title="Erläuterung" id="intervals-tutorial">
        <p>* = Referenznote (Erste Note, wird automatisch eingefügt)</p>
        <p>positive Zahl = Anstieg der Tonhöhe in Halbtonschritten (z.B. "2" für 2 Halbtonschritte)</p>
        <p>negative Zahl = Senkung der Tonhöhe in Halbtonschritten (z.B. "-5" für 5 Halbtonschritte)</p>
        <p>0 = Gleichbleibende Tonhöhe</p>
      </Popover>
    );

    let abcViewer;
    if (mode === MODES.indexOf(search.melodyMode.intervals.name)) {
      abcViewer = (
        <AbcViewer abc={abc} itemKey={1} />
      )
    }

    return (
      <form onSubmit={this.handleSubmit}>
        <div className="container">
          <div className="row">
            <div className="col-xs-12">
              <div className="col-xs-12">{abcViewer}</div>
            </div>
          </div>

          <div className="row">
            <div className="col-xs-12">
              <div className={`form-group ${validationClass}`} id="interval-input">
                <div className="input-group">
                  <span className="input-group-addon" id="intervals-addon">*</span>
                    <input
                      type="text"
                      name="intervals"
                      value={intervals}
                      className="form-control"
                      aria-describedby="intervals-addon"
                      onChange={this.onSearchChange.bind(this)} />
                    <span className="input-group-btn">
                      <OverlayTrigger trigger={['hover', 'focus']} placement="left" overlay={tutorial}>
                        <button
                          type="button"
                          className="btn btn-default">
                          <i className="fa fa-question" aria-hidden="true"></i>
                        </button>
                      </OverlayTrigger>
                    </span>
                </div>
                <span id="intervals-error" className="help-block">{errorMessage}</span>
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