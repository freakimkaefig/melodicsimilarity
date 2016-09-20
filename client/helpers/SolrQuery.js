export default class SolrQuery {
  _query;
  _q = [];
  _fq = [];
  _glue = 'OR';

  constructor(url) {
    this._query = url + '?wt=json';
    this._fq.push('signature:*');
  }

  setOperator(operator) {
    this._glue = operator ? 'AND' : 'OR';
  }

  setHighlighting(hl, tag, fragsize, snippets) {
    this._query += '&hl=' + hl;

    if (typeof tag !== 'undefined') {
      this._query += '&hl.simple.pre=<' + tag + '>';
      this._query += '&hl.simple.post=</' + tag + '>';
    }

    if (typeof fragsize !== 'undefined') {
      this._query += '&hl.fragsize=' + fragsize;
    }

    if (typeof snippets !== 'undefined') {
      this._query += '&hl.snippets=' + snippets;
    }
  }

  addQueryString(value) {
    this._q.push(value);
  }

  addQueryField(field, value, exact) {
    if (exact) {
      value = '"' + value + '"';
    }
    var q = field + ':' + value;
    this._q.push(q);
  }

  addDateField(field, value) {
    this._q.push(field + ':' + '[' + value.min + ' TO ' + value.max + ']');
  }

  addFilterField(field, value) {
    this._fq.push(field + ':' + value);
  }

  _getQueryFields() {
    if (this._q.length > 0) {
      return '&q=' + this._q.join(' ' + this._glue + ' ');
    } else {
      return '&q=*';
    }
  }

  _getFilterFields() {
    if (this._fq.length > 0) {
      return '&fq=' + this._fq.join(' ' + this._glue + ' ');
    } else {
      return '';
    }
  }

  isEmpty() {
    return !(this._q.length > 0);
  }

  getQueryUrl() {
    return this._query + this._getQueryFields() + this._getFilterFields();
  }
}
