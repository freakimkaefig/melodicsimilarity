import BaseStore from './BaseStore';
import { SET_MUSIC_JSON } from '../constants/AbcConstants';

class AbcStore extends BaseStore {
  
  constructor() {
    super();
    this.subscribe(() => this._registerToActions.bind(this));
    this._json = '';
  }

  _registerToActions(action) {
    switch (action.actionType) {
      case SET_MUSIC_JSON:
        this._json = action.json;
        this.emitChange();
        break;
      default:
        break;
    };
  }
  
  get json() {
    return this._json;
  }
}

export default new AbcStore();