import BaseStore from './BaseStore';
import ArrayHelper from '../helpers/ArrayHelper';
import {
  UPDATE_SONGSHEET_START,
  LOAD_LIST,
  LOAD_ITEM,
  UPDATE_SIMILAR,
  LOAD_SIMILAR_ITEM
} from '../constants/SongsheetConstants';
import {
  UPDATE_METADATA,
  METADATA_PLACEHOLDER_IMAGE,
  METADATA_PLACEHOLDER_TITLE,
  METADATA_PLACEHOLDER_TEXT,
  UPDATE_SIMILAR_METADATA
} from '../constants/SolrConstants';
import SongsheetService from '../services/SongsheetService';

class SongsheetStore extends BaseStore {

  constructor() {
    super();
    this.subscribe(() => this._registerToActions.bind(this));
    this._start = 0;
    this._totalCount = 0;
    this._songsheets = [];
    this._metadata = [];
    this._songsheet = {};
    this._similarityScores = [];
    this._similarSongsheets = [];
    this._similarMetadata = [];
  }


  _registerToActions(action) {
    switch (action.actionType) {
      case UPDATE_SONGSHEET_START:
        this._start = action.value;
        this.emitChange();
        break;

      case LOAD_LIST:
        this._songsheets = action.songsheets;
        this._totalCount = action.totalCount;
        for (var i = 0; i < this._songsheets.length; i++) {
          let tempMetadata = {
            signature: this._songsheets[i].signature,
            title: METADATA_PLACEHOLDER_TITLE,
            imagename: METADATA_PLACEHOLDER_IMAGE,
            text: METADATA_PLACEHOLDER_TEXT
          };
          ArrayHelper.mergeByProperty(this._metadata, [tempMetadata], 'signature');
        }
        this.emitChange();
        break;

      case LOAD_ITEM:
        this._songsheets.push(action.songsheet);
        this._songsheet = action.songsheet;
        this.emitChange();
        break;

      case UPDATE_METADATA:
        if (action.response.response.numFound > 0) {
          ArrayHelper.mergeByProperty(this._metadata, action.response.response.docs, 'signature');
          this.emitChange();
        }
        break;

      case UPDATE_SIMILAR:
        let similar = action.similar;
        this._similarityScores = similar;
        let diff = ArrayHelper.arrayDiff(similar, [this._songsheet], 'signature');
        diff.forEach(item => {
          SongsheetService.loadSimilarItem(item.signature);
        });
        this.emitChange();
        break;

      case LOAD_SIMILAR_ITEM:
        ArrayHelper.mergeByProperty(this._similarSongsheets, [action.songsheet], 'signature');
        this.emitChange();
        break;

      case UPDATE_SIMILAR_METADATA:
        ArrayHelper.mergeByProperty(this._similarMetadata, [action.response.response.docs[0]], 'signature');
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

  get metadata() {
    return this._metadata;
  }

  get songsheet() {
    return this._songsheet;
  }

  get similarityScores() {
    return this._similarityScores;
  }

  get similarSongsheets() {
    return this._similarSongsheets;
  }

  get similarMetadata() {
    return this._similarMetadata;
  }
}

export default new SongsheetStore();