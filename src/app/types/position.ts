import { Angle } from './angle';
import { Util } from '../utils/util';
import { Line } from './line';
import { Vector3 } from 'three';

export class Position {
  // Create Position from degrees
  public static fromDegrees(latitude: number, longitude: number, elevation: number = 0): Position {
    return new Position(Angle.fromDegrees(latitude), Angle.fromDegrees(longitude), elevation);
  }

  // Create Position from radians
  public static fromRadians(latitude: number, longitude: number, elevation: number = 0): Position {
    return new Position(Angle.fromRadians(latitude), Angle.fromRadians(longitude), elevation);
  }

  // Interpolate between two positions
  public static interpolate(amount: number, p1: Position, p2: Position): Position {
    if (amount < 0.0) {
      return p1;
    } else if (amount > 1.0) {
      return p2;
    } else {
      const line: Line = Line.fromSegment(
        new Vector3(p1.getLatitude().getRadians(), p1.getLongitude().getRadians(), p1.getElevation()),
        new Vector3(p2.getLatitude().getRadians(), p2.getLongitude().getRadians(), p2.getElevation()),
      );

      const p: Vector3 = line.getPointAt(amount);
      return Position.fromRadians(p.x, p.y, p.z);
    }
  }

  private constructor(private latitude: Angle, private longitude: Angle, private elevation: number) {
  }

  // Add a position
  add(other: Position): Position {
    const latitude: Angle = Angle.normalizeLatitude(this.latitude.add(other.latitude));
    const longitude: Angle = Angle.normalizeLongitude(this.longitude.add(other.longitude));

    return new Position(latitude, longitude, this.elevation + other.elevation);
  }

  // Subtract a position
  subtract(other: Position): Position {
    const latitude: Angle = Angle.normalizeLatitude(this.latitude.subtract(other.latitude));
    const longitude: Angle = Angle.normalizeLongitude(this.longitude.subtract(other.longitude));

    return new Position(latitude, longitude, this.elevation - other.elevation);
  }

  // Get latitude
  getLatitude(): Angle {
    return this.latitude;
  }

  // Get longitude
  getLongitude(): Angle {
    return this.longitude;
  }

  // Get elevation
  getElevation(): number {
    return this.elevation;
  }

  // Compare two positions
  equals(other: Position): boolean {
    if (this === other) {
      return true;
    } else if (other !== null && other instanceof Position) {
      return Util.isFloatEqual(this.latitude.getDegrees(), other.latitude.getDegrees())
        && Util.isFloatEqual(this.longitude.getDegrees(), other.longitude.getDegrees())
        && Util.isFloatEqual(this.elevation, other.elevation);
    } else {
      return false;
    }
  }
}
