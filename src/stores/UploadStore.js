import BaseStore from './BaseStore';
import _ from 'lodash';
import { LIST_ACTIVE_CHANGE, UPLOAD_IMAGES, UPLOAD_JSONS, RENDER_METADATA, UPLOAD_FINISHED } from '../constants/UploadConstants';

class UploadStore extends BaseStore {

  constructor() {
    super();
    this.subscribe(() => this._registerToActions.bind(this));
    this._listActive = null;
    this._images = [];
    this._jsons = [];
    this._files = [];
    this._responses = [];
  }


  _registerToActions(action) {
    switch (action.actionType) {
      case LIST_ACTIVE_CHANGE:
        this._listActive = action.key;
        this.emitChange();
        break;
        
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

      case RENDER_METADATA:
        var signature = this.extractValue(JSON.parse(action.response.responseHeader.params.json).params.q);
        this._files.find(function(file) {
          return file.content.id == signature;
        }).metadata = action.response.response.docs[0];
        this.emitChange();
        break;

      case UPLOAD_FINISHED:
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

  get images() {
    return this._images;
  }

  get jsons() {
    return this._jsons;
  }
  
  get files() {
    return this._files;
  }

  get responses() {
    return this._responses;
  }

  mergeByProperty(arr1, arr2, prop) {
    _.each(arr2, function (arr2obj) {
      var arr1obj = _.find(arr1, function (arr1obj) {
        return arr1obj[prop] === arr2obj[prop];
      });

      arr1obj ? _.extend(arr1obj, arr2obj) : arr1.push(arr2obj);
    });
  }

  extractValue(str) {
    var ret = "";
    if (/"/.test(str)) {
      ret = str.match(/"(.*?)"/)[1];
    } else {
      ret = str;
    }
    return ret;
  }
}

export default new UploadStore();