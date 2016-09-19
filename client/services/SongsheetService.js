import request from 'reqwest';
import when from 'when';
import SongsheetActions from '../actions/SongsheetActions';
import {
  LIST_URL,
  ITEM_URL,
  SIMILAR_URL,
  DELETE_URL
} from '../constants/SongsheetConstants';
import SolrService from './SolrService';
import LoginStore from '../stores/LoginStore';

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
        for (var item of response.items) {
          SolrService.findDoc(item.signature);
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

  deleteSongsheet(signature) {
    return this.handleDeleteSongsheetResponse(when(request({
      url: DELETE_URL + signature,
      method: 'DELETE',
      crossOrigin: true,
      headers: {
        'Authorization': 'Bearer ' + LoginStore.jwt
      }
    })));
  }

  handleDeleteSongsheetResponse(promise) {
    return promise
      .then(response => {
        if (response.ok) {
          SongsheetActions.deleteSongsheet(response.signature);
        }
      })
      .catch(error => {
        console.error(error);
      });
  }
}

export default new SongsheetService();