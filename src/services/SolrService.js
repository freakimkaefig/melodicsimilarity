import request from 'reqwest';
import when from 'when';
import { UPLOAD_CONTEXT } from '../constants/UploadConstants';
import { SONGSHEET_CONTEXT } from '../constants/SongsheetConstants';
import { QUERY_URL } from '../constants/SolrConstants';
import UploadActions from '../actions/UploadActions';
import SongsheetActions from '../actions/SongsheetActions';

class SolrService {

  findDoc(signature, context) {
    let requestObject = request({
      url: QUERY_URL,
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
    
    switch (context) {
      case UPLOAD_CONTEXT:
        return this.handleUploadFindResponse(when(requestObject));
        break;
      case SONGSHEET_CONTEXT:
        return this.handleSongsheetFindResponse(when(requestObject));
        break;
    }

  }

  handleUploadFindResponse(findPremise) {
    return findPremise
      .then(function(response) {
        UploadActions.renderMetadata(response);
        return true;
      });
  }

  handleSongsheetFindResponse(findPremise) {
    return findPremise
      .then(function(response) {
        SongsheetActions.renderMetadata(response);
        return true;
      });
  }
}

export default new SolrService();