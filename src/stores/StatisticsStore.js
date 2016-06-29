import BaseStore from './BaseStore';
import {UPDATE_STATISTIC} from '../constants/StatisticsConstants';

class StatisticsStore extends BaseStore {
  
  constructor() {
    super();
    this.subscribe(() => this._registerToActions.bind(this));
    
    this._statistics = {
      notes: [],
      intervals: [],
      keys: []
    };
  }
  
  _registerToActions(action) {
    switch(action.actionType) {
      case UPDATE_STATISTIC:
        console.log(action);
        this._statistics[action.response.mode] = action.response.values;
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

  get keys() {
    return this._statistics.keys;
  }
}

export default new StatisticsStore();