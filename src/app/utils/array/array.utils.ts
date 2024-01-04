export class ArrayUtilsCommon {
  /**
   * Gets the same thing as Math.max, but copes with bigger arrays
   *
   * @param array
   * @returns max value or null if empty
   */
  static getMax(array: number[]): number {
    if (array.length < 1) {
      return null;
    }
    let max: number = array[0];

    for (const value of array) {
      if (value > max) {
        max = value;
      }
    }

    return max;
  }

  /**
   * Gets the same thing as Math.min, but copes with bigger arrays
   *
   * @param array
   * @returns min value or null if empty
   */
  static getMin(array: number[]): number {
    if (array.length < 1) {
      return null;
    }
    let min: number = array[0];

    for (const value of array) {
      if (value < min) {
        min = value;
      }
    }

    return min;
  }

  /**
   * Get min and max values from array or iterator with a single loop of the array.
   * Same output as Math.min() and Math.max(), but copes with bigger arrays.
   * If you have a large iterable it is generally preferable to pass that in instead of converting to an array.
   *
   * @param array - An array-like or Iterable object.
   * @returns - An array of min/max values: [min: number, max: number].
   * If there are no values in the array, the returned min & max will both be undefined.
   */
  static getMinMax(array: Iterable<number>): [number, number] {
    const getFirstValue = (iterable: Iterable<number>): number => {
      for (const first of iterable) {
        return first;
      }
      return undefined;
    };

    let min: number;
    let max: number;

    const firstValue: number = getFirstValue(array);
    if (firstValue === undefined) {
      return [undefined, undefined];
    } else {
      min = firstValue;
      max = firstValue;
    }

    for (const val of array) {
      if (val > max) {
        max = val;
      } else if (val < min) {
        min = val;
      }
    }

    return [min, max];
  }
}
