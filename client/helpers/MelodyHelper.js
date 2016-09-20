import MusicJsonToolbox from 'musicjson-toolbox';

class MelodyHelper {

  generateAbc(abcHeader, melody) {
    return abcHeader + melody.map((item, index, items) => {
      let prevItem = index > 0 ? items[index - 1] : null;
      return MusicJsonToolbox.pitchDuration2AbcStep(item, prevItem);
    }).join('');
  }

}

export default new MelodyHelper();