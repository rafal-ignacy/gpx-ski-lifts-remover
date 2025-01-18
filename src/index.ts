import { TrackPoint } from "./types";
import ReadWriteGpx from "./read-write-gpx";
import GpxProcesor from "./gpx-processor";

const inputGpxPath = "./data/test2b.gpx";
const outputGpxPath = "./data/output-slope.gpx";

const readWriteGpx = new ReadWriteGpx(inputGpxPath, outputGpxPath);
const trackPoints: TrackPoint[] = readWriteGpx.readGpxFile();

const gpxProcessor = new GpxProcesor(trackPoints);
gpxProcessor.filterDownhillPoints();
gpxProcessor.groupDownhillRuns();
const downhillTrackPoints: TrackPoint[] = gpxProcessor.getFinalDownhillPoints();

readWriteGpx.writeGpxFile(downhillTrackPoints);
