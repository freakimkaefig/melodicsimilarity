import BaseStore from './BaseStore';
import {
  UPDATE_MELODIC_STATISTIC,
  UPDATE_DATE_STATISTIC,
  UPDATE_GEO_STATISTIC,
  UPDATE_TAG_STATISTIC,
  UPDATE_GRAPH_NODES,
  UPDATE_GRAPH_EDGES
} from '../constants/StatisticsConstants';
import update from 'react-addons-update';

class StatisticsStore extends BaseStore {
  
  constructor() {
    super();
    this.subscribe(() => this._registerToActions.bind(this));

    this._statistics = {
      notes: {labels: [], values: []},
      intervals: {labels: [], values: []},
      durations: {labels: [], values: []},
      rests: {labels: [], values: []},
      keys: {labels: [], values: []},
      meters: {labels: [], values: []},
      counts: []
    };
    this._dates = [];
    this._geo = {};
    this._tag = {};
    this._graph = {
      nodes: [],
      edges: []
    }
  }
  
  _registerToActions(action) {
    switch(action.actionType) {
      case UPDATE_MELODIC_STATISTIC:
        this._statistics[action.response.mode] = action.response.data;
        this.emitChange();
        break;
      
      case UPDATE_DATE_STATISTIC:
        this._dates = action.data;
        this.emitChange();
        break;
      
      case UPDATE_GEO_STATISTIC:
        this._geo[action.mode] = {
          labels: action.labels,
          values: action.values
        };
        this.emitChange();
        break;

      case UPDATE_TAG_STATISTIC:
        this._tag[action.mode] = action.data;
        this.emitChange();
        break;

      case UPDATE_GRAPH_NODES:
        this._graph.nodes = update(this._graph.nodes, {$push: [action.node]});
        this.emitChange();
        break;

      case UPDATE_GRAPH_EDGES:
        this._graph.edges = action.edges;
        this.emitChange();
        break;
    }
  }

  get notes() {
    return this._statistics.notes;
  }

  get intervals() {
    return this._statistics.intervals;
  }

  get durations() {
    return this._statistics.durations;
  }

  get rests() {
    return this._statistics.rests;
  }

  get keys() {
    return this._statistics.keys;
  }

  get meters() {
    return this._statistics.meters;
  }

  get counts() {
    return this._statistics.counts;
  }

  get dates() {
    return this._dates;
  }

  get origin() {
    if (typeof this._geo.origin !== 'undefined') {
      return this._geo.origin;
    } else {
      return false;
    }
  }

  get archive() {
    if (typeof this._geo.archive !== 'undefined') {
      return this._geo.archive;
    } else {
      return false;
    }
  }

  get singPlace() {
    if (typeof this._tag.singPlace !== 'undefined') {
      return this._tag.singPlace.sort((a, b) => {
        return b.count - a.count;
      });
    } else {
      return [];
    }
  }
  
  get graph() {
    return this._graph;
  }
}

export default new StatisticsStore();