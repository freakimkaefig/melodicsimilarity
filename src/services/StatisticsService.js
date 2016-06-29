import request from 'reqwest';
import when from 'when';
import {STATISTICS_URL} from '../constants/StatisticsConstants';
import StatisticsAsctions from '../actions/StatisticsActions';

class StatisticsService {

  getStatistics(mode) {
    return this.handleStatisticsResponse(when(request({
      url: STATISTICS_URL + mode,
      method: 'GET',
      crossOrigin: true
    })));
  }

  handleStatisticsResponse(premise) {
    return premise
      .then(function(response) {
        if (response.hasOwnProperty('values')) {
          StatisticsAsctions.updateStatistics(response);
        }
      });
  }
}

export default new StatisticsService();