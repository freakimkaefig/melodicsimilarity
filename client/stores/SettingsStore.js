import BaseStore from './BaseStore';
import {
  BEGIN_UPDATE_FIELD,
  UPDATE_FIELD
} from '../constants/SettingsConstants';
import {
  settings
} from '../../server/config/api.config.json';

class SettingsStore extends BaseStore {

  constructor() {
    super();
    this.subscribe(() => this._registerToActions.bind(this));

    this._ready = false;
    this._settings = {};

    settings.forEach((item) => {
      this._settings[item.key] = item;
    });
  }

  _registerToActions(action) {
    switch(action.actionType) {
      case BEGIN_UPDATE_FIELD:
        this._settings[action.field].loading = true;
        this.emitChange();
        break;

      case UPDATE_FIELD:
        this._settings[action.field].loading = false;
        if (action.type === 'float') {
          this._settings[action.field].value = parseFloat(action.value);
        } else {
          this._settings[action.field].value = action.value;
        }

        let ready = true;
        settings.forEach((item) => {
          if (this._settings[item.key].loading) {
            ready = false;
          }
        });
        this._ready = ready;

        this.emitChange();
        break;
    }
  }

  get ready() {
    return this._ready;
  }

  get settings() {
    return this._settings;
  }
}

export default new SettingsStore();