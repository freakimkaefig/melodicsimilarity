import request from 'reqwest';
import when from 'when';
import SongsheetActions from '../actions/SongsheetActions';
import {
  LIST_URL,
  ITEM_URL,
  SIMILAR_URL
} from '../constants/SongsheetConstants';
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

  handleListResponse(listPremise) {
    return listPremise
      .then(response => {
        for (var i = 0; i < response.items.length; i++) {
          SolrService.findDoc(response.items[i].signature);
        }
        SongsheetActions.renderList(response.items, response.totalCount);
      });
  }
  
  loadItem(signature) {
    return this.handleItemResponse(when(request({
      url: ITEM_URL + signature,
      method: 'GET',
      crossOrigin: true
    })));
  }
  
  handleItemResponse(itemPremise) {
    return itemPremise
      .then(response => {
        SolrService.findDoc(response.signature);
        SongsheetActions.renderItem(response);
      });
  }

  loadSimilar(signature) {
    return this.handleSimilarResponse(when(request({
      url: SIMILAR_URL + signature,
      method: 'GET',
      crossOrigin: true
    })));
  }

  handleSimilarResponse(similarPremise) {
    return similarPremise
      .then(response => {
        SongsheetActions.updateSimilar(response.distances);
      });
  }

  loadSimilarItem(signature) {
    return this.handleSimilarItemResponse(when(request({
      url: ITEM_URL + signature,
      method: 'GET',
      crossOrigin: true
    })));
  }

  handleSimilarItemResponse(itemPremise) {
    return itemPremise
      .then(response => {
        SolrService.findSimilarDoc(response.signature);
        SongsheetActions.renderSimilarItem(response);
      });
  }
}

export default new SongsheetService();