import BaseStore from './BaseStore';
import { SEARCH_QUERY_URL, UPDATE_FACETS, UPDATE_METADATA_QUERY, UPDATE_RESULT_IMAGE, UPDATE_METADATA } from '../constants/SolrConstants';
import {UPDATE_FIELD_VALUE, UPDATE_SEARCH_OPERATOR, UPDATE_SEARCH_START, START_SEARCH, UPDATE_RESULTS} from '../constants/SearchConstants';
import { UPDATE_MODE, UPDATE_PARSON_QUERY, UPDATE_THRESHOLD } from '../constants/MelodyConstants';
import SolrService from '../services/SolrService';
import SolrQuery from '../helpers/SolrQuery';
class SearchStore extends BaseStore {

  constructor() {
    super();
    this.subscribe(() => this._registerToActions.bind(this));

    this._fields = {};
    this._operator = false;
    this._start = 0;
    this._rows = 3;

    this._facets = {};
    this._query = new SolrQuery(SEARCH_QUERY_URL);
    this._queryFields = [];
    this._results = [];
    this._highlighting = {};
    this._numFound = 0;

    this._melodyMode = 0;
    this._parsonQuery = '';
    this._threshold = 30;
  }

  _registerToActions(action) {
    switch(action.actionType) {
      case START_SEARCH:
        this._results = [];
        this.emitChange();
        break;

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

      case UPDATE_FACETS:
        this._facets[action.field] = action.facets;
        this.emitChange();
        break;

      case UPDATE_METADATA_QUERY:
        this._queryFields = action.fields;
        this._query = action.query;
        this._results = [];
        this._highlighting = {};
        this.emitChange();
        break;

      case UPDATE_MODE:
        this._melodyMode = action.mode;
        this.emitChange();
        break;

      case UPDATE_THRESHOLD:
        this._threshold = action.threshold;
        this.emitChange();
        break;

      case UPDATE_PARSON_QUERY:
        this._parsonQuery = action.parson;
        this.emitChange();
        break;

      case UPDATE_METADATA:
        if (action.response.response.numFound > 0) {
          let findResult = this._results.find(item => {
            return item.id === action.response.response.docs[0].signature;
          });
          if (findResult) {
            findResult.metadata = action.response.response.docs[0];
          }
        }
        this.emitChange();
        break;
      
      case UPDATE_RESULTS:
        this._results = action.results;
        this._results.forEach(item => {
          if (typeof item.metadata == 'undefined') {
            item.metadata = {
              imagename: 'placeholder.jpg',
              title: 'Kein Incipit vorhanden'
            }
            SolrService.findDoc(item.id);
          }
          item.url = '/songsheets/' + item.id;
        });
        this.emitChange();
        break;

      case UPDATE_RESULT_IMAGE:
        // console.log(action);
        let result = this._results.find(result => {
          return result.id === action.signature;
        });
        // console.log(result);
        // result.image = action.image;
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

  get facets() {
    return this._facets;
  }

  get query() {
    return this._query;
  }
  
  get queryFields() {
    return this._queryFields;
  }

  get results() {
    return this._results.sort((a, b) => a.rank - b.rank);
  }

  get highlighting() {
    return this._highlighting;
  }

  get numFound() {
    return this._numFound;
  }

  get melodyMode() {
    return this._melodyMode;
  }

  get parsonQuery() {
    return this._parsonQuery;
  }

  get threshold() {
    return this._threshold;
  }

  get submit() {
    return !this._query.isEmpty();
  }
}

export default new SearchStore();