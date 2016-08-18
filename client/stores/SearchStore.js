import BaseStore from './BaseStore';
import {
  SEARCH_QUERY_URL,
  UPDATE_FACETS,
  UPDATE_METADATA_QUERY,
  UPDATE_RESULT_IMAGE,
  UPDATE_METADATA
} from '../constants/SolrConstants';
import {
  UPDATE_FIELD_VALUE,
  UPDATE_SEARCH_OPERATOR,
  UPDATE_SEARCH_START,
  RESET_SEARCH,
  START_SEARCH,
  UPDATE_RESULTS
} from '../constants/SearchConstants';
import {
  INTERVAL_DEFAULT_ABC,
  MELODY_DEFAULT_ABC,
  UPDATE_MODE,
  UPDATE_PARSON_QUERY,
  UPDATE_INTERVAL_QUERY,
  UPDATE_MELODY_QUERY,
  UPDATE_THRESHOLD
} from '../constants/MelodyConstants';
import SolrService from '../services/SolrService';
import SolrQuery from '../helpers/SolrQuery';

class SearchStore extends BaseStore {

  constructor() {
    super();
    this.subscribe(() => this._registerToActions.bind(this));

    this._initVars(true);
  }

  _initVars(complete) {
    this._fields = {};

    this._operator = false;
    this._start = 0;
    this._rows = 8;

    if (complete) {
      this._facets = {};
      this._melodyMode = 0;
    }
    this._query = new SolrQuery(SEARCH_QUERY_URL);
    this._queryFields = [];
    this._results = [];
    this._highlighting = {};
    this._numFound = 0;

    this._parsonQuery = '';
    this._intervalQuery = '';
    this._intervalAbc = INTERVAL_DEFAULT_ABC;
    this._melodyQuery = [];
    this._melodyAbc = MELODY_DEFAULT_ABC;
    this._threshold = 50;
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

      case RESET_SEARCH:
        this._initVars(false);
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

      case UPDATE_INTERVAL_QUERY:
        this._intervalQuery = action.intervals;
        this._intervalAbc = action.abc;
        this.emitChange();
        break;

      case UPDATE_MELODY_QUERY:
        this._melodyQuery = action.melody;
        this._melodyAbc = action.abc;
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
        let result = this._results.find(result => {
          return result.id === action.signature;
        });
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

  get intervalQuery() {
    return this._intervalQuery;
  }

  get intervalAbc() {
    return this._intervalAbc;
  }

  get melodyQuery() {
    return this._melodyQuery;
  }

  get melodyAbc() {
    return this._melodyAbc;
  }

  get threshold() {
    return this._threshold;
  }

  get submit() {
    return !this._query.isEmpty();
  }
}

export default new SearchStore();