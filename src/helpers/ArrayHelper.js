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
}

export default new ArrayHelper();