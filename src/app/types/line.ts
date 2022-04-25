import { Vector3 } from 'three';

export class Line {
  constructor(private origin: Vector3, private direction: Vector3) {
  }

  // Create a Line between two vectors
  public static fromSegment(pa: Vector3, pb: Vector3): Line {
    return new Line(pa, new Vector3(pb.x - pa.x, pb.y - pa.y, pb.z - pa.z));
  }

  // Get point along the line
  public getPointAt(t: number): Vector3 {
    return new Vector3(this.origin.x + this.direction.x * t, this.origin.y + this.direction.y * t, this.origin.z + this.direction.z * t);
  }
}
