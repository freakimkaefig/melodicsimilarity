import request from 'reqwest';
import when from 'when';
import SettingsActions from '../actions/SettingsActions';
import {
  GET_SETTINGS_URL,
  UPDATE_SETTINGS_URL
} from '../constants/SettingsConstants';
import LoginStore from '../stores/LoginStore';
import ErrorHelper from '../helpers/ErrorHelper';

class SettingsService {

  getField(field) {
    SettingsActions.beginUpdateField(field);
    return this.handleGetField(when(request({
      url: GET_SETTINGS_URL +  field,
      method: 'GET',
      crossOrigin: true,
      type: 'json'
    })));
  }

  handleGetField(premise) {
    return premise
      .then(response => {
        SettingsActions.updateField(response);
      })
      .catch(error => {
        ErrorHelper.handleRequestError(error);
      });
  }

  updateField(field, value) {
    SettingsActions.beginUpdateField(field);
    return this.handleUpdateField(when(request({
      url: UPDATE_SETTINGS_URL + field + '/' + value,
      method: 'PUT',
      crossOrigin: true,
      type: 'json',
      headers: {
        'Authorization': 'Bearer ' + LoginStore.jwt
      }
    })));
  }

  handleUpdateField(premise) {
    return premise
      .then(response => {
        SettingsActions.updateField(response.value);
      })
      .catch(error => {
        ErrorHelper.handleRequestError(error);
      });
  }
}

export default new SettingsService();