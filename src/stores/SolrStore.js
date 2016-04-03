import { FOUND_DOC } from '../constants/SolrConstants';
import BaseStore from './BaseStore';


class SolrStore extends BaseStore {

  constructor() {
    super();
    this.subscribe(() => this._registerToActions.bind(this));
    this._response = null;
  }

  _registerToActions(action) {
    switch(action.actionType) {
      case FOUND_DOC:
        this._response = action.response;
        this.emitChange();
        break;
      default:
        break;
    }
  }

  get response() {
    return this._response;
  }
}

export default new SolrStore();