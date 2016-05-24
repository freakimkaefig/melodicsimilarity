import request from 'reqwest';
import when from 'when';
import SongsheetActions from '../actions/SongsheetActions';
import { LIST_URL, ITEM_URL } from '../constants/SongsheetConstants';
import SolrService from './SolrService';

class SongsheetService {

  loadList(start, rows) {
    SongsheetActions.updateStart(start);

    return this.handleListResponse(when(request({
      url: LIST_URL,
      method: 'GET',
      crossOrigin: true,
      data: {
        start: start,
        rows: rows
      }
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
        for (var i = 0; i < response.items.length; i++) {
          SolrService.findDoc(response.items[i].signature);
        }
        SongsheetActions.renderList(response.items, response.totalCount);
      });
  }
  
  handleItemResponse(itemPremise) {
    return itemPremise
      .then(function(response) {
        SolrService.findDoc(response.signature);
        SongsheetActions.renderItem(response);
      });
  }
}

export default new SongsheetService();