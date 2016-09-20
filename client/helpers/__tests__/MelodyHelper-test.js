import MelodyHelper from '../MelodyHelper';
import { MELODY_DEFAULT_ABC } from '../../constants/MelodyConstants';

describe('MelodyHelper',  () => {

  var result;

  it('should generate abc', () => {
    result = MelodyHelper.generateAbc(MELODY_DEFAULT_ABC, [{
      pitch: {
        step: 'C',
        octave: 4
      },
      duration: 16,
      type: 'quarter'
    }]);
    expect(result).toBe(MELODY_DEFAULT_ABC + 'C16');

    result = MelodyHelper.generateAbc(MELODY_DEFAULT_ABC, [{
      pitch: {
        step: 'C',
        octave: 4
      },
      duration: 16,
      type: 'quarter'
    }, {
      pitch: {
        step: 'D',
        octave: 4
      },
      duration: 8,
      type: 'eighth'
    }]);
    expect(result).toBe(MELODY_DEFAULT_ABC + 'C16D8');
  });

});