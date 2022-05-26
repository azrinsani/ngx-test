export class Colour {
  // An RGBA hex colour stored as a single number, except with the alpha being the left-most bits of the number instead of the right-most.
  // Alpha is on the left for historic reasons relating to our 3D code.
  private value: number;

  // Creates a Colour from integers in the range 0..255
  static fromRGBA(r: number, g: number, b: number, a: number = 255): Colour {
    const colour: Colour = new Colour();
    colour.setValueFromRGBA(r, g, b, a);

    return colour;
  }

  // Creates a Colour from floats in the range 0..1
  static fromRGBAFloat(r: number, g: number, b: number, a: number = 1.0): Colour {
    const colour: Colour = new Colour();
    colour.setValueFromRGBA(Math.floor(255 * r + 0.5), Math.floor(255 * g + 0.5), Math.floor(255 * b + 0.5), Math.floor(255 * a + 0.5));

    return colour;
  }

  // Creates a Colour from an RGBA hex number.
  static fromValue(value: number): Colour {
    const colour: Colour = new Colour();
    colour.value = value;

    return colour;
  }

  // Creates a Colour from a hex string. Currently does not support RGBA hex strings.
  static fromHexString(hex: string): Colour {
    if (!hex) {
      return null;
    }

    if (hex.substring(0, 1) === '#') {
      hex = hex.substring(1);
    }

    // HAndle long-form (e.g. "0033FF" or "0033FFFF").
    const regex: RegExp = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i;
    hex = hex.replace(regex, (match: string, r: string, g: string, b: string, a: string) => {
      // this.value is stored with the alpha first.
      return (a === undefined)
        ? 'FF' + r + g + b
        : a + r + g + b;
    });

    // Handle short-form (e.g. "03F", or "03FF").
    const shorthandRegex: RegExp = /^([a-f\d])([a-f\d])([a-f\d])([a-f\d])?$/i;
    hex = hex.replace(shorthandRegex, (match: string, r: string, g: string, b: string, a: string) => {
      // this.value is stored with the alpha first.
      return (a === undefined)
        ? 'FF' + r + r + g + g + b + b
        : a + a + r + r + g + g + b + b;
    });

    if (hex.length !== 6 && hex.length !== 8) {
      return null;
    }

    const colour: Colour = new Colour();
    colour.value = parseInt(hex, 16);

    return colour;
  }

  // Sets the colour value from integers in the range 0..255.
  private setValueFromRGBA(r: number, g: number, b: number, a: number): void {
    // The >>> 0 will convert to an unsigned 32 bit integer, for equivalence with JS functions such as parseInt(num, 16).
    this.value = ((a & 0xFF) << 24 | (r & 0xFF) << 16 | (g & 0xFF) << 8 | (b & 0xFF) << 0) >>> 0;
  }

  // Get the Colour's raw number value.
  getValue(): number {
    return this.value;
  }

  // Set the Colour's raw number value.
  setValue(value: number): this {
    this.value = value;
    return this;
  }

  // Get the colour as an RGB array with values in the range 0..255.
  getRGB(): [number, number, number] {
    return [
      (this.value >> 16) & 0xFF,
      (this.value >> 8) & 0xFF,
      (this.value >> 0) & 0xFF
    ];
  }

  // Get the colour as an RGBA array with values in the range 0..255.
  getRGBA(): [number, number, number, number] {
    return [
      (this.value >> 16) & 0xFF,
      (this.value >> 8) & 0xFF,
      (this.value >> 0) & 0xFF,
      (this.value >> 24) & 0xFF
    ];
  }

  // Get the alpha value as a number in the range 0..255.
  getAlpha(): number {
    return (this.value >> 24) & 0xFF;
  }

  // Get the colour as an rgba() CSS string.
  getCSS(): string {
    return `rgba(${this.getRGBA().join(', ')})`;
  }

  // Get the colour as a hex string.
  getHexString(includeAlpha: boolean = false): string {
    let hex: string = this.value.toString(16);
    if (hex.length === 8) {
      if (includeAlpha) {
        hex = hex.substr(2) + hex.substr(0, 2);
      } else {
        hex = hex.substr(2);
      }
    }
    return `#${hex}`;
  }

  // Returns the colour as a stringified RGBA array.
  public toString(): string {
    return `[${this.getRGBA().join(', ')}]`;
  }
}
