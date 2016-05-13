import { UPDATE_FACETS, UPDATE_QUERY, UPDATE_RESULTS } from '../constants/SolrConstants';
import BaseStore from './BaseStore';

class SolrStore extends BaseStore {

  constructor() {
    super();
    this.subscribe(() => this._registerToActions.bind(this));
    this._facets = {};
    this._query = [];
    this._results = [];
    this._highlighting = [];
  }
  
  _registerToActions(action) {
    switch (action.actionType) {
      case UPDATE_FACETS:
        this._facets[action.field] = action.facets;
        this.emitChange();
        break;
      case UPDATE_QUERY:
        this._query = action.fields;
        this.emitChange();
        break;
      case UPDATE_RESULTS:
        this._results = action.results;
        this._highlighting = action.highlighting;
        this.emitChange();
        break;
      default:
        break;
    }
  }

  get facets() {
    return this._facets;
  }

  get query() {
    return this._query;
  }
  
  get results() {
    return this._results;
  }

  get highlighting() {
    return this._highlighting;
  }
}

export default new SolrStore();
