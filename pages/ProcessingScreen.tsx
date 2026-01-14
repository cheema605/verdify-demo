
import React, { useState, useEffect } from 'react';
import {
  Loader2,
  Terminal,
  Layers,
  Cpu,
  CloudRain,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  ChevronRight
} from 'lucide-react';
import { Progress, Card, Badge, Button } from '../components/UI';
import MapView from '../components/MapView';

interface ProcessingScreenProps {
  onFinish: () => void;
  initialGeoJSON?: GeoJSON.Feature | null;
}

const ProcessingScreen: React.FC<ProcessingScreenProps> = ({ onFinish, initialGeoJSON = null }) => {
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>(['Initializing worker nodes...', 'Authentication successful.']);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(timer);
          return 100;
        }
        return p + Math.random() * 5;
      });
    }, 800);

    const logTimer = setInterval(() => {
      const messages = [
        'Fetching Sentinel-2 granules...',
        'Cloud filtering (Threshold: 15%)...',
        'Extracting spectral bands (B4, B8)...',
        'Computing NDVI matrix...',
        'Generating AOI aggregate statistics...',
        'Applying topographic correction...',
        'Finalizing results dataset...'
      ];
      setLogs(prev => {
        if (prev.length >= 10) return prev;
        return [...prev, messages[Math.floor(Math.random() * messages.length)]];
      });
    }, 2000);

    return () => {
      clearInterval(timer);
      clearInterval(logTimer);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 overflow-y-auto">
      <div className="max-w-4xl w-full space-y-8 animate-in zoom-in-95 duration-700 my-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-white border border-slate-200 rounded-2xl shadow-sm mb-4">
            {progress < 100 ? (
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            ) : (
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            )}
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            {progress < 100 ? 'Analyzing Satellite Data...' : 'Analysis Complete'}
          </h1>
          <p className="text-slate-500 max-w-md mx-auto">
            Our cloud compute cluster is processing 14 granules for your selected AOI. This usually takes around 5-10 minutes.
          </p>
        </div>

        <Card className="p-8 space-y-6 bg-white shadow-xl">
          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <span className="text-sm font-bold text-slate-900 uppercase tracking-wider">Overall Progress</span>
              <span className="text-3xl font-black text-slate-900">{Math.floor(progress)}%</span>
            </div>
            <Progress value={progress} className="h-4" />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center text-center">
              <Cpu className="w-5 h-5 text-slate-400 mb-2" />
              <span className="text-[10px] font-bold text-slate-400 uppercase">Compute Clusters</span>
              <span className="text-sm font-bold text-slate-800">12 Nodes Active</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center text-center">
              <ImageIcon className="w-5 h-5 text-slate-400 mb-2" />
              <span className="text-[10px] font-bold text-slate-400 uppercase">Data Sources</span>
              <span className="text-sm font-bold text-slate-800">42 scenes</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center text-center">
              <AlertCircle className="w-5 h-5 text-slate-400 mb-2" />
              <span className="text-[10px] font-bold text-slate-400 uppercase">Success Rate</span>
              <span className="text-sm font-bold text-slate-800">99.4%</span>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-slate-900 text-emerald-400 p-6 font-mono text-xs h-64 overflow-hidden relative border-none">
            <div className="flex items-center gap-2 mb-4 text-slate-500">
              <Terminal className="w-4 h-4" />
              <span className="uppercase font-bold tracking-widest text-[10px]">Processing Engine Output</span>
            </div>
            <div className="space-y-2 custom-scrollbar overflow-y-auto h-48 pr-2">
              {logs.map((log, i) => (
                <div key={i} className="flex gap-3">
                  <span className="text-slate-700">[{new Date().toLocaleTimeString()}]</span>
                  <span>{log}</span>
                </div>
              ))}
              {progress < 100 && <span className="inline-block w-2 h-4 bg-emerald-400 animate-pulse ml-1 align-middle" />}
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none" />
          </Card>

          <Card className="p-6 bg-white overflow-hidden">
            <div className="flex items-center gap-2 mb-4 text-slate-900 font-bold">
              <Layers className="w-4 h-4" />
              <span>Live Granule Preview</span>
            </div>
            <div className="rounded-lg overflow-hidden border-2 border-slate-200">
              <MapView
                className="h-64"
                isWizard={false}
                initialGeoJSON={initialGeoJSON}
              />
            </div>
            {progress >= 100 && (
              <Button onClick={onFinish} className="w-full mt-6 flex items-center gap-2 group">
                View Analysis Results
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProcessingScreen;
