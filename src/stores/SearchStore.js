import BaseStore from './BaseStore';
import {UPDATE_FIELD_VALUE, UPDATE_SEARCH_OPERATOR, UPDATE_SEARCH_START} from '../constants/SearchConstants';

class SearchStore extends BaseStore {

  constructor() {
    super();
    this.subscribe(() => this._registerToActions.bind(this));

    this._fields = {};
    this._operator = false;
    this._start = 0;
    this._rows = 10;
  }

  _registerToActions(action) {
    switch(action.actionType) {
      case UPDATE_FIELD_VALUE:
        this._fields[action.field] = action.value;
        this.emitChange();
        break;
      
      case UPDATE_SEARCH_OPERATOR:
        this._operator = action.value;
        this.emitChange();
        break;

      case UPDATE_SEARCH_START:
        this._start = action.value;
        this.emitChange();
        break;

      default:
        break;
    }
  }

  get fields() {
    return this._fields;
  }
  
  get operator() {
    return this._operator;
  }
  
  get start() {
    return this._start;
  }
  
  get rows() {
    return this._rows;
  }
}

export default new SearchStore();