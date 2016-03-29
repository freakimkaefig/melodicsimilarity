import AppDispatcher from '../dispatchers/AppDispatcher';
import { QUOTE_GET } from '../constants/QuoteConstants';

export default {
  gotQuote: (quote) => {
    AppDispatcher.dispatch({
      actionType: QUOTE_GET,
      quote: quote
    });
  }
}