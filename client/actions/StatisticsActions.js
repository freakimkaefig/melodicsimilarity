import AppDispatcher from '../dispatchers/AppDispatcher';
import {
  UPDATE_MELODIC_STATISTIC,
  UPDATE_DATE_STATISTIC,
  UPDATE_GEO_STATISTIC,
  UPDATE_TAG_STATISTIC,
  UPDATE_GRAPH_NODES,
  UPDATE_GRAPH_EDGES
} from '../constants/StatisticsConstants';

export default {
  updateMelodicStatistics: (response) => {
    AppDispatcher.dispatch({
      actionType: UPDATE_MELODIC_STATISTIC,
      response: response
    });
  },
  
  updateDateStatistics: (data) => {
    AppDispatcher.dispatch({
      actionType: UPDATE_DATE_STATISTIC,
      data: data
    });
  },

  updateGeoStatistics: (mode, labels, values) => {
    AppDispatcher.dispatch({
      actionType: UPDATE_GEO_STATISTIC,
      mode: mode,
      labels: labels,
      values: values
    });
  },

  updateTagStatistics: (mode, data) => {
    AppDispatcher.dispatch({
      actionType: UPDATE_TAG_STATISTIC,
      mode: mode,
      data: data
    });
  },

  updateGraphNodes: (node) => {
    AppDispatcher.dispatch({
      actionType: UPDATE_GRAPH_NODES,
      node: node
    });
  },

  updateGraphEdges: (edges, nodeCount) => {
    AppDispatcher.dispatch({
      actionType: UPDATE_GRAPH_EDGES,
      edges: edges,
      nodeCount: nodeCount
    });
  }
}