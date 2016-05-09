import {APP_URL} from './AppConstants';

export const BASE_URL = APP_URL;
export const UPLOAD_SONGSHEET_URL = BASE_URL + 'api/protected/songsheet/add';
export const UPLOAD_SCAN_URL = BASE_URL + 'api/protected/scan/add';
export const LIST_ACTIVE_CHANGE = 'LIST_ACTIVE_CHANGE';
export const UPLOAD_IMAGES = 'UPLOAD_IMAGES';
export const UPLOAD_JSONS = 'UPLOAD_JSONS';
export const RENDER_METADATA = 'UPLOAD_RENDER_METADATA';
export const UPLOAD_FINISHED = 'UPLOAD_FINISHED';
export const UPLOAD_CONTEXT = 'UPLOAD_CONTEXT';