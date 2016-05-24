import AppDispatcher from '../dispatchers/AppDispatcher';
import { UPDATE_SONGSHEET_START, LOAD_LIST, LOAD_ITEM, RENDER_METADATA } from '../constants/SongsheetConstants';

export default {
  updateStart: (start) => {
    AppDispatcher.dispatch({
      actionType: UPDATE_SONGSHEET_START,
      value: start
    });
  },
  
  renderList: (songsheets, totalCount) => {
    AppDispatcher.dispatch({
      actionType: LOAD_LIST,
      songsheets: songsheets,
      totalCount: totalCount
    });
  },

  renderItem: (songsheet) => {
    AppDispatcher.dispatch({
      actionType: LOAD_ITEM,
      songsheet: songsheet
    });
  },

  renderMetadata: (response) => {
    AppDispatcher.dispatch({
      actionType: RENDER_METADATA,
      response: response
    });
  }
}