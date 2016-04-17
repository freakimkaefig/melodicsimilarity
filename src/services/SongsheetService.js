import request from 'reqwest';
import when from 'when';
import SongsheetActions from '../actions/SongsheetActions';
import { LIST_URL, ITEM_URL } from '../constants/SongsheetConstants';

class SongsheetService {

  loadList() {
    return this.handleListResponse(when(request({
      url: LIST_URL,
      method: 'GET',
      crossOrigin: true
    })));
  }
  
  loadItem(signature) {
    return this.handleItemResponse(when(request({
      url: ITEM_URL + signature,
      method: 'GET',
      crossOrigin: true
    })));
  }

  handleListResponse(listPremise) {
    return listPremise
      .then(function(response) {
        SongsheetActions.renderList(response);
      });
  }
  
  handleItemResponse(itemPremise) {
    return itemPremise
      .then(function(response) {
        SongsheetActions.renderItem(response);
      });
  }
}

export default new SongsheetService();