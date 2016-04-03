import AppDispatcher from '../dispatchers/AppDispatcher';
import { FOUND_DOC } from '../constants/SolrConstants';

export default {
  renderResult: (response) => {
    AppDispatcher.dispatch({
      actionType: FOUND_DOC,
      response: response
    });
  }
}