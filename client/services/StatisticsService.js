import request from 'reqwest';
import when from 'when';
import {
  STATISTICS_URL,
  SIMILARITY_URL
} from '../constants/StatisticsConstants';
import {FIELDS,
  SEARCH_QUERY_URL,
  METADATA_QUERY_URL
} from '../constants/SolrConstants';
import {
  statistics
} from '../../server/config/api.config.json';
import SolrService from './SolrService';
import StatisticsActions from '../actions/StatisticsActions';
import DateHelper from '../helpers/DateHelper';

class StatisticsService {

  getStatistics(mode) {
    if (statistics[mode].datatype === 'melodic') {
      return this.handleMelodicStatisticsResponse(when(request({
        url: STATISTICS_URL + mode,
        method: 'GET',
        crossOrigin: true
      })));
    } else if (statistics[mode].datatype === 'date') {
      let fields = FIELDS.filter(item => {
        return item.input === 'date' && item.statistic === true;
      });
      let queryString = '?q=*:*&rows=0&wt=json&facet=true';
      for (var field of fields) {
        queryString += '&facet.field=' + field.name;
      }
      return this.handleTemporalStatisticsResponse(when(request({
        url: METADATA_QUERY_URL + queryString,
        method: 'GET',
        crossOrigin: true
      })));
    } else if (statistics[mode].datatype === 'geo') {
      let queryString = '?q=*:*&rows=0&wt=json&facet=true&facet.field=' + mode + 'Facet';
      return this.handleGeoStatisticResponse(when(request({
        url: METADATA_QUERY_URL + queryString,
        method: 'GET',
        crossOrigin: true
      })));
    } else if (statistics[mode].datatype === 'tag') {
      let queryString = '?q=*:*&rows=0&wt=json&facet=true&facet.field=' + mode + 'Facet';
      return this.handleTagStatisticResponse(when(request({
        url: METADATA_QUERY_URL + queryString,
        method: 'GET',
        crossOrigin: true
      })));
    } else if (statistics[mode].datatype === 'graph') {
      return this.handleGraphSimilarityResponse(when(request({
        url: SIMILARITY_URL,
        method: 'GET',
        crossOrigin: true
      })));
    }
  }

  handleMelodicStatisticsResponse(promise) {
    return promise
      .then(response => {
        if (response.hasOwnProperty('data')) {
          StatisticsActions.updateMelodicStatistics(response);
        }
      })
      .catch(error => {
        console.log(error);
      });
  }
  
  handleTemporalStatisticsResponse(promise) {
    return promise
      .then(response => {
        let data = [];
        let fieldDates = [];
        let min = Infinity;
        let max = -Infinity;
        var x = 0;

        // iterate over all date fields (dateFindAid, receivedOn, sungOn, recordedOn, submittedOn)
        for (x = 0; x < response.responseHeader.params['facet.field'].length; x++) {
          let dateFacets = [];
          let field = response.responseHeader.params['facet.field'][x];
          let facets = response.facet_counts.facet_fields[field];
          var i = 0;

          // iterate over returned facets from solr
          for (i = 0; i < facets.length; i++) {
            if (i % 2 === 0) {
              var item = facets[i];
              if (DateHelper.hasValidYear(item)) {
                if (min > parseInt(DateHelper.extractYear(item))) min = parseInt(DateHelper.extractYear(item));
                if (max < parseInt(DateHelper.extractYear(item))) max = parseInt(DateHelper.extractYear(item));
                var count = facets[i + 1];
                dateFacets.push({
                  year: parseInt(DateHelper.extractYear(item)),
                  y: count
                });
              }
            }
          }
          fieldDates.push({
            name: field,
            dateFacets: dateFacets
          });
        }

        // generate data between min and max date for all fields
        for (x = 0; x < fieldDates.length; x++) {
          let dates = [];
          for (i = min; i < max; i++) {
            let findCount = 0;
            find = fieldDates[x].dateFacets.find(item => {
              return item.year === i;
            });
            if (typeof find !== 'undefined') {
              findCount = find.y;
            }
            dates.push([Date.UTC(i, 0, 1), findCount]);
          }
          data.push({
            name: FIELDS.find(item => {
              return item.name === fieldDates[x].name;
            }).display,
            data: dates
          });
        }

        // populate result
        StatisticsActions.updateDateStatistics(data, response.response.numFound);
      })
      .catch(error => {
        console.log(error);
      });
  }
  
  handleGeoStatisticResponse(promise) {
    return promise
      .then(response => {
        let field = response.responseHeader.params['facet.field'];
        let fieldName = field.replace('Facet', '');
        let facets = response.facet_counts.facet_fields[field];
        let labels = [];
        let values = [];
        for (var i = 0; i < facets.length; i++) {
          if (i % 2 === 0) {
            if (facets[i] != '') {
              labels.push(facets[i]);
              values.push(facets[i + 1]);
            } else {
              labels.push("Unbekannt");
              values.push(facets[i + 1]);
            }
          }
        }
        StatisticsActions.updateGeoStatistics(fieldName, labels, values, response.response.numFound);
      })
      .catch(error => {
        console.log(error);
      });
  }
  handleTagStatisticResponse(promise) {
    return promise
      .then(response => {
        let field = response.responseHeader.params['facet.field'];
        let fieldName = field.replace('Facet', '');
        let facets = response.facet_counts.facet_fields[field];
        let data = [];
        for (var i = 0; i < facets.length; i++) {
          if (i % 2 === 0) {
            if (facets[i] != '') {
              data.push({
                value: facets[i],
                count: facets[i + 1]
              });
            }
          }
        }
        StatisticsActions.updateTagStatistics(fieldName, data, response.response.numFound);
      })
      .catch(error => {
        console.log(error);
      });
  }

  handleGraphSimilarityResponse(promise) {
    return promise
      .then(response => {
        let edges = [];
        response.forEach(item => {
          let signature = item.signature;
          SolrService.findGraphDoc(signature);

          for (var distance of item.distances) {
            let search = edges.filter(i => {
              return (i.from === signature && i.to === distance.signature)
                || (i.from === distance.signature && i.to === signature);
            });
            if (search.length === 0) {
              edges.push({
                from: signature,
                to: distance.signature,
                title: "Edit-Distance (" + signature + " <> " + distance.signature + "): " + parseFloat(distance.distance).toFixed(2),
                length: distance.distance * 1000
              });
            }
          }
        });
        StatisticsActions.updateGraphEdges(edges, response.length);
      })
      .catch(error => {
        console.log(error);
      });
  }
}

export default new StatisticsService();