export class Angle {
  public static ZERO: Angle = Angle.fromDegrees(0.0);

  // Create Angle from degrees
  public static fromDegrees(degrees: number): Angle {
    return new Angle(degrees, degrees * (Math.PI / 180));
  }

  // Create Angle from radians
  public static fromRadians(radians: number): Angle {
    return new Angle((180 / Math.PI) * radians, radians);
  }

  // Normalize latitude
  public static normalizeLatitude(angle: Angle): Angle {
    const latitude: number = angle.degrees % 180.0;
    return Angle.fromDegrees(latitude > 90.0 ? 180.0 - latitude : (latitude < -90.0 ? -180.0 - latitude : latitude));
  }

  // Normalize longitude
  public static normalizeLongitude(angle: Angle): Angle {
    const longitude: number = angle.degrees % 360.0;
    return Angle.fromDegrees(longitude > 180.0 ? longitude - 360.0 : (longitude < -180.0 ? 360.0 + longitude : longitude));
  }

  private constructor(private degrees: number, private radians: number) {
  }

  // Add an Angle
  add(other: Angle): Angle {
    return Angle.fromDegrees(this.degrees + other.degrees);
  }

  // Subtract an Angle
  subtract(other: Angle): Angle {
    return Angle.fromDegrees(this.degrees - other.degrees);
  }

  // Angle Sine
  sin(): number {
    return Math.sin(this.radians);
  }

  // Angle Cosine
  cos(): number {
    return Math.cos(this.radians);
  }

  // Get degrees
  getDegrees(): number {
    return this.degrees;
  }

  // Get radians
  getRadians(): number {
    return this.radians;
  }

  equals(other: Angle): boolean {
    if (!other) {
      return false;
    }
    return other.getDegrees() === this.degrees;
  }
}
