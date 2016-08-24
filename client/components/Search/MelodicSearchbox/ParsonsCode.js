import React, {PropTypes} from 'react';
import ParsonViewer from '../../ParsonViewer';
import {OverlayTrigger, Popover} from 'react-bootstrap';
import InputRange from 'react-input-range';
import MelodyActions from '../../../actions/MelodyActions';
import SearchStore from '../../../stores/SearchStore';
import '../../../stylesheets/InputRange.less';

export default class ParsonsCode extends React.Component {
  static propTypes = {
    submit: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.INPUT_REGEX = /^[udr]+$/;

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
    let parson = SearchStore.parsonQuery;
    if (parson.length > 0) {
      while (parson.charAt(0) === '*') {
        parson = parson.substr(1);
      }
    }

    let disabled = true;
    if (this.validateParsonString(parson)) {
      disabled = false;
    }

    this.setState({
      parsons: parson,
      threshold: SearchStore.threshold,
      disabled: disabled
    });
  }

  validateParsonString(value) {
    let regex = new RegExp(this.INPUT_REGEX);

    var error = false;
    var errorMessage = '';

    if (value.length <= 0) {
      error = true;
      errorMessage = 'Die Konturlinie ist zu kurz.';
    }

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
    MelodyActions.updateParsonQuery(parsons);
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