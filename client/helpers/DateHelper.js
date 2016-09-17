import moment from 'moment';

class DateHelper {
  // German locale "DD.MM.YYYY"
  isGermanLocaleDate(string) {
    return this._parseGermanLocale(string).isValid();
  }
  getGermanLocaleYear(string) {
    return this._parseGermanLocale(string).year();
  }
  _parseGermanLocale(string) {
    return moment(string, 'DD.MM.YYYY', true);
  }

  // English locale "YYYY-MM-DD"
  isEnglishLocalDate(string) {
    return this._parseEnglishLocale(string).isValid();
  }
  getEnglishLocaleYear(string) {
    return this._parseEnglishLocale(string).year();
  }
  _parseEnglishLocale(string) {
    return moment(string, 'YYYY-MM-DD', true);
  }

  // 4 decimal year
  isYear(string) {
    return this._parseYear(string).isValid();
  }
  getYear(string) {
    return this._parseYear(string).year();
  }
  _parseYear(string) {
    return moment(string, 'YYYY', true);
  }

  hasValidYear(string) {
    return this.isYear(string) || this.isGermanLocaleDate(string) || this.isEnglishLocalDate(string);
  }

  getDefaultMinYear() {
    return 1500;
  }
  getDefaultMaxYear() {
    return moment().year();
  }

  extractYear(string) {
    if (this.isYear(string)) {
      return this.getYear(string);
    } else if(this.isGermanLocaleDate(string)) {
      return this.getGermanLocaleYear(string);
    } else if (this.isEnglishLocalDate(string)) {
      return this.getEnglishLocaleYear(string);
    } else {
      return false;
    }
  }
}

export default new DateHelper();