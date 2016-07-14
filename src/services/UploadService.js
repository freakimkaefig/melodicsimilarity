import request from 'reqwest';
import when from 'when';
import LoginStore from '../stores/LoginStore';
import UploadActions from '../actions/UploadActions';
import { UPLOAD_SONGSHEET_URL } from '../constants/UploadConstants';

class UploadService {

  upload(file) {
    this.uploadSongsheet(file);
  }

  uploadSongsheet(file) {
    console.log(file);
    let requestObject = request({
      url: UPLOAD_SONGSHEET_URL,
      method: 'PUT',
      crossOrigin: true,
      contentType: 'application/json',
      headers: {
        'Authorization': 'Bearer ' + LoginStore.jwt
      },
      data: JSON.stringify(file)
    });

    return this.handleUploadResponse(when(requestObject));
  }

  handleUploadResponse(uploadPremise) {
    return uploadPremise
      .then(response => {
        UploadActions.handleUpload(response);
      });
  }
}

export default new UploadService();