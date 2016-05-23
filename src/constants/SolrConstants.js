export const BASE_URL = 'http://localhost:8983/';
export const SEARCH_QUERY_URL = BASE_URL + 'solr/searchableDocs/query';
export const METADATA_QUERY_URL = BASE_URL + 'solr/metaData/query';

export const METADATA_IMAGE_BASE_URL = 'http://localhost:3000/api/image/';
export const METADATA_PLACEHOLDER_IMAGE = 'placeholder.jpg';
export const METADATA_PLACEHOLDER_TITLE = 'Kein Incipit vorhanden';
export const METADATA_PLACEHOLDER_TEXT = 'Kein Liedtext vorhanden';

export const UPDATE_METADATA = 'UPDATE_METADATA';
export const UPDATE_FACETS = 'UPDATE_FACETS';
export const UPDATE_QUERY = 'UPDATE_QUERY';
export const UPDATE_RESULTS = 'UPDATE_RESULTS';
export const UPDATE_RESULT_IMAGE = 'UPDATE_RESULT_IMAGE';

export const FIELDS = [
  {
    "sort": 1,
    "group": "main",
    "name": "signature",
    "display": "Signatur",
    "input": "text",
    "facet": true,
    "exact": true
  },
  {
    "sort": 2,
    "group": "main",
    "name": "title",
    "display": "Titel",
    "input": "text",
    "facet": true,
    "exact": false
  },

  {
    "sort": 10,
    "group": "geographic",
    "name": "origin",
    "display": "Herkunft",
    "input": "text",
    "facet": true,
    "exact": false
  },
  {
    "sort": 11,
    "group": "geographic",
    "name": "landscapeArchive",
    "display": "Landschaftsarchiv",
    "input": "text",
    "facet": true,
    "exact": false
  },
  {
    "sort": 12,
    "group": "geographic",
    "name": "archive",
    "display": "Archivort",
    "input": "text",
    "facet": true,
    "exact": false
  },
  {
    "sort": 13,
    "group": "geographic",
    "name": "singPlace",
    "display": "Sangesort",
    "input": "text",
    "facet": true,
    "exact": false
  },

  {
    "sort": 20,
    "group": "persona",
    "name": "singer",
    "display": "Sänger/in",
    "input": "text",
    "facet": false,
    "exact": false
  },
  {
    "sort": 21,
    "group": "persona",
    "name": "recorder",
    "display": "Aufzeichner",
    "input": "text",
    "facet": true,
    "exact": false
  },

  {
    "sort": 30,
    "group": "temporal",
    "name": "dateFindAid",
    "display": "Dat. Findbuch",
    "input": "date",
    "facet": false,
    "exact": false
  },
  {
    "sort": 31,
    "group": "temporal",
    "name": "receivedOn",
    "display": "Erhalten am",
    "input": "date",
    "facet": false,
    "exact": false
  },
  {
    "sort": 32,
    "group": "temporal",
    "name": "sungOn",
    "display": "Gesungen am",
    "input": "date",
    "facet": false,
    "exact": false
  },
  {
    "sort": 33,
    "group": "temporal",
    "name": "recordedOn",
    "display": "Aufgezeichnet am",
    "input": "date",
    "facet": false,
    "exact": false
  },
  {
    "sort": 34,
    "group": "hidden",
    "name": "submittedOn",
    "display": "Eingesandt am",
    "input": "date",
    "facet": false,
    "exact": false
  },

  {
    "sort": 40,
    "group": "advanced",
    "name": "oldSignature",
    "display": "Altsignatur",
    "input": "text",
    "facet": false,
    "exact": false
  },
  {
    "sort": 41,
    "group": "advanced",
    "name": "type",
    "display": "Liedgattung",
    "input": "text",
    "facet": true,
    "exact": false
  },

  {
    "sort": 50,
    "group": "hidden",
    "name": "missingCause",
    "display": "Fehlt, weil",
    "input": "text",
    "facet": false,
    "exact": false
  },
  {
    "sort": 51,
    "group": "hidden",
    "name": "includes",
    "display": "Umfasst",
    "input": "text",
    "facet": false,
    "exact": false
  },
  {
    "sort": 52,
    "group": "hidden",
    "name": "incipit",
    "display": "Incipit",
    "input": "text",
    "facet": false,
    "exact": false
  },
  {
    "sort": 53,
    "group": "hidden",
    "name": "numberOfPages",
    "display": "Blattzahl",
    "input": "text",
    "facet": false,
    "exact": true
  },
  {
    "sort": 54,
    "group": "hidden",
    "name": "remark",
    "display": "Bemerkung",
    "input": "text",
    "facet": false,
    "exact": false
  },
  {
    "sort": 55,
    "group": "hidden",
    "name": "publication",
    "display": "Veröffentlichung",
    "input": "text",
    "facet": false,
    "exact": false
  },
  {
    "sort": 56,
    "group": "hidden",
    "name": "reference",
    "display": "Verweis",
    "input": "text",
    "facet": false,
    "exact": false
  },
  {
    "sort": 57,
    "group": "hidden",
    "name": "handwrittenSource",
    "display": "Quelle",
    "input": "text",
    "facet": false,
    "exact": false
  },
  {
    "sort": 58,
    "group": "hidden",
    "name": "versionNumber",
    "display": "Versionsnummer",
    "input": "text",
    "facet": false,
    "exact": true
  }
];
