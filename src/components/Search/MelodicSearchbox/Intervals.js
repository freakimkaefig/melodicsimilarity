import React, {PropTypes} from 'react';
import AbcViewer from '../../AbcViewer';
import MusicjsonToolbox from 'musicjson-toolbox';
import {OverlayTrigger, Popover} from 'react-bootstrap';
import InputRange from 'react-input-range';
import MelodyActions from '../../../actions/MelodyActions';
import SearchStore from '../../../stores/SearchStore';
import '../../../stylesheets/InputRange.less';

export default class Intervals extends React.Component {
  static propTypes = {
    submit: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.INPUT_REGEX = /^(-?\d{1,2}){1}(\s{1}-?\d{1,2})*\s?$/;
    this.BASE_PITCH = MusicjsonToolbox.base12Pitch('C', 0, 4, 0, true);
    this.DEFAULT_INTERVALS = '* ';
    this.DEFAULT_ABC = 'X:1\nL:1/4\nM:none\nK:C\nK:treble\nC';

    this.state = {
      abc: this.DEFAULT_ABC,
      intervals: [],
      error: false,
      errorMessage: '',
      threshold: 50
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.onSearchStoreChange = this.onSearchStoreChange.bind(this);
  }
  
  componentDidMount() {
    SearchStore.addChangeListener(this.onSearchStoreChange);
    MelodyActions.updateIntervalQuery(this.state.intervals);
    MelodyActions.updateThreshold(this.state.threshold);
  }
  
  componentWillUnmount() {
    SearchStore.removeChangeListener(this.onSearchStoreChange);
  }
  
  onSearchStoreChange() {
    if (SearchStore.intervalQuery.length > 0) {
      let intervals = SearchStore.intervalQuery;
      let abc = '';
      while (intervals.charAt(0) === '*') {
        intervals = intervals.substr(2);
      }
      let disabled = true;
      if (this.validateIntervalString(intervals)) {
        disabled = false;
        abc = intervals.split(' ').map((item, index, items) => {
          let base = this.BASE_PITCH;
          for (var i = index; i > 0; i--) {
            base += parseInt(items[i-1]);
          }
          return MusicjsonToolbox.interval2AbcStep(parseInt(item), base);
        }).join(' ');
      }
      this.setState({
        abc: this.DEFAULT_ABC + abc,
        intervals: intervals,
        threshold: SearchStore.threshold,
        disabled: disabled
      });
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
    }

    this.setState({
      error: error,
      errorMessage: errorMessage
    });

    return !error;
  }

  onSearchChange(event) {
    let intervals = event.target.value;
    MelodyActions.updateIntervalQuery(this.DEFAULT_INTERVALS + intervals);
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
    let { abc, intervals, error, errorMessage } = this.state;
    let validationClass = error ? 'has-error' : 'has-success';

    let tutorial = (
      <Popover title="Erläuterung" id="intervals-tutorial">
        <p>* = Referenznote (Erste Note, wird automatisch eingefügt)</p>
        <p>positive Zahl = Anstieg der Tonhöhe in Halbtonschritten (z.B. "2" für 2 Halbtonschritte)</p>
        <p>negative Zahl = Senkung der Tonhöhe in Halbtonschritten (z.B. "-5" für 5 Halbtonschritte)</p>
        <p>0 = Gleichbleibende Tonhöhe</p>
      </Popover>
    );

    return (
      <form onSubmit={this.handleSubmit}>
        <div className="container">
          <div className="row">
            <div className="col-xs-12">
              <AbcViewer abc={abc} itemKey={1} />
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
                value={this.state.threshold}
                onChange={this.handleThresholdChange.bind(this)} />
            </div>
          </div>

          <div className="row">
            <div className="col-xs-12 text-right">
              <button
                type="submit"
                className="btn btn-default"
                disabled={this.state.disabled}>
                <i className="fa fa-search" aria-hidden="true"></i>
              </button>
            </div>
          </div>
        </div>
      </form>
    );
  }
}