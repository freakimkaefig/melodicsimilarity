import request from 'reqwest';
import when from 'when';
import { UPLOAD_CONTEXT } from '../constants/UploadConstants';
import { SONGSHEET_CONTEXT } from '../constants/SongsheetConstants';
import { SEARCH_CONTEXT, METADATA_QUERY_URL, SEARCH_QUERY_URL, FIELDS } from '../constants/SolrConstants';
import { ITEM_URL } from '../constants/SongsheetConstants';
import UploadActions from '../actions/UploadActions';
import SongsheetActions from '../actions/SongsheetActions';
import SolrActions from '../actions/SolrActions';
import SolrQuery from '../objects/SolrQuery';

class SolrService {

  findDoc(signature) {
    let requestObject = request({
      url: SEARCH_QUERY_URL,  // TODO: Change to "SEARCH_QUERY_URL"
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

  handleFindResponse(findPremise) {
    return findPremise
      .then(function(response) {
        SolrActions.updateMetadata(response);
        return true;
      });
  }

  getFacets(field) {
    /**
     * TODO: Get facets from solr
     *    e.g. get all values for landscapeArchive:
     *    http://localhost:8983/solr/metaData/select?q=*%3A*&rows=0&wt=json&indent=true&facet=true&facet.field=landscapeArchive
     *    The response has property "facet_counts":
     *      {
     *        facet_queries: { },
     *        facet_fields: {
     *          landscapeArchive: [
     *            "Hessisches Archiv, Hessen", 9987
     *            "Münchner Archiv, Bayern", 3876,
     *            ...
     *          ]
     *        }
     *      }
     */

    let facetsArray = [];
    switch (field) {
      case 'landscapeArchive':
        facetsArray = [
          'Schleswig-Holstein', 500000,
          'Hessisches Archiv, Hessen', 9978,
          'Schlesien / Polen', 1904,
          'Münchner Archiv, Bayern', 1400,
          'Schweizer Archiv, Schweiz', 1300,
          'Badisches Archiv, Baden', 923,
          'Württembergisches Archiv, Württemberg', 800,
          'Kinzigtal, Schwarzwald, Baden', 7,
          'Rheinprovinz, Rheinland', 5,
          'Westfalen, Münsterland', 5,
          'Pfalz', 1,
          'Spessart', 1,
          'Sauerland', 1
        ];
        facetsArray = facetsArray.filter((facet) => {
          return isNaN(parseFloat(facet)) &! isFinite(facet);
        });
        break;

      case 'origin':
        facetsArray = [
          'Deutschsprachiger Raum', 13155
        ];
        facetsArray = facetsArray.filter((facet) => {
          return isNaN(parseFloat(facet)) &! isFinite(facet);
        });
        break;

      case 'type':
        facetsArray = [
          'Kinderlied', 33,
          'Spiellied', 30,
          'Ehestandslied', 9,
          'Hochzeitslied', 9,
          'Brautlied', 2,
          'Drahler', 1,
          'Geleitlied', 1,
          'Kreistanz', 1,
          'Schelmenlieder', 1,
          'Spinnstubenlied', 1,
          'Tanzlied', 1
        ];
        facetsArray = facetsArray.filter((facet) => {
          return isNaN(parseFloat(facet)) &! isFinite(facet);
        });
        break;
    }

    if (facetsArray.length > 0) {
      SolrActions.updateFacets(field, facetsArray);
    }
  }
  
  search(queryFields) {
    console.log(queryFields);
    SolrActions.updateQuery(queryFields);

    let query = new SolrQuery(SEARCH_QUERY_URL);
    query.setHighlighting(true, 'em', 300, 3);
    query.setOperator('OR');
    for (var i = 0; i < queryFields.length; i++) {
      if (queryFields[i].name === 'search') {
        query.addQueryString(queryFields[i].value);
        continue;
      }

      let fieldProperties = FIELDS.find(field => {
        return field.name === queryFields[i].name;
      });

      switch (fieldProperties.input) {
        case 'text':
          query.addQueryField(queryFields[i].name, queryFields[i].value);
          break;

        case 'select':
          query.addFilterField(queryFields[i].name, queryFields[i].value);
          break;
      }
    }

    console.log(query.getQueryUrl());

    let requestObject = request({
      url: query.getQueryUrl(),
      method: 'GET',
      crossOrigin: true
    });

    return this.handleSearchResponse(when(requestObject));
  }

  findSongsheet(signature) {
    return this.handleSearchSongsheetResponse(when(request({
      url: ITEM_URL + signature,
      method: 'GET',
      crossOrigin: true
    })));
  }

  handleSearchResponse(searchPremise) {
    return searchPremise
      .then(function(response) {
        // let docs = response.response.docs.filter(doc => {
        //   return typeof doc.signature !== 'undefined';
        // });
        // console.log(docs);
        let docs = response.response.docs;
        for (var i = 0; i < docs.length; i++) {
          this.findSongsheet(docs[i].signature);
        }
        SolrActions.updateResults(docs, response.highlighting);
      }.bind(this));
  }

  handleSearchSongsheetResponse(searchPremise) {
    return searchPremise
      .then(function(response) {
        SolrActions.updateResultImage(response);
      });
  }
}

export default new SolrService();