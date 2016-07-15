import request from 'reqwest';
import when from 'when';
import SearchActions from '../actions/SearchActions';
import {SEARCH_URL} from '../constants/SearchConstants';

class SearchService {

  search(solrQuery, melodyMode, melodyQuery) {
    SearchActions.startSearch();
    console.log(solrQuery, melodyMode, melodyQuery);
    let requestObject = request({
      url: SEARCH_URL,
      method: 'POST',
      crossOrigin: true,
      type: 'json',
      contentType: 'application/json',
      data: JSON.stringify({
        solrQuery: solrQuery,
        melodyMode: melodyMode,
        melodyQuery: melodyQuery
      })
    });

    return this.handleSearchResponse(when(requestObject));
  }

  handleSearchResponse(searchPromise) {
    return searchPromise
      .then(response => {
        console.log(response);
        SearchActions.updateResults(response);
      })
      .catch(error => {
        console.log(error);
      });
  }

}

export default new SearchService();