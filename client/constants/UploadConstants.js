import {APP_URL} from './AppConstants';

export const BASE_URL = APP_URL;
export const UPLOAD_SONGSHEET_URL = BASE_URL + 'api/protected/songsheet/add';

export const LIST_ACTIVE_CHANGE = 'LIST_ACTIVE_CHANGE';
export const SAVE_FILES_TO_UPLOAD = 'SAVE_FILES_TO_UPLOAD';
export const UPLOAD_FINISHED = 'UPLOAD_FINISHED';
export const UPLOAD_CONTEXT = 'UPLOAD_CONTEXT';