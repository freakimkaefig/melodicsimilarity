import ArrayHelper from '../ArrayHelper'

describe('ArrayHelper', () => {

  var result;

  it('should merge two arrays by given property', () => {
    var arr1 = [{ 'x': 1, 'y': 9 }, { 'x': 2, 'y': 5 }];
    var arr2 = [{ 'x': 1, 'y': 7}];
    result = ArrayHelper.mergeByProperty(arr1, arr2, 'x');
    expect(arr1.length).toBe(2);
    expect(arr1[0].x).toBe(1);
    expect(arr1[0].y).toBe(7);
    expect(arr1[1].x).toBe(2);
    expect(arr1[1].y).toBe(5);
  });

  it('should return unique objects of two arrays by given property value', () => {
    result = ArrayHelper.differenceByProperty([{ 'x': 2 }, { 'x': 1 }], [{ 'x': 1 }, { 'x': 3 }], 'x');
    expect(result.length).toBe(2);
    expect(result[0].x).toBe(2);
    expect(result[1].x).toBe(3);

    result = ArrayHelper.differenceByProperty([{ 'x': 1, 'y': 9 }], [{ 'x': 2, 'y': 5 }, { 'x': 1, 'y': 7 }], 'x');
    expect(result.length).toBe(1);
    expect(result[0].x).toBe(2);
    expect(result[0].y).toBe(5);
  });

  it('should intersect two arrays by given property', () => {
    result = ArrayHelper.arrayIntersect([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
    expect(result.length).toBe(1);
    expect(result[0].x).toBe(1);
  });

  it('should return unique objects of two array by given property', () => {
    result = ArrayHelper.arrayDiff([{ 'x': 2 }, { 'x': 1 }], [{ 'x': 1 }, { 'x': 3 }], 'x');
    expect(result.length).toBe(1);
    expect(result[0].x).toBe(2);

    result = ArrayHelper.arrayDiff([{ 'x': 1, 'y': 9 }], [{ 'x': 2, 'y': 5 }, { 'x': 1, 'y': 7 }], 'x');
    expect(result.length).toBe(0);
  });

  it('should merge two arrays by given property', () => {
    result = ArrayHelper.arrayMerge([{ 'x': 1 }], [{ 'x': 2 }, { 'x': 1 }], 'x');
    expect(result.length).toBe(2);
    expect(result[0].x).toBe(1);
    expect(result[1].x).toBe(2);

    result = ArrayHelper.arrayMerge([{ 'x': 1, 'y': 9 }], [{ 'x': 2, 'y': 5 }, { 'x': 1, 'y': 7 }], 'x');
    expect(result.length).toBe(2);
    expect(result[0].x).toBe(1);
    expect(result[0].y).toBe(9);
    expect(result[1].x).toBe(2);
    expect(result[1].y).toBe(5);
  });

});