
import React, { useState } from 'react';
import { 
  Key, 
  Copy, 
  RefreshCw, 
  Terminal, 
  Code, 
  Book, 
  Check,
  ShieldCheck,
  Cpu,
  Zap,
  ExternalLink
} from 'lucide-react';
import { Card, Button, Badge, Input } from '../components/UI';

const ApiView: React.FC = () => {
  const [apiKey, setApiKey] = useState('gsp_live_8f3d9k2m4n5b1v7x0z9w8q6e4r2t1y');
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const codeExamples = {
    javascript: `// GeoSpatial Pro Node.js Client
import { GeoSpatialClient } from '@geospatial/pro-sdk';

const client = new GeoSpatialClient({
  apiKey: 'YOUR_API_KEY'
});

const result = await client.analysis.start({
  aoi: [[-74.02, 40.72], [-73.99, 40.72], ...],
  index: 'NDVI',
  timeRange: { start: '2024-01-01', end: '2024-03-01' }
});`,
    python: `# GeoSpatial Pro Python Client
from geospatial_pro import Client

client = Client(api_key='YOUR_API_KEY')

analysis = client.analysis.create(
    aoi=[[-74.02, 40.72], [-73.99, 40.72], ...],
    spectral_index='NDVI',
    date_range=('2024-01-01', '2024-03-01')
)`
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">API & Developer Hub</h1>
          <p className="text-slate-500 text-sm">Integrate satellite analysis directly into your enterprise applications.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Book className="w-4 h-4" /> Documentation
          </Button>
          <Button className="gap-2">
            <ShieldCheck className="w-4 h-4" /> Security Logs
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* API Key Management */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <Key className="w-5 h-5 text-indigo-600" />
              </div>
              <h2 className="font-bold text-slate-900">API Credentials</h2>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Main Production Key</span>
                  <Badge variant="success">Active</Badge>
                </div>
                <div className="flex gap-2">
                  <input 
                    type="password" 
                    value={apiKey} 
                    readOnly 
                    className="flex-1 bg-transparent font-mono text-sm text-slate-700 focus:outline-none" 
                  />
                  <button onClick={copyToClipboard} className="p-1.5 hover:bg-slate-200 rounded transition-colors text-slate-500">
                    {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button className="p-1.5 hover:bg-slate-200 rounded transition-colors text-slate-500">
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-slate-400 italic">
                Never share your secret API keys in public places. If compromised, rotate them immediately.
              </p>
              <Button variant="outline" size="sm">Create New Test Key</Button>
            </div>
          </Card>

          {/* Usage Monitoring */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 rounded-lg">
                  <Zap className="w-5 h-5 text-emerald-600" />
                </div>
                <h2 className="font-bold text-slate-900">Real-time Usage</h2>
              </div>
              <Badge variant="neutral">Quota: 1,000 req/min</Badge>
            </div>
            <div className="h-48 w-full bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center">
               <div className="text-center">
                 <Terminal className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                 <p className="text-slate-400 text-sm">Traffic chart will appear here as you make requests.</p>
               </div>
            </div>
          </Card>
          
          {/* Quick Start Examples */}
          <Card className="p-6">
             <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-slate-100 rounded-lg">
                  <Code className="w-5 h-5 text-slate-600" />
                </div>
                <h2 className="font-bold text-slate-900">SDK Quick Start</h2>
             </div>
             <div className="space-y-4">
                <div className="bg-slate-900 rounded-xl overflow-hidden">
                   <div className="flex border-b border-slate-800 px-4">
                      <button className="px-4 py-3 text-xs font-bold text-indigo-400 border-b-2 border-indigo-400">Node.js</button>
                      <button className="px-4 py-3 text-xs font-bold text-slate-500 hover:text-slate-300">Python</button>
                      <button className="px-4 py-3 text-xs font-bold text-slate-500 hover:text-slate-300">cURL</button>
                   </div>
                   <pre className="p-6 text-xs text-slate-300 overflow-x-auto font-mono leading-relaxed">
                      <code>{codeExamples.javascript}</code>
                   </pre>
                </div>
             </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6 bg-indigo-600 text-white border-none shadow-xl">
             <h3 className="font-bold mb-4 flex items-center gap-2">
               <ExternalLink className="w-4 h-4" />
               Developer Resources
             </h3>
             <ul className="space-y-4">
                <li>
                  <a href="#" className="flex items-center justify-between group hover:text-indigo-200 transition-colors">
                    <span className="text-sm">API Reference Guide</span>
                    <Code className="w-3 h-3 opacity-50 group-hover:translate-x-1 transition-transform" />
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center justify-between group hover:text-indigo-200 transition-colors">
                    <span className="text-sm">SDK Changelog</span>
                    <RefreshCw className="w-3 h-3 opacity-50 group-hover:rotate-180 transition-transform duration-500" />
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center justify-between group hover:text-indigo-200 transition-colors">
                    <span className="text-sm">Rate Limiting Policy</span>
                    <ShieldCheck className="w-3 h-3 opacity-50 group-hover:scale-110 transition-transform" />
                  </a>
                </li>
             </ul>
             <Button className="w-full mt-8 bg-white text-indigo-600 hover:bg-slate-100">View All Docs</Button>
          </Card>

          <Card className="p-6">
             <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
               <Cpu className="w-4 h-4 text-emerald-500" />
               Infrastructure Status
             </h3>
             <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">API Gateway</span>
                  <Badge variant="success">Operational</Badge>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Compute Workers</span>
                  <Badge variant="success">99.98% Up</Badge>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Sentinel Data Feed</span>
                  <Badge variant="success">Syncing</Badge>
                </div>
             </div>
          </Card>

          <div className="p-6 rounded-2xl bg-slate-100 border border-slate-200">
             <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Need customized API quotas or enterprise-exclusive endpoints? 
                <button className="text-indigo-600 font-bold ml-1">Contact Developer Support</button>
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiView;
