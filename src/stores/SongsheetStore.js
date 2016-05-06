import BaseStore from './BaseStore';
import { LOAD_LIST, LOAD_ITEM, RENDER_METADATA } from '../constants/SongsheetConstants';

class SongsheetStore extends BaseStore {

  constructor() {
    super();
    this.subscribe(() => this._registerToActions.bind(this));
    this._songsheets = [];
    this._songsheet = {};
  }


  _registerToActions(action) {
    switch (action.actionType) {
      case LOAD_LIST:
        this._songsheets = action.songsheets;
        this.emitChange();
        break;
      case LOAD_ITEM:
        this._songsheet = action.songsheet;
        this.emitChange();
        break;
      case RENDER_METADATA:
        this._songsheet.metadata = action.response.response.docs[0];
        this.emitChange();
        break;
      default:
        break;
    }
  }

  get songsheets() {
    return this._songsheets;
  }

  get songsheet() {
    return this._songsheet;
  }

  extractValue(str) {
    var ret = "";
    if (/"/.test(str)) {
      ret = str.match(/"(.*?)"/)[1];
    } else {
      ret = str;
    }
    return ret;
  }
}

export default new SongsheetStore();