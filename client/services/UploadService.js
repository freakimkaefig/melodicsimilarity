import request from 'reqwest';
import when from 'when';
import LoginStore from '../stores/LoginStore';
import UploadActions from '../actions/UploadActions';
import { UPLOAD_SONGSHEET_URL } from '../constants/UploadConstants';
import ErrorHelper from '../helpers/ErrorHelper';

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

  handleUploadResponse(uploadPromise) {
    return uploadPromise
      .then(response => {
        UploadActions.handleUpload(response);
      })
      .catch(error => {
        ErrorHelper.handleRequestError(error);
      });
  }
}

export default new UploadService();