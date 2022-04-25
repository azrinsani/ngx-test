import { Colour } from './shared/types/colour.type';
import { Util } from './utils/util';

export class ColourMap<T = Colour> {
  logarithmicValues: ColourMap<number>;

  private colorMap: Map<number, T>;
  interpolateHue: boolean = true;
  valuePercentages: boolean = false;
  private clipLow: number;
  private clipHigh: number;
  private noDataValue: number;

  constructor() {
    this.colorMap = new Map<number, T>();
  }

  // Creates a colour buffer array from colour map, by default linear or logarithmic if specified and log map has been initialised
  static createColorBufferFromColorMap(positions: number[], colourMap: ColourMap, min: number, max: number, logScale: boolean = false): number[] {
    const colorBuffer: number[] = [];
    for (let i: number = 0; i < positions.length; i += 3) {
      if (logScale) {
        if (!colourMap.logarithmicValues) {
          colourMap.initLogColourMap(min, max);
        }
        const entry: number = colourMap.logarithmicValues.closestEntry(positions[i + 2]);
        if (entry >= 0) {
          const colour: Colour = colourMap.get(entry);
          const [r, g, b] = colour.getRGB();
          colorBuffer.push(...Util.normaliseRgb(r, g, b));
        } else {
          colorBuffer.push(1.0, 0.0, 0.0);
        }
      } else if (!isNaN(positions[i])) {
        const [r, g, b] = colourMap.calculateColorNotingIsValuesPercentages(Math.trunc(positions[i + 2]), Math.trunc(min), Math.trunc(max));
        colorBuffer.push(...Util.normaliseRgb(r, g, b));
      }
    }
    return colorBuffer;
  }

  // Initialises log colour map based on linear colour map
  public initLogColourMap(min: number, max: number): void {
    const logColourMap: ColourMap<number> = new ColourMap<number>();
    logColourMap.valuePercentages = this.valuePercentages;
    const colourRampSteps: number = this.size;
    const stepSize: number = 1 / (colourRampSteps - 1);
    const lmin: number = min > 0 ? Math.log10(min) : 0;
    const lmax: number = Math.log10(max);

    const powerStep: number = (lmax - lmin) * stepSize;
    let logStep: number = lmin;
    const keys: any[] = this.keys().sort((v0: number, v1: number) => v0 < v1 ? v0 : v1);
    for (let i: number = 0; i < colourRampSteps; i++) {
      const existingKey: any = keys[i];

      if (Util.isFloatEqual(existingKey, this.getNoDataValue())) {
        logColourMap.set(existingKey, existingKey);
        continue;
      }

      logStep += powerStep;
      const logValue: number = Math.pow(10, logStep) as any;
      logColourMap.set(existingKey, logValue);
    }
    this.logarithmicValues = logColourMap;
  }

  entries(): IterableIterator<[number, T]> {
    return this.colorMap.entries();
  }

  keys(): number[] {
    return Array.from(this.colorMap.keys());
  }

  set(key: number, value: T): any {
    return this.colorMap.set(key, value);
  }

  key(searchValue: T): number {
    for (const [key, value] of this.colorMap.entries()) {
      if (value === searchValue) {
        return key;
      }
    }
    return -1;
  }

  get(key: number): T {
    return this.colorMap.get(key);
  }

  has(key: number): boolean {
    return this.colorMap.has(key);
  }

  get minKey(): number {
    const keys: number[] = Array.from(this.colorMap.keys());
    let minKey: number = keys.length > 0 && keys[0];
    keys.forEach((key) => {
      minKey = Math.min(key, minKey);
    });
    return minKey;
  }

  get maxKey(): number {
    const keys: number[] = Array.from(this.colorMap.keys());
    let maxKey: number = keys.length > 0 && keys[0];
    keys.forEach((key) => {
      maxKey = Math.max(key, maxKey);
    });
    return maxKey;
  }

  get size(): number {
    return this.colorMap.size;
  }

  // Calculate the color for the given value. If there is no exact
  // mapping for this value, the two closest color mappings either side of the
  // provided value are interpolated. If this contains no colors, black is
  // returned.
  calculateColor(value: number): number[] {
    const clamped: number = Util.clamp(value, this.minKey, this.maxKey);
    const lessEntry: { key: number, value: Colour } = this.floorKeyEntry(clamped);
    const greaterEntry: { key: number, value: Colour } = this.ceilingKeyEntry(clamped);
    let mixer: number = 0;
    if (lessEntry != null && greaterEntry != null) {
      const difference: number = Math.abs(greaterEntry[0]) - Math.abs(lessEntry[0]);
      if (difference > 0) {
        mixer = (clamped - lessEntry[0]) / difference;
      }
    }
    const color0: Colour = lessEntry == null ? null : lessEntry[1];
    const color1: Colour = greaterEntry == null ? null : greaterEntry[1];
    return Util.interpolateColor(color0, color1, Math.abs(mixer), this.interpolateHue);
  }

  // Reverse colours
  invertColours(): ColourMap {
    const invertedColourMap: ColourMap = this.clone();

    const keys: number[] = Array.from(invertedColourMap.colorMap.keys())
      .filter(key => !Util.isFloatEqual(key, this.noDataValue))
      .reverse();

    for (let i: number = keys.length - 1, j: number = 0; i >= 0; i--, j++) {
      if (j !== i) {
        const colour: any = this.colorMap.get(keys[i]);
        invertedColourMap.set(keys[j], colour);
      }
    }

    return invertedColourMap;
  }

  // Return exact match if found or the closest entry value
  closestEntry(searchValue: number): any {
    let closestKey: number = -1;
    let lowestDiff: number = Number.MAX_VALUE;
    for (const entry of this.colorMap.entries()) {
      if (entry) {
        const value: number = Math.abs(+entry[1]);
        if (value === searchValue) {
          closestKey = +entry[0];
          break;
        }
        const diff: number = Math.abs(value - searchValue);
        if (diff < lowestDiff) {
          lowestDiff = diff;
          closestKey = +entry[0];
        }
      }
    }
    return closestKey;
  }

  // Map a value to a colour in the colour map
  calculateColorNotingIsValuesPercentages(value: number, minimum: number, maximum: number): number[] {
    if (this.logarithmicValues) {
      const entry: any = this.colorMap.get(this.logarithmicValues.closestEntry(value));
      return entry.getRGB();
    }

    return this.calculateColorNotingIsValuesPercentagesWithoutLogScale(value, minimum, maximum);
  }

  // Map a value to a colour in the colour map without applying logarithmic colour map
  // Allows the caller to apply own scaling logic to the value
  calculateColorNotingIsValuesPercentagesWithoutLogScale(value: number, minimum: number, maximum: number): number[] {
    if (this.valuePercentages) {
      return this.calculateColorAsPercentage(value, minimum, maximum);
    } else {
      if (this.clipHigh && value > this.clipHigh) {
        const entries: any[] = Array.from(this.colorMap.values());
        return entries[this.colorMap.size - 1].getRGB();
      }
      if (this.clipLow && value < this.clipLow) {
        const entries: any[] = Array.from(this.colorMap.values());
        return entries[0].getRGB();
      }
      return this.calculateColor(value);
    }
  }

  // Calculate colour for the given value as a percentage between minimum and maximum
  private calculateColorAsPercentage(value: number, minimum: number, maximum: number): number[] {
    return this.calculateColor((value - minimum) / (maximum - minimum));
  }

  // Get closest highest entry less than key of the sorted Map values.
  private floorKeyEntry(key: number): any {
    const entries: IterableIterator<[number, T]> = this.entries();
    const filtered: any[] = Array.from(entries).filter((v: [number, T]) => {
      if (key <= 0 && v[0] <= 0) {
        return v[0] >= key;
      } else {
        return v[0] <= key;
      }
    });
    return filtered && filtered.length > 0 ? filtered[filtered.length - 1] : filtered[0];
  }

  // Get closest lowest entry greater than key of the sorted Map keys.
  private ceilingKeyEntry(key: number): any {
    const entries: IterableIterator<[number, T]> = this.entries();
    const filtered: any[] = Array.from(entries).filter((v: [number, T]) => {
      if (key < 0 && v[0] < 0) {
        return v[0] <= key;
      } else {
        return v[0] >= key;
      }
    });
    return filtered[0];
  }

  // Clear colour map values
  clear(): void {
    this.colorMap.clear();
  }

  // Set no data value
  setNoDataValue(value: number): void {
    this.noDataValue = value;
  }

  // Get no data value
  getNoDataValue(): number {
    return this.noDataValue;
  }

  // Set clip low
  setClipLow(value: number): void {
    this.clipLow = value;
  }

  // Set clip high
  setClipHigh(value: number): void {
    this.clipHigh = value;
  }

  // Set logarithmic values
  clearLogarithmicColourMap(): void {
    this.logarithmicValues = null;
  }

  // Clone colour map
  clone(): ColourMap {
    const clonedMap: ColourMap = new ColourMap();
    clonedMap.valuePercentages = this.valuePercentages;
    clonedMap.interpolateHue = this.interpolateHue;
    clonedMap.clipLow = this.clipLow;
    clonedMap.clipHigh = this.clipHigh;
    clonedMap.logarithmicValues = this.logarithmicValues;
    clonedMap.noDataValue = this.noDataValue;
    for (const entry of this.colorMap.entries()) {
      const colour: any = entry[1];
      clonedMap.set(entry[0], colour);
    }
    return clonedMap;
  }

  // Returns new colour map, based on min max values, optionally logarithmic
  transformColourMap(colourMap: ColourMap, min: number, max: number, logarithmic: boolean = false): ColourMap {
    if (logarithmic) {
      colourMap.initLogColourMap(min, max);
    } else {
      colourMap.clearLogarithmicColourMap();
    }
    return colourMap;
  }

}
