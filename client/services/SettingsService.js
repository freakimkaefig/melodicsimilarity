import request from 'reqwest';
import when from 'when';
import SettingsActions from '../actions/SettingsActions';
import {
  GET_SETTINGS_URL,
  UPDATE_SETTINGS_URL
} from '../constants/SettingsConstants';
import LoginStore from '../stores/LoginStore';

class SettingsService {

  getField(field) {
    SettingsActions.beginUpdateField(field);
    return this.handleGetField(when(request({
      url: GET_SETTINGS_URL + field,
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
        console.log(error);
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
        console.log(error);
      });
  }
}

export default new SettingsService();