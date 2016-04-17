import AppDispatcher from '../dispatchers/AppDispatcher';
import { LOAD_LIST, LOAD_ITEM } from '../constants/SongsheetConstants';

export default {
  renderList: (songsheets) => {
    AppDispatcher.dispatch({
      actionType: LOAD_LIST,
      songsheets: songsheets
    });
  },

  renderItem: (songsheet) => {
    AppDispatcher.dispatch({
      actionType: LOAD_ITEM,
      songsheet: songsheet
    });
  }
}