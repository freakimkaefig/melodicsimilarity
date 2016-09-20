import React, {PropTypes} from 'react';
import ParsonViewer from '../../ParsonViewer';
import {OverlayTrigger, Popover} from 'react-bootstrap';
import InputRange from 'react-input-range';
import MelodyActions from '../../../actions/MelodyActions';
import SearchStore from '../../../stores/SearchStore';

export default class ParsonsCode extends React.Component {
  static propTypes = {
    submit: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.INPUT_REGEX = /^[udr]*$/;

    this.state = {
      parsons: SearchStore.parsonQuery,
      error: false,
      errorMessage: '',
      threshold: SearchStore.threshold,
      disabled: true
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
      parsons: SearchStore.parsonQuery,
      threshold: SearchStore.threshold,
      disabled: SearchStore.parsonQuery.length === 0
    });
  }

  validateParsonString(value) {
    let regex = new RegExp(this.INPUT_REGEX);

    var error = false;
    var errorMessage = '';

    if (!regex.test(value)) {
      error = true;
      errorMessage = 'Die Konturlinie enthält ungültige Zeichen.';

      if (value.length < 1) {
        error = true;
        errorMessage = '';
      }
    }

    this.setState({
      error: error,
      errorMessage: errorMessage
    });

    return !error;
  }

  onSearchChange(event) {
    let parsons = event.target.value;
    if (this.validateParsonString(parsons)) {
      MelodyActions.updateParsonQuery(parsons);
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

    let thresholdTutorial = (
      <Popover title="Threshold" id="parsons-threshold-tutorial">
        <p>Der Threshold legt den Schwellenwert für die Ähnlichkeitsberechnung fest, den die Suchergebnisse nicht unterschreiten dürfen.</p>
      </Popover>
    );

    return (
      <form onSubmit={this.handleSubmit}>
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
                    className="react-autosuggest__input"
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
                <span id="parsons-error" className="help-block text-danger">{errorMessage}</span>
              </div>
            </div>
          </div>

          <div className="row threshold">
            <div className="col-xs-12 col-sm-6 col-md-4">
              <OverlayTrigger trigger={['hover', 'focus']} placement="top" overlay={thresholdTutorial}>
                <label>Threshold <small><i className="fa fa-question-circle" aria-hidden="true"></i></small></label>
              </OverlayTrigger>
              <InputRange
                maxValue={100}
                minValue={0}
                step={5}
                value={this.state.threshold}
                labelSuffix="%"
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