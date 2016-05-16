import AppDispatcher from '../dispatchers/AppDispatcher';
import { LIST_ACTIVE_CHANGE, SAVE_FILES_TO_UPLOAD, RENDER_METADATA, UPLOAD_FINISHED } from '../constants/UploadConstants';

export default {
  setListActive: (key) => {
    AppDispatcher.dispatch({
      actionType: LIST_ACTIVE_CHANGE,
      key: key
    });
  },

  saveFiles: (files, metadata) => {
    AppDispatcher.dispatch({
      actionType: SAVE_FILES_TO_UPLOAD,
      files: files,
      metadata: metadata
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