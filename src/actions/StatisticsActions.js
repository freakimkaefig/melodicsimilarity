import AppDispatcher from '../dispatchers/AppDispatcher';
import {UPDATE_STATISTIC} from '../constants/StatisticsConstants';

export default {
  updateStatistics: (response) => {
    AppDispatcher.dispatch({
      actionType: UPDATE_STATISTIC,
      response: response
    });
  }
}