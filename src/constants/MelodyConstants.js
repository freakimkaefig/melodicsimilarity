import {APP_URL} from './AppConstants';

export const BASE_URL = APP_URL;
export const SEARCH_PARSON_URL = BASE_URL + 'api/search/parson/';
export const SEARCH_INTERVAL_URL = BASE_URL + 'api/search/interval/';

export const MODES = ['MELODY', 'INTERVALS', 'PARSONS'];

export const UPDATE_MODE = 'UPDATE_MODE';
export const UPDATE_THRESHOLD = 'UPDATE_THRESHOLD';
export const UPDATE_PARSON_QUERY = 'UPDATE_PARSON_QUERY';
export const UPDATE_INTERVAL_QUERY = 'UPDATE_INTERVAL_QUERY';
export const UPDATE_MELODY_QUERY = 'UPDATE_MELODY_QUERY';
