export interface RawTrackPoint {
    _attributes: {
      lat: number;
      lon: number;
    };
    ele: {
      _text: number;
    };
    time?: {
      _text: string;
    };
  }
  
  export interface GpxObj {
    gpx: {
      trk: {
        trkseg: {
          trkpt: RawTrackPoint[];
        };
      };
    };
  }
  
  export interface TrackPoint {
    lat: number;
    lon: number;
    ele: number;
    time?: string | null;
  }
  
  