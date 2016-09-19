import BaseStore from './BaseStore';
import ArrayHelper from '../helpers/ArrayHelper';
import {
  UPDATE_SONGSHEET_START,
  LOAD_LIST,
  LOAD_ITEM,
  UPDATE_SIMILAR,
  DELETE_SONGSHEET
} from '../constants/SongsheetConstants';
import {
  UPDATE_METADATA,
  METADATA_PLACEHOLDER_IMAGE,
  METADATA_PLACEHOLDER_TITLE,
  METADATA_PLACEHOLDER_TEXT,
} from '../constants/SolrConstants';
import SongsheetService from '../services/SongsheetService';

class SongsheetStore extends BaseStore {

  constructor() {
    super();
    this.subscribe(() => this._registerToActions.bind(this));
    this._start = 0;
    this._totalCount = 0;
    this._songsheets = [];
    this._similarityScores = [];
  }


  _registerToActions(action) {
    switch (action.actionType) {
      case UPDATE_SONGSHEET_START:
        this._start = action.value;
        this.emitChange();
        break;

      case LOAD_LIST:
        ArrayHelper.mergeByProperty(this._songsheets, action.songsheets, 'signature');
        this._totalCount = action.totalCount;
        for (var i = 0; i < this._songsheets.length; i++) {
          let tempMetadata = {
            signature: this._songsheets[i].signature,
            title: METADATA_PLACEHOLDER_TITLE,
            imagename: METADATA_PLACEHOLDER_IMAGE,
            text: METADATA_PLACEHOLDER_TEXT
          };
          ArrayHelper.mergeByProperty(this._songsheets, [tempMetadata], 'signature');
        }
        this.emitChange();
        break;

      case LOAD_ITEM:
        ArrayHelper.mergeByProperty(this._songsheets, [action.songsheet], 'signature');
        let tempMetadata = {
          signature: action.songsheet.signature,
          title: METADATA_PLACEHOLDER_TITLE,
          imagename: METADATA_PLACEHOLDER_IMAGE,
          text: METADATA_PLACEHOLDER_TEXT
        };
        ArrayHelper.mergeByProperty(this._songsheets, [tempMetadata], 'signature');
        this.emitChange();
        break;

      case UPDATE_METADATA:
        if (action.response.response.numFound > 0) {
          ArrayHelper.mergeByProperty(this._songsheets, action.response.response.docs, 'signature');
          this.emitChange();
        }
        break;

      case UPDATE_SIMILAR:
        this._similarityScores = action.similar;
        let diff = ArrayHelper.differenceByProperty(this._songsheets, action.similar, 'signature');
        diff.forEach(item => {
          SongsheetService.loadItem(item.signature);
        });
        this.emitChange();
        break;

      case DELETE_SONGSHEET:
        this._songsheets = this._songsheets.filter(item => {
          return item.signature !== action.signature;
        });
        this._totalCount = this._songsheets.length;
        this.emitChange();
        break;
    }
  }

  get start() {
    return this._start;
  }

  get totalCount() {
    return this._totalCount;
  }

  get songsheets() {
    return this._songsheets;
  }

  get similarityScores() {
    return this._similarityScores;
  }
}

export default new SongsheetStore();