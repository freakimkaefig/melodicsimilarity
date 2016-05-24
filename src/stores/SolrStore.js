import { UPDATE_FACETS, UPDATE_QUERY, UPDATE_RESULTS, UPDATE_RESULT_IMAGE } from '../constants/SolrConstants';
import BaseStore from './BaseStore';

class SolrStore extends BaseStore {

  constructor() {
    super();
    this.subscribe(() => this._registerToActions.bind(this));
    this._facets = {};
    this._query = [];
    this._results = [];
    this._highlighting = {};
    this._numFound = 0;
  }
  
  _registerToActions(action) {
    switch (action.actionType) {
      case UPDATE_FACETS:
        this._facets[action.field] = action.facets;
        this.emitChange();
        break;
      case UPDATE_QUERY:
        this._query = action.fields;
        this._results = [];
        this._highlighting = {};
        this.emitChange();
        break;
      case UPDATE_RESULTS:
        if (action.results.length > 0) {
          this._results = action.results;
          this._highlighting = action.highlighting;
          this._numFound = action.numFound;
        } else {
          this._results.push(false);
          this._highlighting = {};
          this._numFound = 0;
        }
        this.emitChange();
        break;
      case UPDATE_RESULT_IMAGE:
        this._results.find(result => {
          return result.signature === action.signature;
        }).image = action.image;
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

  get numFound() {
    return this._numFound;
  }
}

export default new SolrStore();
