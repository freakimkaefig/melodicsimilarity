import React from 'react';
import AbcViewer from '../../AbcViewer';
import MusicjsonToolbox from 'musicjson-toolbox';
import {OverlayTrigger, Popover} from 'react-bootstrap';

export default class Intervals extends React.Component {

  constructor(props) {
    super(props);

    this.INPUT_REGEX = /^(-?\d{1,2}){1}(\s{1}-?\d{1,2})*\s?$/;
    this.BASE_PITCH = MusicjsonToolbox.base12Pitch('C', 0, 4, 0, true);
    this.DEFAULT_ABC = 'X:1\nL:1/4\nM:none\nK:C\nK:treble\nC';

    this.state = {
      abc: this.DEFAULT_ABC,
      intervals: '',
      error: false,
      errorMessage: ''
    }
  }

  validateIntervalString(value) {
    let regex = new RegExp(this.INPUT_REGEX);

    var error = false;
    var errorMessage = '';
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
    let intervals = '';
    if (this.validateIntervalString(event.target.value)) {
      intervals = event.target.value.trim().split(' ').map((item, index, items) => {
        let base = this.BASE_PITCH;
        for (var i = index; i > 0; i--) {
          base += parseInt(items[i-1]);
        }
        console.log(parseInt(item), base);
        return MusicjsonToolbox.interval2AbcStep(parseInt(item), base);
      }).join(' ');
    }
    this.setState({
      abc: this.DEFAULT_ABC + ' ' + intervals,
      intervals: event.target.value
    });
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
      </div>
    );
  }
}