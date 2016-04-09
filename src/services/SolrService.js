import request from 'reqwest';
import when from 'when';
import { QUERY_URL } from '../constants/SolrConstants';
import UploadActions from '../actions/UploadActions';

class SolrService {

  findDoc(file) {
    let id = file.content.id;
    let name = file.clearname;
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
        UploadActions.renderMetadata(response);
        return true;
      });
  }
}

export default new SolrService();