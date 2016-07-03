import BaseStore from './BaseStore';
import {UPDATE_MELODIC_STATISTIC, UPDATE_DATE_STATISTIC, UPDATE_GEO_STATISTIC, UPDATE_TAG_STATISTIC} from '../constants/StatisticsConstants';

class StatisticsStore extends BaseStore {
  
  constructor() {
    super();
    this.subscribe(() => this._registerToActions.bind(this));

    this._statistics = {
      notes: [],
      intervals: [],
      durations: [],
      rests: [],
      keys: [],
      meters: [],
      counts: [],
    };
    this._dates = [];
    this._geo = {};
    this._tag = {};
  }
  
  
  _registerToActions(action) {
    switch(action.actionType) {
      case UPDATE_MELODIC_STATISTIC:
        this._statistics[action.response.mode] = action.response.values;
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

      default:
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
}

export default new StatisticsStore();