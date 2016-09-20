import SolrQuery from '../SolrQuery';

describe('SolrQuery', () => {

  var query;

  beforeEach(() => {
    query = new SolrQuery('http://localhost:3000/query');
  });

  it('should initialize with mandatory options', () => {
    expect(query.getQueryUrl()).toBe('http://localhost:3000/query?wt=json&q=*&fq=signature:*');
  });

  it('should update operator', () => {
    expect(query._glue).toBe('OR');
    query.setOperator(true);
    expect(query._glue).toBe('AND');
    query.setOperator(false);
    expect(query._glue).toBe('OR');
  });

  it('should update highlight options', () => {
    query.setHighlighting(true);
    expect(query.getQueryUrl()).toBe('http://localhost:3000/query?wt=json&hl=true&q=*&fq=signature:*');
    query = new SolrQuery('http://localhost:3000/query');
    query.setHighlighting(true, 'em', 300, 3);
    expect(query.getQueryUrl()).toBe('http://localhost:3000/query?wt=json&hl=true&hl.simple.pre=<em>&hl.simple.post=</em>&hl.fragsize=300&hl.snippets=3&q=*&fq=signature:*');
  });

  it('should add query string', () => {
    query.addQueryString('test');
    expect(query.getQueryUrl()).toBe('http://localhost:3000/query?wt=json&q=test&fq=signature:*');
  });

  it('should add query field', () => {
    query.addQueryField('key', 'value', false);
    expect(query.getQueryUrl()).toBe('http://localhost:3000/query?wt=json&q=key:value&fq=signature:*');
    query = new SolrQuery('http://localhost:3000/query');
    query.addQueryField('key', 'value', true);
    expect(query.getQueryUrl()).toBe('http://localhost:3000/query?wt=json&q=key:"value"&fq=signature:*');
  });

  it('should add date field', () => {
    query.addDateField('key', {min: 0, max: 1});
    expect(query.getQueryUrl()).toBe('http://localhost:3000/query?wt=json&q=key:[0 TO 1]&fq=signature:*');
  });

  it('should add filter field', () => {
    query._fq = [];
    expect(query.getQueryUrl()).toBe('http://localhost:3000/query?wt=json&q=*');
    query = new SolrQuery('http://localhost:3000/query');
    query.addFilterField('key', 'value');
    expect(query.getQueryUrl()).toBe('http://localhost:3000/query?wt=json&q=*&fq=signature:* OR key:value');
  });

  it('should check if query is empty', () => {
    expect(query.isEmpty()).toBe(true);
    query.addQueryString('test');
    expect(query.isEmpty()).toBe(false);
  });

});