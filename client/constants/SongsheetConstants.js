import {APP_URL} from './AppConstants';

export const BASE_URL = APP_URL;
export const LIST_URL = BASE_URL + 'api/songsheets';
export const ITEM_URL = BASE_URL + 'api/songsheets/';
export const SIMILAR_URL = BASE_URL + 'api/similarity/';
export const DELETE_URL = BASE_URL + 'api/protected/songsheet/delete/';
export const ROWS = 12;
export const UPDATE_SONGSHEET_START = 'UPDATE_SONGSHEET_START';
export const LOAD_LIST = 'LOAD_LIST';
export const LOAD_ITEM = 'LOAD_ITEM';
export const UPDATE_SIMILAR = 'UPDATE_SIMILAR';
export const DELETE_SONGSHEET = 'DELETE_SONGSHEET';
export const IMAGE_WIDTH = 2743;
export const IMAGE_HEIGHT = 3440;
export const THUMBNAIL_PREFIX = 'thumbnail.';
export const DOWNLOAD_PATH = '/api/songsheets/download/';