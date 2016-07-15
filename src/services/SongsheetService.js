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

  handleListResponse(listPromise) {
    return listPromise
      .then(response => {
        for (var i = 0; i < response.items.length; i++) {
          SolrService.findDoc(response.items[i].signature);
        }
        SongsheetActions.renderList(response.items, response.totalCount);
      })
      .catch(error => {
        console.log(error);
      });
  }
  
  loadItem(signature) {
    return this.handleItemResponse(when(request({
      url: ITEM_URL + signature,
      method: 'GET',
      crossOrigin: true
    })));
  }
  
  handleItemResponse(itemPromise) {
    return itemPromise
      .then(response => {
        SolrService.findDoc(response.signature);
        SongsheetActions.renderItem(response);
      })
      .catch(error => {
        console.log(error);
      });
  }

  loadSimilar(signature) {
    return this.handleSimilarResponse(when(request({
      url: SIMILAR_URL + signature,
      method: 'GET',
      crossOrigin: true
    })));
  }

  handleSimilarResponse(similarPromise) {
    return similarPromise
      .then(response => {
        SongsheetActions.updateSimilar(response.distances);
      })
      .catch(error => {
        console.log(error);
      });
  }

  loadSimilarItem(signature) {
    return this.handleSimilarItemResponse(when(request({
      url: ITEM_URL + signature,
      method: 'GET',
      crossOrigin: true
    })));
  }

  handleSimilarItemResponse(itemPromise) {
    return itemPromise
      .then(response => {
        SolrService.findSimilarDoc(response.signature);
        SongsheetActions.renderSimilarItem(response);
      })
      .catch(error => {
        console.log(error);
      });
  }
}

export default new SongsheetService();