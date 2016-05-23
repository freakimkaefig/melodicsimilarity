import BaseStore from './BaseStore';
import {FIELDS} from '../constants/SolrConstants';
import {UPDATE_FIELD_VALUE} from '../constants/SearchConstants';

class SearchStore extends BaseStore {

  constructor() {
    super();
    this.subscribe(() => this._registerToActions.bind(this));

    this._fields = {};
  }

  _registerToActions(action) {
    switch(action.actionType) {
      case UPDATE_FIELD_VALUE:
        this._fields[action.field] = action.value;
        this.emitChange();
        break;

      default:
        break;
    }
  }

  get fields() {
    return this._fields;
  }
}

export default new SearchStore();