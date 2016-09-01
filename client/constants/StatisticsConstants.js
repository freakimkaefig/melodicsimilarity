import {APP_URL} from './AppConstants';

export const BASE_URL = APP_URL;
export const STATISTICS_URL = BASE_URL + 'api/index/';
export const SIMILARITY_URL = BASE_URL + 'api/similarity';

export const UPDATE_MELODIC_STATISTIC = 'UPDATE_MELODIC_STATISTIC';
export const UPDATE_DATE_STATISTIC = 'UPDATE_DATE_STATISTIC';
export const UPDATE_GEO_STATISTIC = 'UPDATE_GEO_STATISTIC';
export const UPDATE_TAG_STATISTIC = 'UPDATE_TAG_STATISTIC';
export const UPDATE_GRAPH_NODES = 'UPDATE_GRAPH_NODES';
export const UPDATE_GRAPH_EDGES = 'UPDATE_GRAPH_EDGES';

export const COLORS = ['#2780E3', '#3FB618', '#9954BB', '#FF7518', '#FF0039'];