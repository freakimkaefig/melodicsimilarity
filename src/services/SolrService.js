import request from 'reqwest';
import when from 'when';
import {
  SEARCH_QUERY_URL,
  FIELDS
} from '../constants/SolrConstants';
import {
  ITEM_URL
} from '../constants/SongsheetConstants';
import SolrActions from '../actions/SolrActions';
import SearchActions from '../actions/SearchActions';
import StatisticsActions from '../actions/StatisticsActions';
import SolrQuery from '../helpers/SolrQuery';
import DateHelper from '../helpers/DateHelper';

class SolrService {

  findDoc(signature) {
    let requestObject = request({
      url: SEARCH_QUERY_URL,
      method: 'POST',
      crossOrigin: true,
      type: 'json',
      contentType: 'application/json',
      data: JSON.stringify({
        params:{
          q: "signature:\"" + signature + "\""
        }
      })
    });
    return this.handleFindResponse(when(requestObject));
  }

  handleFindResponse(findPromise) {
    return findPromise
      .then(response => {
        SolrActions.updateMetadata(response);
        return true;
      });
  }

  getFacets(field) {
    let queryString = '?q=*:*&rows=0&wt=json&facet=true&facet.field=' + field + 'Facet';
    let requestObject = request({
      url: SEARCH_QUERY_URL + queryString,
      method: 'GET',
      crossOrigin: true
    });

    return this.handleFacetResponse(when(requestObject));
  }

  handleFacetResponse(facetPromise) {
    return facetPromise
      .then(response => {
        let fieldName = response.responseHeader.params["facet.field"].replace('Facet', '');
        let fieldProperties = FIELDS.find(field => {
          return field.name === fieldName;
        });
        let facets = [];

        switch (fieldProperties.input) {
          case 'text':
            facets = response.facet_counts.facet_fields[response.responseHeader.params["facet.field"]].filter((facet, index) => {
              if (index % 2 === 0) {
                return isNaN(parseFloat(facet)) &! isFinite(facet);
              }
            });
            SolrActions.updateFacets(fieldName, facets);
            break;

          case 'date':
            facets = response.facet_counts.facet_fields[response.responseHeader.params["facet.field"]].filter((facet, index) => {
              if (fieldProperties.input === 'date') {
                if (index % 2 === 0) {  // Filter solr counts
                  return DateHelper.hasValidYear(facet);
                }
              }
            }).map(facet => {
              return parseInt(DateHelper.extractYear(facet));
            });

            SolrActions.updateFacets(fieldName, {
              min: Math.min(...facets),
              max: Math.max(...facets)
            });
            break;
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  generateQuery(fields, operator, start, rows) {
    let queryArray = [];
    let query = new SolrQuery(SEARCH_QUERY_URL);
    query.setHighlighting(true, 'em', 300, 3);
    query.setOperator(operator);
    query.setStart(start);
    query.setRows(rows);

    for (var key in fields) {
      if (!fields.hasOwnProperty(key)) continue;
      if (fields[key] === '') continue;

      if (key === 'search') {
        query.addQueryString(fields[key]);
        queryArray.push({name: 'search', value: fields[key]});
        continue;
      }

      let fieldProperties = FIELDS.find(field => {
        return field.name === key;
      });

      switch (fieldProperties.input) {
        case 'text':
          query.addQueryField(key, fields[key], fieldProperties.exact);
          queryArray.push({name: key, value: fields[key]});
          break;

        case 'date':
          if (fields[key].min !== DateHelper.getDefaultMinYear() && fields[key].max !== DateHelper.getDefaultMaxYear()) {
            query.addDateField(key, fields[key]);
            queryArray.push({name: key, value: fields[key].min + '-' + fields[key].max});
          }
          break;
      }
    }

    SolrActions.updateQuery(queryArray, query);
    SearchActions.updateStart(start);

    return query;
  }

  findSongsheet(signature) {
    return this.handleSearchSongsheetResponse(when(request({
      url: ITEM_URL + signature,
      method: 'GET',
      crossOrigin: true
    })));
  }

  handleSearchSongsheetResponse(searchPromise) {
    return searchPromise
      .then(response => {
        SolrActions.updateResultImage(response);
      })
      .catch(error => {
        console.log(error);
      });
  }

  findSimilarDoc(signature) {
    let requestObject = request({
      url: SEARCH_QUERY_URL,
      method: 'POST',
      crossOrigin: true,
      type: 'json',
      contentType: 'application/json',
      data: JSON.stringify({
        params:{
          q: "signature:\"" + signature + "\""
        }
      })
    });
    return this.handleSimilarFindResponse(when(requestObject));
  }

  handleSimilarFindResponse(findPromise) {
    return findPromise
      .then(response => {
        SolrActions.updateSimilarMetadata(response);
        return true;
      })
      .catch(error => {
        console.log(error);
      });
  }

  findGraphDoc(signature) {
    let requestObject = request({
      url: SEARCH_QUERY_URL,
      method: 'POST',
      crossOrigin: true,
      type: 'json',
      contentType: 'application/json',
      data: JSON.stringify({
        params:{
          q: "signature:\"" + signature + "\""
        }
      })
    });
    return this.handleGraphDocResponse(when(requestObject));
  }

  handleGraphDocResponse(promise) {
    return promise
      .then(response => {
        if (response.response.numFound > 0) {
          let doc = response.response.docs[0];
          StatisticsActions.updateGraphNodes({
            id: doc.signature,
            label: doc.signature,
            title: "Signatur: " + doc.signature + "<br>Landschaftsarchiv: " + doc.landscapeArchive,
            group: doc.landscapeArchive
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
  }
}

export default new SolrService();