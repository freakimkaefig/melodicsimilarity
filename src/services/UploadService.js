import request from 'reqwest';
import when from 'when';
import LoginStore from '../stores/LoginStore';
import UploadActions from '../actions/UploadActions';
import { UPLOAD_SONGSHEET_URL, UPLOAD_SCAN_URL } from '../constants/UploadConstants';

class UploadService {

  upload(file) {
    if (typeof file.image !== 'undefined') {
      this.uploadScan(file);
    } else {
      this.uploadSongsheet(file);
    }

  }
  
  uploadScan(file) {
    return this.handleUploadScanResponse(when(request({
      url: UPLOAD_SCAN_URL,
      method: 'POST',
      crossOrigin: true,
      headers: {
        'Authorization': 'Bearer ' + LoginStore.jwt
      },
      data: file
    })));
  }
  
  handleUploadScanResponse(uploadPremise) {
    return uploadPremise
      .then(function(response) {
        var file = response.file;
        file.image = response.response.Location;
        this.uploadSongsheet(file);
      }.bind(this));
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