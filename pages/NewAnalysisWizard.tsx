
import React, { useState, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Map as MapIcon,
  Clock,
  Activity,
  Check,
  Cloud,
  Maximize2,
  Upload,
  Search
} from 'lucide-react';
import { Button, Card, Badge, Input } from '../components/UI';
import MapView, { MapViewRef } from '../components/MapView';
import LocationSearch from '../components/LocationSearch';
import FileUploader from '../components/FileUploader';

interface NewAnalysisWizardProps {
  onCancel: () => void;
  onStart: (geojson: GeoJSON.Feature | null) => void;
}

const steps = [
  { id: 1, title: 'Define AOI', icon: MapIcon },
  { id: 2, title: 'Time Period', icon: Clock },
  { id: 3, title: 'Indices', icon: Activity },
  { id: 4, title: 'Confirm', icon: Check },
];

const NewAnalysisWizard: React.FC<NewAnalysisWizardProps> = ({ onCancel, onStart }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedArea, setSelectedArea] = useState<number>(0);
  const [selectedGeoJSON, setSelectedGeoJSON] = useState<GeoJSON.Feature | null>(null);
  const [isRecurring, setIsRecurring] = useState(false);
  const mapRef = useRef<MapViewRef>(null);

  // Step 2: Time Period
  const [startDate, setStartDate] = useState('2024-01-01');
  const [endDate, setEndDate] = useState('2024-12-31');
  const [frequency, setFrequency] = useState('monthly');

  // Step 3: Analysis Options  
  const [analysisName, setAnalysisName] = useState('');
  const [satelliteSource, setSatelliteSource] = useState('Sentinel-2 L2A');
  const [cloudCoverage, setCloudCoverage] = useState('20');
  const [includeVisualization, setIncludeVisualization] = useState(true);
  const [selectedIndices, setSelectedIndices] = useState<string[]>(['NDVI']); // Default NDVI selected

  const next = () => setCurrentStep(prev => Math.min(prev + 1, steps.length));
  const back = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col animate-in fade-in duration-300">
      {/* Navbar */}
      <div className="px-6 h-16 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Dashboard
          </Button>
          <div className="w-px h-6 bg-slate-200" />
          <h1 className="font-bold text-slate-900 tracking-tight">New Analysis Configuration</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">Save Draft</Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Steps */}
        <div className="w-80 border-r border-slate-100 bg-slate-50/50 p-6 space-y-8 overflow-y-auto">
          <div className="space-y-6">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`flex gap-4 transition-all ${currentStep === step.id ? 'opacity-100' : 'opacity-40'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 ${currentStep >= step.id ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-200 text-slate-400'
                  }`}>
                  {currentStep > step.id ? <Check className="w-4 h-4" /> : <step.icon className="w-4 h-4" />}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{step.title}</p>
                  <p className="text-xs text-slate-500">Step {step.id} of 4</p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-slate-200 space-y-4">
            <Card className="p-4 bg-white/60">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Analysis Summary</h4>
              <div className="space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Satellite Source</span>
                  <span className="font-semibold text-slate-900">Sentinel-2 L2A</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Total AOI Area</span>
                  <span className="font-semibold text-slate-900">{selectedArea > 0 ? `${selectedArea} km²` : 'Not Selected'}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Est. Processing Time</span>
                  <span className="font-semibold text-indigo-600">{selectedArea > 0 ? '~2-5 min' : 'N/A'}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col bg-white overflow-hidden relative">
          {currentStep === 1 && (
            <div className="flex flex-col lg:flex-row h-full gap-4 p-4">
              {/* Left Sidebar - Tools */}
              <div className="w-full lg:w-80 bg-slate-50 rounded-lg border border-slate-200 p-4 space-y-4 overflow-y-auto max-h-96 lg:max-h-none">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-2">Search Location</h3>
                  <LocationSearch
                    onLocationSelect={(lat, lon, bounds) => {
                      mapRef.current?.flyTo(lat, lon, bounds);
                    }}
                  />
                  <p className="text-xs text-slate-500 mt-2">Search for a region or landmark to navigate the map</p>
                </div>

                <div className="border-t border-slate-200 pt-4">
                  <h3 className="text-sm font-bold text-slate-900 mb-2">Import AOI</h3>
                  <FileUploader
                    onFileLoad={(geojson) => {
                      mapRef.current?.loadGeoJSON(geojson);
                    }}
                  />
                  <p className="text-xs text-slate-500 mt-2">Upload a GeoJSON file to import an existing area</p>
                </div>

                <div className="border-t border-slate-200 pt-4">
                  <h3 className="text-sm font-bold text-slate-900 mb-2">Draw AOI</h3>
                  <p className="text-xs text-slate-500 mb-3">Use the map tools to draw your area:</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 p-2 bg-white rounded border border-slate-200">
                      <div className="w-8 h-8 bg-slate-100 rounded flex items-center justify-center">
                        <Search className="w-4 h-4 text-slate-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-slate-900">Rectangle Tool</p>
                        <p className="text-[10px] text-slate-500">Click and drag on map</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-white rounded border border-slate-200">
                      <div className="w-8 h-8 bg-slate-100 rounded flex items-center justify-center">
                        <Activity className="w-4 h-4 text-slate-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-slate-900">Polygon Tool</p>
                        <p className="text-[10px] text-slate-500">Click vertices, double-click to finish</p>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedArea > 0 && (
                  <div className="border-t border-slate-200 pt-4">
                    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
                      <p className="text-xs font-medium text-indigo-900">Selected Area</p>
                      <p className="text-2xl font-bold text-indigo-600 mt-1">{selectedArea.toFixed(2)} km²</p>
                      {selectedGeoJSON && (
                        <p className="text-[10px] text-indigo-600 mt-1">
                          GeoJSON ready for processing
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Map */}
              <MapView
                ref={mapRef}
                isWizard
                className="flex-1 rounded-lg overflow-hidden border border-slate-200 min-h-96"
                onAreaSelected={(area, geojson) => {
                  setSelectedArea(area);
                  setSelectedGeoJSON(geojson || null);
                }}
              />
            </div>
          )}

          {currentStep === 2 && (
            <div className="p-12 max-w-2xl mx-auto space-y-8 animate-in slide-in-from-right-4 duration-300">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-slate-900">Select Time Range</h2>
                <p className="text-slate-500 text-sm">Choose historical data or schedule near-real-time monitoring.</p>
              </div>

              {/* Recurring Toggle */}
              <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">Ongoing Analysis</h3>
                    {isRecurring && <Badge variant="success">Active</Badge>}
                  </div>
                  <p className="text-xs text-slate-600 mt-1">Monitor this area continuously with automatic updates</p>
                </div>
                <button
                  onClick={() => setIsRecurring(!isRecurring)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isRecurring ? 'bg-indigo-600' : 'bg-slate-300'
                    }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isRecurring ? 'translate-x-6' : 'translate-x-1'
                      }`}
                  />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <Input
                  label="Start Date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <div className="relative">
                  <Input
                    label="End Date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    disabled={isRecurring}
                  />
                  {isRecurring && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg pointer-events-none">
                      <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-200">
                        Running Indefinitely
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-medium text-slate-700">Cloud Cover Threshold (%)</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    className="flex-1 accent-indigo-600"
                    min="0"
                    max="100"
                    value={cloudCoverage}
                    onChange={(e) => setCloudCoverage(e.target.value)}
                  />
                  <span className="text-sm font-bold text-slate-900">{cloudCoverage}%</span>
                </div>
                <p className="text-xs text-slate-400">Scenes with higher cloud cover will be filtered out during processing.</p>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="p-12 max-w-4xl mx-auto space-y-8 animate-in slide-in-from-right-4 duration-300">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-slate-900">Geospatial Indices</h2>
                <p className="text-slate-500 text-sm">Select the spectral indices to calculate for your study area.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: 'NDVI', long: 'Normalized Difference Vegetation Index', desc: 'Standard indicator of vegetation health and greenness.' },
                  { name: 'EVI', long: 'Enhanced Vegetation Index', desc: 'Corrects for atmosphere and soil signals in dense biomass.' },
                  { name: 'SAVI', long: 'Soil-Adjusted Vegetation Index', desc: 'Ideal for areas with sparse vegetation and exposed soil.' },
                  { name: 'NDWI', long: 'Normalized Difference Water Index', desc: 'Monitor surface water bodies and moisture levels.' }
                ].map((idx) => {
                  const isSelected = selectedIndices.includes(idx.name);
                  return (
                    <Card
                      key={idx.name}
                      className={`p-5 border-2 transition-all cursor-pointer hover:border-indigo-200 ${isSelected ? 'border-indigo-600 shadow-md' : 'border-slate-100'}`}
                      onClick={() => {
                        if (isSelected) {
                          setSelectedIndices(selectedIndices.filter(i => i !== idx.name));
                        } else {
                          setSelectedIndices([...selectedIndices, idx.name]);
                        }
                      }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="info">{idx.name}</Badge>
                        {isSelected && <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center"><Check className="w-3 h-3 text-white" /></div>}
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">{idx.long}</h4>
                      <p className="text-xs text-slate-500 mt-2 leading-relaxed">{idx.desc}</p>
                    </Card>
                  );
                })}
              </div>
              <div className="p-4 border border-slate-100 rounded-xl bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center"><Activity className="w-5 h-5 text-indigo-600" /></div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Custom Index Builder</p>
                    <p className="text-xs text-slate-500">Define equations using band arithmetic.</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Configure</Button>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="p-12 max-w-2xl mx-auto space-y-12 text-center animate-in zoom-in-95 duration-500">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10" />
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Configuration Complete</h2>
                <p className="text-slate-500">Review your settings before launching the analysis job on the compute cluster.</p>
              </div>
              <Card className="text-left divide-y divide-slate-100 overflow-hidden">
                <div className="p-4 flex justify-between bg-slate-50/50">
                  <span className="text-sm text-slate-500">Project Name</span>
                  <span className="text-sm font-bold text-slate-900">Iowa Field Survey 2024</span>
                </div>
                <div className="p-4 flex justify-between">
                  <span className="text-sm text-slate-500">Analysis Type</span>
                  <span className="text-sm font-bold text-slate-900">NDVI + Time Series</span>
                </div>
                <div className="p-4 flex justify-between">
                  <span className="text-sm text-slate-500">Scene Source</span>
                  <span className="text-sm font-bold text-slate-900">Sentinel-2 (L2A, Top of Atmos)</span>
                </div>
                <div className="p-4 flex justify-between">
                  <span className="text-sm text-slate-500">Estimated Duration</span>
                  <span className="text-sm font-bold text-slate-900">~14 minutes</span>
                </div>
              </Card>
              <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100 text-left">
                <Cloud className="w-6 h-6 text-amber-600 shrink-0" />
                <p className="text-xs text-amber-800 leading-relaxed">
                  Note: Computing costs for this job will be deducted from your enterprise balance immediately upon launch.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between flex-shrink-0 bg-white">
          <Button
            variant="outline"
            onClick={back}
            disabled={currentStep === 1}
            className={currentStep === 1 ? 'invisible' : ''}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
          <div className="text-sm text-slate-500">
            Step {currentStep} of {steps.length}
          </div>
          <Button
            onClick={currentStep === 4 ? onStart : next}
          >
            {currentStep === 4 ? 'Launch Analysis' : 'Next'}
            {currentStep !== 4 && <ChevronRight className="w-4 h-4 ml-1" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewAnalysisWizard;
