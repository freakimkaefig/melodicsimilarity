import BaseStore from './BaseStore';
import _ from 'lodash';
import { UPLOAD_IMAGES, UPLOAD_JSONS } from '../constants/UploadConstants';

class UploadStore extends BaseStore {

  constructor() {
    super();
    this.subscribe(() => this._registerToActions.bind(this));
    this._images = [];
    this._jsons = [];
    this._files = [];
  }

  _registerToActions(action) {
    switch (action.actionType) {
      case UPLOAD_IMAGES:
        var files = action.files.map(function (file) {
          file.store = true;
          return file;
        });
        this.mergeByProperty(this._images, files, 'clearName');
        this.mergeByProperty(this._files, files, 'clearName');
        this.emitChange();
        break;
      case UPLOAD_JSONS:
        var files = action.files.map(function (file) {
          file.store = true;
          return file;
        });
        this.mergeByProperty(this._jsons, files, 'clearName');
        this.mergeByProperty(this._files, files, 'clearName');
        this.emitChange();
        break;
      default:
        break;
    }
  }

  get images() {
    return this._images;
  }

  get jsons() {
    return this._jsons;
  }
  
  get files() {
    return this._files;
  }

  mergeByProperty(arr1, arr2, prop) {
    _.each(arr2, function (arr2obj) {
      var arr1obj = _.find(arr1, function (arr1obj) {
        return arr1obj[prop] === arr2obj[prop];
      });

      arr1obj ? _.extend(arr1obj, arr2obj) : arr1.push(arr2obj);
    });
  }
}

export default new UploadStore();