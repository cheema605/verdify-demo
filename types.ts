
export enum AppView {
  AUTH = 'AUTH',
  DASHBOARD = 'DASHBOARD',
  WIZARD = 'WIZARD',
  PROCESSING = 'PROCESSING',
  RESULTS = 'RESULTS',
  HISTORY = 'HISTORY',
  API = 'API'
}

export interface Project {
  id: string;
  name: string;
  client: string;
  startDate: string;
  deadline: string;
  status: 'Active' | 'Completed' | 'Pending' | 'Canceled';
  progress: number;
  type: string;
  selectedIndices?: string[];
  geojson?: GeoJSON.Feature;
}

export interface JobStatus {
  id: string;
  step: 'Initializing' | 'Fetching Granules' | 'Processing Indices' | 'Finalizing';
  progress: number;
  estimatedTime: string;
}

export interface AnalysisConfig {
  aoiType: 'Polygon' | 'Rectangle' | 'Upload';
  timeRange: { start: string; end: string };
  index: 'NDVI' | 'EVI' | 'SAVI' | 'Custom';
}
