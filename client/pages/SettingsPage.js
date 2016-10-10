import React from 'react';
import AuthenticatedComponent from '../components/AuthenticatedComponent';
import DocumentTitle from 'react-document-title';
import LoadingOverlay from '../components/LoadingOverlay';
import {
  APP_NAME,
  APP_URL,
  SOLR_URL,
  MONGO_URL
} from '../constants/AppConstants';
import {
  settings
} from '../../server/config/api.config.json';
import InputField from '../components/Form/InputField';
import InputRange from 'react-input-range';
import 'react-input-range-css';
import SettingsService from '../services/SettingsService';
import SettingsStore from '../stores/SettingsStore';
import '../stylesheets/SettingsPage.less';

export default AuthenticatedComponent(class SettingsPage extends React.Component {
  static displayName = 'SettingsPage';

  constructor(props) {
    super(props);

    let settings = SettingsStore.settings;

    this.state = {
      ready: SettingsStore.ready,
      threshold: settings.threshold,
      method: settings.method
    };

    this.onSettingsStoreChange = this.onSettingsStoreChange.bind(this);
  }

  componentWillMount() {
    SettingsStore.addChangeListener(this.onSettingsStoreChange);
  }

  componentWillUnmount() {
    SettingsStore.removeChangeListener(this.onSettingsStoreChange);
  }

  onSettingsStoreChange() {
    let settings = SettingsStore.settings;
    this.setState({
      ready: SettingsStore.ready,
      threshold: settings.threshold,
      method: settings.method
    });
  }

  handleChange(field, value) {
    let newState = {};
    newState[field.props.name] = { value: value / 100, loading: false };
    this.setState(newState);
  }

  handleChangeComplete(field, value) {
    SettingsService.updateField(field.props.name, value / 100);
  }

  handleSelectChange(event) {
    SettingsService.updateField(event.target.name, event.target.value);
  }

  renderSettingsList(items, state) {
    return items.map((item, index) => {
      if (item.control === 'range') {
        let value = Math.round(state[item.key].value * 100);
        let disabled = state[item.key].loading;
        return (
          <div className="col-xs-12 col-sm-6" key={index}>
            <label htmlFor={item.key}>{item.display}</label>
            <div className="range-slider">
              <InputRange
                name={item.key}
                minValue={0}
                maxValue={100}
                value={value}
                disabled={disabled}
                onChange={this.handleChange.bind(this)}
                onChangeComplete={this.handleChangeComplete.bind(this)}/>
            </div>
          </div>
        );
      } else if (item.control === 'select') {
        let options = item.options.map((option, index) => {
          return (
            <option value={option} key={index}>{option}</option>
          );
        });
        return (
          <div className="col-xs-12 col-sm-6" key={index}>
            <label htmlFor={item.key}>{item.display}</label>
            <div className="select">
              <select
                name={item.key}
                className="form-control"
                value={state[item.key].value}
                onChange={this.handleSelectChange.bind(this)}>{options}</select>
            </div>
          </div>
        );
      } else {
        return (
          <div className="col-xs-12 col-sm-6">
            <p>Setting not implemented!</p>
          </div>
        );
      }
    });
  }

  render() {
    let {
      ready
    } = this.state;

    return (
      <DocumentTitle title={`Einstellungen // ${APP_NAME}`}>
        <div className="settings-page">
          <h1 className="text-center">Einstellungen</h1>
          <LoadingOverlay loading={!ready} />
          <div className="row">
            <div className="col-xs-12 col-sm-4">
              <InputField
                name="BASE_URL"
                title="Base URL"
                input="text"
                readonly={true}
                value={APP_URL} />
            </div>
            <div className="col-xs-12 col-sm-4">
              <InputField
                name="SOLR_URL"
                title="Apache Solr URL"
                input="text"
                readonly={true}
                value={SOLR_URL} />
            </div>
            <div className="col-xs-12 col-sm-4">
              <InputField
                name="MONGO_URL"
                title="Mongo DB URL"
                input="text"
                readonly={true}
                value={MONGO_URL} />
            </div>
          </div>

          <div className="row">
            { this.renderSettingsList(settings, this.state) }
          </div>

        </div>
      </DocumentTitle>
    );
  }
});