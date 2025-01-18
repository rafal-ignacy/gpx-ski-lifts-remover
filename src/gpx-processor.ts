import { TrackPoint } from "./types";

export default class GpxProcesor {
  private downhillPoints: TrackPoint[] = [];
  private downhillRuns: TrackPoint[][] = [];

  constructor(private trackPoints: TrackPoint[]) {}

  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // earth radius in km
    const toRadians = (degrees: number) => degrees * (Math.PI / 180);
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) ** 2;

    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 1000; // distance in meters
  }

  private isDownhill(current: TrackPoint, next: TrackPoint): boolean {
    const elevationChange = next.ele - current.ele;
    const distance = this.calculateDistance(
      current.lat,
      current.lon,
      next.lat,
      next.lon
    );
    if (distance === 0) return false;

    const slope = (elevationChange / distance) * 100;
    return slope <= 0;
  }

  public filterDownhillPoints(): void {
    this.trackPoints.forEach((point, index) => {
      if (index === this.trackPoints.length - 1) return;
      const nextPoint = this.trackPoints[index + 1];
      if (this.isDownhill(point, nextPoint)) {
        this.downhillPoints.push(point);
      }
    });
  }

  public groupDownhillRuns(): void {
    let currentRun: TrackPoint[] = [];
    let runDistance = 0;

    this.downhillPoints.forEach((point, index) => {
      if (index === this.downhillPoints.length - 1) return;
      const nextPoint = this.downhillPoints[index + 1];
      const distance = this.calculateDistance(
        point.lat,
        point.lon,
        nextPoint.lat,
        nextPoint.lon
      );

      if (distance <= 100) {
        runDistance += distance;
        currentRun.push(point);
      } else {
        if (runDistance > 500 && currentRun.length > 100) {
          this.downhillRuns.push(currentRun);
        }
        currentRun = [];
        runDistance = 0;
      }
    });

    if (runDistance > 500 && currentRun.length > 100) {
      this.downhillRuns.push(currentRun);
    }
  }

  public getFinalDownhillPoints(): TrackPoint[] {
    return this.downhillRuns.flat();
  }
}
