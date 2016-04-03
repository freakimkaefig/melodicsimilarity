import request from 'reqwest';
import when from 'when';
import { QUERY_URL } from '../constants/SolrConstants';
import SolrActions from '../actions/SolrActions';

class SolrService {

  findDoc(id) {
    return this.handleFindResponse(when(request({
      url: QUERY_URL,
      method: 'POST',
      crossOrigin: true,
      type: 'json',
      contentType: 'application/json',
      data: JSON.stringify({
        params:{
          q: "signature:\"" + id + "\""
        }
      })
    })));
  }

  handleFindResponse(findPremise) {
    return findPremise
      .then(function(response) {
        SolrActions.renderResult(response);
        return true;
      });
  }
}

export default new SolrService();