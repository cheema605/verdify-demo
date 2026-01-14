
import React, { useState } from 'react';
import { AppView } from './types';
import Sidebar from './components/Sidebar';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import NewAnalysisWizard from './pages/NewAnalysisWizard';
import ProcessingScreen from './pages/ProcessingScreen';
import ResultsView from './pages/ResultsView';
import HistoryView from './pages/HistoryView';
import ApiView from './pages/ApiView';
import { Bell, Search, Settings, HelpCircle } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setView] = useState<AppView>(AppView.AUTH);
  const [selectedGeoJSON, setSelectedGeoJSON] = useState<GeoJSON.Feature | null>(null);

  // Layout wrapper for authenticated views
  const renderLayout = (content: React.ReactNode) => (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar currentView={currentView} setView={setView} />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-8 shrink-0 z-10">
          <div className="relative w-96 max-w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search Verdify (⌘K)"
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/5 transition-all"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-colors relative group">
              <Bell className="w-5 h-5 group-hover:text-slate-900 transition-colors" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-colors group">
              <HelpCircle className="w-5 h-5 group-hover:text-slate-900 transition-colors" />
            </button>
            <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-colors group">
              <Settings className="w-5 h-5 group-hover:text-slate-900 transition-colors" />
            </button>
          </div>
        </header>
        {/* Main Content Area - Padding removed to allow full-page views like Results */}
        <main className="flex-1 overflow-hidden relative">
          {content}
        </main>
      </div>
    </div>
  );

  // Switcher for views
  switch (currentView) {
    case AppView.AUTH:
      return <Auth onLogin={() => setView(AppView.DASHBOARD)} />;
    case AppView.DASHBOARD:
      return renderLayout(
        <div className="p-8 h-full overflow-y-auto custom-scrollbar">
          <Dashboard onNewAnalysis={() => setView(AppView.WIZARD)} onViewProject={() => setView(AppView.RESULTS)} />
        </div>
      );
    case AppView.WIZARD:
      return <NewAnalysisWizard onCancel={() => setView(AppView.DASHBOARD)} onStart={(geojson) => {
        setSelectedGeoJSON(geojson);
        setView(AppView.PROCESSING);
      }} />;
    case AppView.PROCESSING:
      return <ProcessingScreen initialGeoJSON={selectedGeoJSON} onFinish={() => setView(AppView.RESULTS)} />;
    case AppView.RESULTS:
      return renderLayout(<ResultsView onBack={() => setView(AppView.DASHBOARD)} />);
    case AppView.HISTORY:
      return renderLayout(
        <div className="p-8 h-full overflow-y-auto custom-scrollbar">
          <HistoryView />
        </div>
      );
    case AppView.API:
      return renderLayout(
        <div className="p-8 h-full overflow-y-auto custom-scrollbar">
          <ApiView />
        </div>
      );
    default:
      return <Auth onLogin={() => setView(AppView.DASHBOARD)} />;
  }
};

export default App;
