// Convert a Color From CSS notation to RGB
export function convertColorFromCssStringToRGBCommon(color: string): [number, number, number] {
  let r: number = 0;
  let g: number = 0;
  let b: number = 0;
  if (color.startsWith('#')) {
    if (color.length === 4) {
      r = parseInt('0x' + color[1] + color[1], 16);
      g = parseInt('0x' + color[2] + color[2], 16);
      b = parseInt('0x' + color[3] + color[3], 16);
    } else if (color.length === 7) {
      r = parseInt('0x' + color[1] + color[2], 16);
      g = parseInt('0x' + color[3] + color[4], 16);
      b = parseInt('0x' + color[5] + color[6], 16);
    } else {
      throw new Error('Invalid Color Hex length "' + color + '"');
    }
    if (isNaN(r) || isNaN(g) || isNaN(b)) {
      throw new Error('Invalid Color Hex Format "' + color + '"');
    }
    return [r, g, b];
  } else if (color.startsWith('rgb')) {
    const colorParts: string[] = color.match(/\d+/g);
    if (colorParts.length === 3) {
      r = parseInt(colorParts[0], 10);
      g = parseInt(colorParts[1], 10);
      b = parseInt(colorParts[2], 10);
      return [r, g, b];
    } else {
      throw new Error('Invalid RGB Color Format "' + color + '"');
    }
  } else {
    throw new Error('Invalid Color Format "' + color + '"');
  }
}

// Convert a Color from a CSS notation to HSL
export function convertColorFromCssToHSLCommon(cssColor: string): [number, number, number] {
  const rgb: [number, number, number] = convertColorFromCssStringToRGBCommon(cssColor);
  const r: number = rgb[0] / 255;
  const g: number = rgb[1] / 255;
  const b: number = rgb[2] / 255;
  const cMin: number = Math.min(r, g, b);
  const cMax: number = Math.max(r, g, b);
  const delta: number = cMax - cMin;

  let h: number;
  let s: number;
  let l: number;
  if (delta === 0) {
    h = 0;
  } else if (cMax === r) {
    h = ((g - b) / delta) % 6;
  } else if (cMax === g) {
    h = (b - r) / delta + 2;
  } else {
    h = (r - g) / delta + 4;
  }
  h = Math.round(h * 60);
  if (h < 0) {
    h += 360;
  }
  l = (cMax + cMin) / 2;
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);
  return [h, s, l];
}
