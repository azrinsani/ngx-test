import { Colour } from './../shared/types/colour.type';
import * as xpath from 'xpath';
import * as d3 from 'd3';
import { ColourMap } from '../colourmap';
import { Angle } from '../types/angle';
import { Line } from '../types/line';
import { Plane, Vector3 } from 'three';
import { Position } from '../types/position';
import { PotreeMultipointcloudDefinition } from '../types/potree.multipointcloud.definition';

export abstract class Util {
  static clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }

  // Interpolates between two colours
  static interpolateColor(color0: Colour, color1: Colour, mixer: number, useHue: boolean = true): number[] {
    if (color0 === null && color1 === null) {
      return [0, 0, 0];
    }

    if (!color1) {
      return color0.getRGB();
    }

    if (!color0) {
      return color1.getRGB();
    }

    if (mixer <= 0) {
      return color0.getRGB();
    }

    if (mixer >= 1) {
      return color1.getRGB();
    }

    if (useHue) {
      const hsb0: number[] = this.RGBtoHSB(color0.getRGB()[0], color0.getRGB()[1], color0.getRGB()[2]);
      const hsb1: number[] = this.RGBtoHSB(color1.getRGB()[0], color1.getRGB()[1], color1.getRGB()[2]);

      let h0: number = hsb0[0];
      let h1: number = hsb1[0];

      const s0: number = hsb0[1];
      const s1: number = hsb1[1];

      const b0: number = hsb0[2];
      const b1: number = hsb1[2];

      if (h1 < h0) {
        h1 += 1.0;
      }
      if ((h1 - h0) > 0.5) {
        h0 += 1.0;
      }

      const hue: number = this.interpolate(h0, h1, mixer);
      const saturation: number = this.interpolate(s0, s1, mixer);
      const brightness: number = this.interpolate(b0, b1, mixer);

      const rgbColor: Colour = Colour.fromValue(this.HSBtoRGB(hue, saturation, brightness));

      return rgbColor.getRGB();
    } else {
      const r: number = this.interpolate(color0.getRGB()[0], color1.getRGB()[0], mixer);
      const g: number = this.interpolate(color0.getRGB()[1], color1.getRGB()[1], mixer);
      const b: number = this.interpolate(color0.getRGB()[2], color1.getRGB()[2], mixer);
      return [r, g, b];
    }
  }

  // Converts hsb colour to rgb hex value
  static HSBtoRGB(hue: number, saturation: number, brightness: number): number {
    let i: number = 0;
    let j: number = 0;
    let k: number = 0;
    if (saturation === 0.0) {
      i = j = k = (brightness * 255.0 + 0.5);
    } else {
      const f1: number = (hue - Math.floor(hue)) * 6.0;
      const f2: number = f1 - Math.floor(f1);
      const f3: number = brightness * (1.0 - saturation);
      const f4: number = brightness * (1.0 - saturation * f2);
      const f5: number = brightness * (1.0 - saturation * (1.0 - f2));

      switch (Math.trunc(f1)) {
        case 0:
          i = (brightness * 255.0 + 0.5);
          j = (f5 * 255.0 + 0.5);
          k = (f3 * 255.0 + 0.5);
          break;
        case 1:
          i = (f4 * 255.0 + 0.5);
          j = (brightness * 255.0 + 0.5);
          k = (f3 * 255.0 + 0.5);
          break;
        case 2:
          i = (f3 * 255.0 + 0.5);
          j = (brightness * 255.0 + 0.5);
          k = (f5 * 255.0 + 0.5);
          break;
        case 3:
          i = (f3 * 255.0 + 0.5);
          j = (f4 * 255.0 + 0.5);
          k = (brightness * 255.0 + 0.5);
          break;
        case 4:
          i = (f5 * 255.0 + 0.5);
          j = (f3 * 255.0 + 0.5);
          k = (brightness * 255.0 + 0.5);
          break;
        case 5:
          i = (brightness * 255.0 + 0.5);
          j = (f3 * 255.0 + 0.5);
          k = (f4 * 255.0 + 0.5);
          break;
      }
    }
    return 0xFF000000 | i << 16 | j << 8 | k << 0;
  }

  // Converts rgb to hsb
  static RGBtoHSB(r: number, g: number, b: number): number[] {
    const outputArray: number[] = [0, 0, 0];
    let f2: number;
    let f1: number;
    let i: number = (r > g) ? r : g;
    if (b > i) {
      i = b;
    }

    let j: number = (r < g) ? r : g;
    if (b < j) {
      j = b;
    }
    const f3: number = i / 255.0;
    if (i !== 0) {
      f2 = (i - j) / i;
    } else {
      f2 = 0.0;
    }
    if (f2 === 0.0) {
      f1 = 0.0;
    } else {
      const f4: number = (i - r) / (i - j);
      const f5: number = (i - g) / (i - j);
      const f6: number = (i - b) / (i - j);
      if (r === i) {
        f1 = f6 - f5;
      } else if (g === i) {
        f1 = 2.0 + f4 - f6;
      } else {
        f1 = 4.0 + f5 - f4;
      }
      f1 /= 6.0;
      if (f1 < 0.0) {
        f1++;
      }
    }
    outputArray[0] = f1;
    outputArray[1] = f2;
    outputArray[2] = f3;
    return outputArray;
  }

  // Creates an instance of colourMap from xml definition
  static getColourMap(definition: Document): ColourMap {
    const colourMapEmbeddedDefinition: Element = xpath.select1('/Layer/ColorMap', definition) as Element;
    const colourMapStandaloneDefinition: Element = xpath.select1('/ColorMap', definition) as Element;
    const colourMapDefinition: Element = colourMapEmbeddedDefinition ? colourMapEmbeddedDefinition : colourMapStandaloneDefinition;
    if (!colourMapDefinition) {
      return null;
    }

    const entries: Element[] = xpath.select('./Entry', colourMapDefinition) as Element[];
    if (!entries || entries.length <= 0) {
      return null;
    }

    const colourMap: ColourMap = new ColourMap();
    colourMap.interpolateHue = colourMapDefinition.getAttribute('interpolateHue') === 'true';
    colourMap.valuePercentages = colourMapDefinition.getAttribute('percentages') === 'true';

    for (const entry of entries) {
      const value: number = parseFloat(entry.getAttribute('value'));
      const red: number = parseFloat(entry.getAttribute('red'));
      const green: number = parseFloat(entry.getAttribute('green'));
      const blue: number = parseFloat(entry.getAttribute('blue'));
      const alpha: number = parseFloat(entry.getAttribute('alpha'));
      colourMap.set(value, Colour.fromRGBA(red, green, blue, alpha));
    }
    return colourMap;
  }

  // Returns an array of point cloud definitions if available or an empty array
  static getPointClouds(definition: Document): PotreeMultipointcloudDefinition[] {
    const sublayers: Element = xpath.select1('/Layer/SubLayers', definition) as Element;
    if (!sublayers) {
      return [];
    }
    const layerElements: Element[] = xpath.select('./layer', sublayers) as Element[];

    const layers: PotreeMultipointcloudDefinition[] = [];
    for (const layerElement of layerElements) {
      const name: Element[] = xpath.select('./name', layerElement) as Element[];
      const configUrl: Element[] = xpath.select('./configUrl', layerElement) as Element[];
      const dataUrl: Element[] = xpath.select('./dataUrl', layerElement) as Element[];
      const minz: Element[] = xpath.select('./minz', layerElement) as Element[];
      const maxz: Element[] = xpath.select('./maxz', layerElement) as Element[];
      const primary: string = layerElement.getAttribute('primary');
      layers.push({
        name: name[0].textContent,
        primary: !!primary,
        configUrl: configUrl[0].textContent,
        dataUrl: dataUrl[0].textContent,
        minz: +minz[0].textContent,
        maxz: +maxz[0].textContent
      });
    }
    return layers;
  }

  // Returns true if the inner segment is within outer segment
  static within(outerStart: number, outerEnd: number, innerStart: number, innerEnd: number): boolean {
    return Math.ceil(innerStart) >= Math.ceil(outerStart) && Math.ceil(innerEnd) <= Math.ceil(outerEnd);
  }

  // Returns true if the segment start is within segment
  static intersectStartExtendsEnd(outerStart: number, outerEnd: number, innerStart: number, innerEnd: number): boolean {
    return Math.ceil(innerStart) >= Math.ceil(outerStart) &&
      Math.ceil(innerStart) < Math.ceil(outerEnd) && Math.ceil(innerEnd) > Math.ceil(outerEnd);
  }

  // Returns true if the segment length is larger
  static spans(outerStart: number, outerEnd: number, innerStart: number, innerEnd: number): boolean {
    return innerStart < outerStart && innerEnd > outerEnd;
  }

  // Returns true of the segment end is within the segment
  static intersectEnd(outerStart: number, outerEnd: number, innerStart: number, innerEnd: number): boolean {
    return Math.ceil(outerStart) > Math.ceil(innerStart) && Math.ceil(outerEnd) >= Math.ceil(innerEnd);
  }

  static str2ab(input: string): ArrayBuffer {
    const buf: ArrayBuffer = new ArrayBuffer(input.length);
    const bufView: Uint8Array = new Uint8Array(buf);
    for (let i: number = 0, strLen: number = input.length; i < strLen; i++) {
      bufView[i] = input.charCodeAt(i);
    }
    return buf;
  }

  static ab2str(buffer: any): string {
    const decoder: TextDecoder = new TextDecoder('utf-8');
    return decoder.decode(new Uint8Array(buffer));
  }

  // Computes the azimuth angle (clockwise from North) of a linear path two locations
  static linearAzimuth(p1: Position, p2: Position): Angle {
    const lat1: number = p1.getLatitude().getRadians();
    const lon1: number = p1.getLongitude().getRadians();
    const lat2: number = p2.getLatitude().getRadians();
    const lon2: number = p2.getLongitude().getRadians();

    let dLon: number = lon2 - lon1;
    const dLat: number = lat2 - lat1;

    if (Math.abs(dLon) > Math.PI) {
      const TAU: number = Math.PI * 2;
      dLon = dLon > 0.0 ? -(TAU - dLon) : TAU + dLon;
    }

    return Angle.fromRadians(
      Math.atan2(dLon, dLat)
    );
  }

  // Computes the length of the linear path between two locations
  static linearDistance(p1: Position, p2: Position): Angle {
    const lat1: number = p1.getLatitude().getRadians();
    const lon1: number = p1.getLongitude().getRadians();
    const lat2: number = p2.getLatitude().getRadians();
    const lon2: number = p2.getLongitude().getRadians();

    const dLat: number = lat2 - lat1;
    let dLon: number = lon2 - lon1;

    if (Math.abs(dLon) > Math.PI) {
      const TAU: number = Math.PI * 2;
      dLon = dLon > 0.0 ? -(TAU - dLon) : TAU + dLon;
    }

    return Angle.fromRadians(
      Math.hypot(dLat, dLon)
    );
  }

  // Compute the plane that contains the two provided lines
  static setPlaneFromLines(plane: Plane, line1: Line, line2: Line): void {
    const point1: Vector3 = line1.getPointAt(0);
    const point2: Vector3 = line1.getPointAt(1000);
    const point3: Vector3 = line2.getPointAt(500);

    Util.setPlaneFromThreePoints(plane, point1, point2, point3);
  }

  // Compute the plane that contains the three provided points
  static setPlaneFromThreePoints(plane: Plane, point1: Vector3, point2: Vector3, point3: Vector3): void {
    const a: number = (point1.y * (point2.z - point3.z)) + (point2.y * (point3.z - point1.z)) + (point3.y * (point1.z - point2.z));
    const b: number = (point1.z * (point2.x - point3.x)) + (point2.z * (point3.x - point1.x)) + (point3.z * (point1.x - point2.x));
    const c: number = (point1.x * (point2.y - point3.y)) + (point2.x * (point3.y - point1.y)) + (point3.x * (point1.y - point2.y));
    const d: number = -((point1.x * ((point2.y * point3.z) - (point3.y * point2.z))) + (point2.x * ((point3.y * point1.z) - (point1.y * point3.z))) + (point3.x * ((point1.y * point2.z) - (point2.y * point1.z))));

    const normal: Vector3 = new Vector3(a, b, c).normalize();
    const distance: number = d / (Math.sqrt(a * a + b * b + c * c));

    plane.set(normal, distance);
  }

  // Floating point equality test
  static isFloatEqual(n1: number, n2: number, epsilon: number = Number.EPSILON): boolean {
    return Math.abs(n1 - n2) < epsilon;
  }

  // Executes callback n times in chunks - essentially a loop that periodically yields the event loop for UI updates
  static async executeAsync(callback: any, n: number): Promise<void> {
    // Chunk size set to 5% of total iterations
    const chunkSize: number = Math.trunc(n * 0.05);

    // execute at least once for 1 item
    if (chunkSize === 0) {
      await new Promise<void>((resolve => {
        callback();
        resolve();
      }));
    }

    await new Promise<void>((resolve) => {
      let i: number = 0;

      const loop: any = () => {
        for (let chunk: number = chunkSize; chunk > 0; chunk--) {
          callback();
          i++;

          if (i === n) {
            resolve();
            return;
          }
        }

        setTimeout(loop);
      };

      loop();
    });
  }

  // Wrapper around d3 interpolate
  private static interpolate(n1: number, n2: number, mixer: number): number {
    return d3.interpolate(n1, n2)(mixer);
  }

  // Returns RGB in float format in a range 0 ... 1
  static normaliseRgb(r: number, g: number, b: number): number[] {
    r = r > 1 ? r / 255 : r;
    g = g > 1 ? g / 255 : g;
    b = b > 1 ? b / 255 : b;
    return [r, g, b];
  }

  // Crude sanity check for latitude value
  static isLat(latitude: number): boolean {
    return latitude ? Math.abs(latitude) <= 90 : undefined;
  }

  // Crude sanity check for longitude
  static isLon(longitude: number): boolean {
    return longitude ? Math.abs(longitude) <= 180 : undefined;
  }

  static toRoundedDecimalPlaces(value: number, decimalPlaces: number): number {
    return + (Math.round((value + Number.EPSILON) * Math.pow(10,decimalPlaces)) / Math.pow(10,decimalPlaces));
  }
}
