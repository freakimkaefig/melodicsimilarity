import AppDispatcher from '../dispatchers/AppDispatcher';
import { UPLOAD_IMAGES, UPLOAD_JSONS } from '../constants/UploadConstants';

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
  }


}