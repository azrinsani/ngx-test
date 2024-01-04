import { ArrayUtilsCommon } from './array.utils';

describe('ArrayUtilsCommon', () => {
  const testArray: number[] = [1, 0, 3, 2];
  describe('getMax', () => {
    it('should get the max value', () => {
      expect(ArrayUtilsCommon.getMax(testArray)).toBe(3);
    });

    it('should return null for an empty array', () => {
      expect(ArrayUtilsCommon.getMax([])).toBeNull();
    });
  });

  describe('getMin', () => {
    it('should get the min value', () => {
      expect(ArrayUtilsCommon.getMin(testArray)).toBe(0);
    });

    it('should return null for an empty array', () => {
      expect(ArrayUtilsCommon.getMin([])).toBeNull();
    });
  });

  describe('getMinMax', () => {
    it('should get the max and min value', () => {
      expect(ArrayUtilsCommon.getMinMax(testArray)).toEqual([0, 3]);
    });

    it('should return [undefined, undefined] for an empty array', () => {
      expect(ArrayUtilsCommon.getMinMax([])).toEqual([undefined, undefined]);
    });

    it('should return for an array with one element', () => {
      expect(ArrayUtilsCommon.getMinMax([0])).toEqual([0, 0]);
    });
  });
});
