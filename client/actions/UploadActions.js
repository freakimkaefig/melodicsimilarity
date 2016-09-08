import AppDispatcher from '../dispatchers/AppDispatcher';
import { LIST_ACTIVE_CHANGE, SAVE_FILES_TO_UPLOAD, UPLOAD_FINISHED } from '../constants/UploadConstants';

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
  
  handleUpload: (response) => {
    AppDispatcher.dispatch({
      actionType: UPLOAD_FINISHED,
      response: response
    });
  }

}