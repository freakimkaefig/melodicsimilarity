import request from 'reqwest';
import when from 'when';
import LoginStore from '../stores/LoginStore';
import UploadActions from '../actions/UploadActions';
import { UPLOAD_SONGSHEET_URL } from '../constants/UploadConstants';

class UploadService {

  upload(file) {
    console.log("Upload", file);
    this.uploadSongsheet(file);
  }

  uploadSongsheet(file) {
    return this.handleUploadResponse(when(request({
      url: UPLOAD_SONGSHEET_URL,
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
        UploadActions.handleUpload(response);
      });
  }
}

export default new UploadService();