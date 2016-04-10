import request from 'reqwest';
import when from 'when';
import LoginStore from '../stores/LoginStore';
import UploadActions from '../actions/UploadActions';
import { UPLOAD_URL } from '../constants/UploadConstants';

class UploadService {

  upload(file) {
    return this.handleUploadResponse(when(request({
      url: UPLOAD_URL,
      method: 'POST',
      crossOrigin: true,
      headers: {
        'Authorization': 'Bearer ' + LoginStore.jwt
      },
      data: file
    })));
  }

  handleUploadResponse(uploadPremise) {
    return uploadPremise
      .then(function(response) {
        console.log(response);
        UploadActions.handleUpload(response);
      });
  }
}

export default new UploadService();