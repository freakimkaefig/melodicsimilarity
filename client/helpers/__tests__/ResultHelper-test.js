import {SORT_FUNCTION} from '../ResultHelper';

describe('ResultHelper', () => {

  var result;

  it('should sort correctly by rank', () => {
    var values = [
      { rank: 2, maxSimilarityCount: 1, id: 1 },
      { rank: 1, maxSimilarityCount: 1, id: 1 }
    ];
    values.sort(SORT_FUNCTION);
    expect(values[0].rank).toBe(1);
    expect(values[1].rank).toBe(2);
  });

  it('should sort correctly by maxSimilarityCount', () => {
    var values = [
      { rank: 1, maxSimilarityCount: 1, id: 1 },
      { rank: 1, maxSimilarityCount: 2, id: 1 }
    ];
    values.sort(SORT_FUNCTION);
    expect(values[0].maxSimilarityCount).toBe(2);
    expect(values[1].maxSimilarityCount).toBe(1);
  });

  it('should sort correctly by id', () => {
    var values = [
      { rank: 1, maxSimilarityCount: 1, id: 2 },
      { rank: 1, maxSimilarityCount: 1, id: 1 }
    ];
    values.sort(SORT_FUNCTION);
    expect(values[0].id).toBe(1);
    expect(values[1].id).toBe(2);
  });

});