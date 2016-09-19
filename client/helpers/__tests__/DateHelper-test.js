import moment from 'moment';
import DateHelper from '../DateHelper';

describe('DateHelper', () => {

  var result;

  it('should detect german locale date string', () => {
    result = DateHelper.isGermanLocaleDate('1970-01-01');
    expect(result).toBe(false);

    result = DateHelper.isGermanLocaleDate('01.01.1970');
    expect(result).toBe(true);
  });

  it('should extract year from german locale date string', () => {
    result = DateHelper.getGermanLocaleYear('01.01.1970');
    expect(result).toBe(1970);
  });

  it('should detect english locale date string', () => {
    result = DateHelper.isEnglishLocalDate('01.01.1970');
    expect(result).toBe(false);

    result = DateHelper.isEnglishLocalDate('1970-01-01');
    expect(result).toBe(true);
  });

  it('should extract year from english locale date string', () => {
    result = DateHelper.getEnglishLocaleYear('1970-01-01');
    expect(result).toBe(1970);
  });

  it('should detect year', () => {
    result = DateHelper.isYear('10');
    expect(result).toBe(false);

    result = DateHelper.isYear('1970');
    expect(result).toBe(true);
  });

  it('should return year', () => {
    result = DateHelper.getYear('1970');
    expect(result).toBe(1970);
  });

  it('should detect valid year', () => {
    result = DateHelper.hasValidYear('1. Januar 1970');
    expect(result).toBe(false);

    result = DateHelper.hasValidYear('1970');
    expect(result).toBe(true);

    result = DateHelper.hasValidYear('01.01.1970');
    expect(result).toBe(true);

    result = DateHelper.hasValidYear('1970-01-01');
    expect(result).toBe(true);
  });

  it('should return default min year', () => {
    result = DateHelper.getDefaultMinYear();
    expect(result).toBe(1500);
  });

  it('should return default max year', () => {
    result = DateHelper.getDefaultMaxYear();
    expect(result).toBe(moment().year());
  });

  it('should extract year from string', () => {
    result = DateHelper.extractYear('1. Januar 1970');
    expect(result).toBe(false);

    result = DateHelper.extractYear('1970');
    expect(result).toBe(1970);

    result = DateHelper.extractYear('01.01.1970');
    expect(result).toBe(1970);

    result = DateHelper.extractYear('1970-01-01');
    expect(result).toBe(1970);
  });

});