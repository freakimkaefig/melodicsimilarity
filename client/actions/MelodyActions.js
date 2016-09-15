import AppDispatcher from '../dispatchers/AppDispatcher';
import {
  UPDATE_MODE,
  UPDATE_PARSON_QUERY,
  UPDATE_INTERVAL_QUERY,
  UPDATE_MELODY_QUERY,
  UPDATE_THRESHOLD
} from '../constants/MelodyConstants';

export default {
  updateMode: (mode) => {
    AppDispatcher.dispatch({
      actionType: UPDATE_MODE,
      mode: mode
    });
  },

  updateThreshold: (threshold) => {
    AppDispatcher.dispatch({
      actionType: UPDATE_THRESHOLD,
      threshold: threshold
    });
  },

  updateParsonQuery: (parson) => {
    AppDispatcher.dispatch({
      actionType: UPDATE_PARSON_QUERY,
      parson: parson
    });
  },

  updateIntervalQuery: (intervals, abc) => {
    AppDispatcher.dispatch({
      actionType: UPDATE_INTERVAL_QUERY,
      intervals: intervals,
      abc: abc
    });
  },

  updateMelodyQuery: (melody, abc) => {
    AppDispatcher.dispatch({
      actionType: UPDATE_MELODY_QUERY,
      melody: melody,
      abc: abc
    });
  }
}