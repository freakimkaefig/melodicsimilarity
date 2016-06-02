import React from 'react';
import ParsonViewer from '../../ParsonViewer';
import {OverlayTrigger, Popover} from 'react-bootstrap';

export default class ParsonsCode extends React.Component {
  constructor(props) {
    super(props);

    this.INPUT_REGEX = /^[udr]+$/;
    this.DEFAULT_PARSONS = '';

    this.state = {
      parsons: this.DEFAULT_PARSONS,
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
      errorMessage = 'Die Konturlinie enthält ungültige Zeichen.';
    }

    this.setState({
      error: error,
      errorMessage: errorMessage
    });

    return !error;
  }

  onSearchChange(event) {
    let parsons = event.target.value;
    if (this.validateIntervalString(parsons)) {

    }
    this.setState({
      parsons: this.DEFAULT_PARSONS + parsons
    });
  }

  render() {
    let { parsons, error, errorMessage } = this.state;
    let validationClass = error ? 'has-error' : 'has-success';

    let tutorial = (
      <Popover title="Erläuterung" id="parsons-tutorial">
        <p><strong>*</strong> = Referenznote (Erste Note, wird automatisch eingefügt)</p>
        <p>u = Anstieg der Tonhöhe (<strong>u</strong>p)</p>
        <p>d = Senkung der Tonhöhe (<strong>d</strong>own)</p>
        <p>r = Gleichbleibende Tonhöhe (<strong>r</strong>epeat)</p>
      </Popover>
    );

    return (
      <div className="container">
        <div className="row">
          <div className="col-xs-12">
            <ParsonViewer parson={parsons} />
          </div>
        </div>

        <div className="row">
          <div className="col-xs-12">
            <div className={`form-group ${validationClass}`} id="parson-input">
              <div className="input-group">
                <span className="input-group-addon" id="parsons-addon">*</span>
                <input
                  type="text"
                  name="parsons"
                  value={parsons}
                  className="form-control"
                  aria-describedby="parsons-addon"
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
              <span id="parsons-error" className="help-block">{errorMessage}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}