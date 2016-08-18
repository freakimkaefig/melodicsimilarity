import _ from 'lodash';

class ArrayHelper {
  mergeByProperty(arr1, arr2, prop) {
    _.each(arr2, function (arr2obj) {
      var arr1obj = _.find(arr1, function (arr1obj) {
        return arr1obj[prop] === arr2obj[prop];
      });

      arr1obj ? _.extend(arr1obj, arr2obj) : arr1.push(arr2obj);
    });
  }

  arrayIntersect(arr1, arr2, prop) {
    return _.intersectionBy(arr1, arr2, prop);
  }

  arrayDiff(arr1, arr2, prop) {
    return _.differenceBy(arr1, arr2, prop);
  }

  arrayMerge(arr1, arr2, prop) {
    return _.unionBy(arr1, arr2, prop);
  }

}

export default new ArrayHelper();