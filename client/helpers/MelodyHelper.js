import MusicjsonToolbox from 'musicjson-toolbox';

class MelodyHelper {
  mergeByProperty(arr1, arr2, prop) {
    _.each(arr2, function (arr2obj) {
      var arr1obj = _.find(arr1, function (arr1obj) {
        return arr1obj[prop] === arr2obj[prop];
      });

      arr1obj ? _.extend(arr1obj, arr2obj) : arr1.push(arr2obj);
    });
  }

  generateAbc(abcHeader, melody) {
    return abcHeader + melody.map((item, index, items) => {
      let prevItem = index > 0 ? items[index - 1] : null;
      return MusicjsonToolbox.pitchDuration2AbcStep(item, prevItem);
    }).join('');
  }

}

export default new MelodyHelper();