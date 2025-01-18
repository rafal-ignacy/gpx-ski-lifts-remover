import { readFileSync, writeFileSync } from "fs";
import { xml2js, js2xml } from "xml-js";
import { RawTrackPoint, TrackPoint, GpxObj } from "./types";

export default class ReadWriteGpx {
  private gpxObj!: GpxObj;

  constructor(private inputGpxPath: string, private outputGpxPath: string) {}

  private simplifyTrackPoints(trackPoints: RawTrackPoint[]): TrackPoint[] {
    return trackPoints.map(({ _attributes, ele, time }) => ({
      lat: _attributes.lat,
      lon: _attributes.lon,
      ele: ele._text,
      time: time ? time._text : null,
    }));
  }

  private toGpxTrackPoints(trackPoints: TrackPoint[]): RawTrackPoint[] {
    return trackPoints.map(({ lat, lon, ele, time }) => ({
      _attributes: { lat, lon },
      ele: { _text: ele },
      ...(time && { time: { _text: time } }),
    }));
  }

  public readGpxFile(): TrackPoint[] {
    const gpxFile = readFileSync(this.inputGpxPath, "utf-8");
    const gpxObj = xml2js(gpxFile, { compact: true }) as GpxObj;
    this.gpxObj = gpxObj;
    return this.simplifyTrackPoints(this.gpxObj.gpx.trk.trkseg.trkpt);
  }

  public writeGpxFile(downhillTrackPointsFinal: TrackPoint[]): void {
    this.gpxObj.gpx.trk.trkseg.trkpt = this.toGpxTrackPoints(
      downhillTrackPointsFinal
    );
    const outputGpx = js2xml(this.gpxObj, { compact: true, spaces: 2 });
    writeFileSync(this.outputGpxPath, outputGpx, "utf-8");
  }
}
