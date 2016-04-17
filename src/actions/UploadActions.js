import AppDispatcher from '../dispatchers/AppDispatcher';
import { UPLOAD_IMAGES, UPLOAD_JSONS, RENDER_METADATA, UPLOAD_FINISHED } from '../constants/UploadConstants';

export default {
  saveImageFiles: (files) => {
    AppDispatcher.dispatch({
      actionType: UPLOAD_IMAGES,
      files: files
    });
  },

  saveJsonFiles: (files) => {
    AppDispatcher.dispatch({
      actionType: UPLOAD_JSONS,
      files: files
    });
  },

  renderMetadata: (response) => {
    AppDispatcher.dispatch({
      actionType: RENDER_METADATA,
      response: response
    });
  },
  
  handleUpload: (response) => {
    AppDispatcher.dispatch({
      actionType: UPLOAD_FINISHED,
      response: response
    });
  }

}