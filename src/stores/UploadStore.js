import BaseStore from './BaseStore';
import ArrayHelper from '../helpers/ArrayHelper';
import { LIST_ACTIVE_CHANGE, SAVE_FILES_TO_UPLOAD, UPLOAD_FINISHED } from '../constants/UploadConstants';
import { UPDATE_METADATA } from '../constants/SolrConstants';

class UploadStore extends BaseStore {

  constructor() {
    super();
    this.subscribe(() => this._registerToActions.bind(this));
    this._listActive = null;
    this._files = [];
    this._metadata = [];
    this._responses = [];
  }


  _registerToActions(action) {
    switch (action.actionType) {
      case LIST_ACTIVE_CHANGE:
        this._listActive = action.key;
        this.emitChange();
        break;

      case SAVE_FILES_TO_UPLOAD:
        let uploadFiles = action.files.map(function (file) {
          file.store = true;
          return file;
        });
        this._files = uploadFiles;
        this._metadata = action.metadata;
        this.emitChange();
        break;

      case UPDATE_METADATA:
        if (action.response.response.numFound > 0) {
          ArrayHelper.mergeByProperty(this._metadata, action.response.response.docs, 'signature');
          this.emitChange();
        }
        break;

      case UPLOAD_FINISHED:
        console.log(action.response);
        this._files = [];
        this._responses.push(action.response);
        this.emitChange();
        break;

      default:
        break;
    }
  }

  get listActive() {
    return this._listActive;
  }
  
  get files() {
    return this._files;
  }

  get metadata() {
    return this._metadata;
  }

  get responses() {
    return this._responses;
  }
}

export default new UploadStore();