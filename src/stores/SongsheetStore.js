import BaseStore from './BaseStore';
import { LOAD_LIST, LOAD_ITEM } from '../constants/SongsheetConstants';

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
}

export default new SongsheetStore();