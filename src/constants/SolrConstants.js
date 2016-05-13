export const BASE_URL = 'http://localhost:8983/';
export const QUERY_URL = BASE_URL + 'solr/searchableDocs/query';
export const SELECT_URL = BASE_URL + 'solr/searchableDocs/select';
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
    "input": "text"
  },
  {
    "sort": 2,
    "group": "main",
    "name": "title",
    "display": "Titel",
    "input": "text"
  },

  {
    "sort": 10,
    "group": "geographic",
    "name": "origin",
    "display": "Herkunft",
    "input": "select"
  },
  {
    "sort": 11,
    "group": "geographic",
    "name": "landscapeArchive",
    "display": "Landschaftsarchiv",
    "input": "select"
  },
  {
    "sort": 12,
    "group": "geographic",
    "name": "archive",
    "display": "Archivort",
    "input": "text"
  },
  {
    "sort": 13,
    "group": "geographic",
    "name": "singPlace",
    "display": "Sangesort",
    "input": "text"
  },

  {
    "sort": 20,
    "group": "persona",
    "name": "singer",
    "display": "Sänger/in",
    "input": "text"
  },
  {
    "sort": 21,
    "group": "persona",
    "name": "recorder",
    "display": "Aufzeichner",
    "input": "text"
  },

  {
    "sort": 30,
    "group": "temporal",
    "name": "dateFindAid",
    "display": "Dat. Findbuch",
    "input": "date"
  },
  {
    "sort": 31,
    "group": "temporal",
    "name": "receivedOn",
    "display": "Erhalten am",
    "input": "date"
  },
  {
    "sort": 32,
    "group": "temporal",
    "name": "sungOn",
    "display": "Gesungen am",
    "input": "date"
  },
  {
    "sort": 33,
    "group": "temporal",
    "name": "recordedOn",
    "display": "Aufgezeichnet am",
    "input": "date"
  },
  {
    "sort": 34,
    "group": "hidden",
    "name": "submittedOn",
    "display": "Eingesandt am",
    "input": "date"
  },

  {
    "sort": 40,
    "group": "advanced",
    "name": "oldSignature",
    "display": "Altsignatur",
    "input": "text"
  },
  {
    "sort": 41,
    "group": "advanced",
    "name": "type",
    "display": "Liedgattung",
    "input": "select"
  },

  {
    "sort": 50,
    "group": "hidden",
    "name": "missingCause",
    "display": "Fehlt, weil",
    "input": "text"
  },
  {
    "sort": 51,
    "group": "hidden",
    "name": "includes",
    "display": "Umfasst",
    "input": "text"
  },
  {
    "sort": 52,
    "group": "hidden",
    "name": "incipit",
    "display": "Incipit",
    "input": "text"
  },
  {
    "sort": 53,
    "group": "hidden",
    "name": "numberOfPages",
    "display": "Blattzahl",
    "input": "text"
  },
  {
    "sort": 54,
    "group": "hidden",
    "name": "remark",
    "display": "Bemerkung",
    "input": "text"
  },
  {
    "sort": 55,
    "group": "hidden",
    "name": "publication",
    "display": "Veröffentlichung",
    "input": "text"
  },
  {
    "sort": 56,
    "group": "hidden",
    "name": "reference",
    "display": "Verweis",
    "input": "text"
  },
  {
    "sort": 57,
    "group": "hidden",
    "name": "handwrittenSource",
    "display": "Quelle",
    "input": "text"
  },
  {
    "sort": 58,
    "group": "hidden",
    "name": "versionNumber",
    "display": "Versionsnummer",
    "input": "text"
  }
];
