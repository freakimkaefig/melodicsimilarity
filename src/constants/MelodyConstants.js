import {APP_URL} from './AppConstants';

export const BASE_URL = APP_URL;
export const SEARCH_PARSON_URL = BASE_URL + 'api/search/parson/';
export const SEARCH_INTERVAL_URL = BASE_URL + 'api/search/interval/';

export const MODES = ['MELODY', 'INTERVALS', 'PARSONS'];

export const NOTE_TYPES = {
  1: '64th',
  2: '32nd',
  4: '16th',
  8: 'eighth',
  16: 'quarter',
  32: 'half',
  64: 'whole'
};
export const ALTER_VALUES = {
  'flat': -1,
  'natural': 0,
  'sharp': 1
};

export const INTERVAL_DEFAULT_ABC = 'X:1\nL:1/4\nM:none\nK:C\nK:treble\nC';
export const MELODY_DEFAULT_ABC = 'X:1\nL:1/64\nM:none\nK:C\nK:treble\n';

export const UPDATE_MODE = 'UPDATE_MODE';
export const UPDATE_THRESHOLD = 'UPDATE_THRESHOLD';
export const UPDATE_PARSON_QUERY = 'UPDATE_PARSON_QUERY';
export const UPDATE_INTERVAL_QUERY = 'UPDATE_INTERVAL_QUERY';
export const UPDATE_MELODY_QUERY = 'UPDATE_MELODY_QUERY';
