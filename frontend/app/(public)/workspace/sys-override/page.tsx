'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import VisualsView from './views/VisualsView';
import MetricsView from './views/MetricsView';
import DashboardCmsView from './views/DashboardCmsView';
import TrackerView from './views/TrackerView';
import TelemetryView from './views/TelemetryView';
import AiCortexView from './views/AiCortexView';
import AssetsView from './views/AssetsView';
import ProjectsView from './views/ProjectsView';
import SecurityView from './views/SecurityView';

const ADMIN_MODULES = [
  { id: 'projects', label: 'COMMAND CENTER (PROJECTS)' },
  { id: 'dashboard_cms', label: 'DASHBOARD ENGINE (TEXT & TIMELINE)' },
  { id: 'visuals', label: 'VISUALIZATIONS & MAP (DATA)' },
  { id: 'metrics', label: 'MCU & BEHAVIORAL METRICS' },
  { id: 'tracker', label: 'LOGISTICS & TRACKING' },
  { id: 'telemetry', label: 'TELEMETRY & LOGS' },
  { id: 'ai_cortex', label: 'AI CORTEX (STRATEGY)' },
  { id: 'assets', label: 'ASSET & RESUME MASTER' },
  { id: 'security', label: 'SECURITY CONTROLS' }
];

export const glassBase = "flex flex-col rounded-none border border-white/10 bg-white/5 shadow-[inset_1.5px_1.5px_2px_rgba(255,255,255,0.2),inset_-1.5px_-1.5px_3px_rgba(0,0,0,0.5),10px_10px_20px_rgba(0,0,0,0.8)] backdrop-blur-xl transition-all";
export const glassButton = "px-4 py-3 rounded-none border border-white/10 bg-white/5 shadow-[inset_1.5px_1.5px_2px_rgba(255,255,255,0.2),inset_-1px_-1px_3px_rgba(0,0,0,0.5),5px_5px_15px_rgba(0,0,0,0.8)] hover:shadow-[inset_2px_2px_3px_rgba(255,255,255,0.4),inset_-2px_-2px_4px_rgba(0,0,0,0.7),10px_10px_25px_rgba(0,0,0,0.9)] hover:-translate-y-1 hover:bg-white/10 backdrop-blur-md transition-all font-mono text-[10px] tracking-widest uppercase cursor-pointer text-white";

export default function AdminPanel() {
  const [activeModule, setActiveModule] = useState('projects'); 
  const router = useRouter();

  const navBaseClass = "font-mono text-[10px] tracking-widest text-left px-4 py-3 uppercase transition-all rounded-none border border-transparent";
  const navActiveClass = "bg-cyan-500/20 text-cyan-400 border-cyan-500/50 shadow-[inset_1px_1px_2px_rgba(6,182,212,0.3),inset_-1px_-1px_2px_rgba(0,0,0,0.4)]";
  const navInactiveClass = "text-white/40 hover:text-white hover:bg-white/10 hover:border-white/20";

  const handleLogout = () => {
    document.cookie = "admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push('/admin');
  };

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'visuals': return <VisualsView />;
      case 'metrics': return <MetricsView />;
      case 'dashboard_cms': return <DashboardCmsView />;
      case 'tracker': return <TrackerView />;
      case 'telemetry': return <TelemetryView />;
      case 'ai_cortex': return <AiCortexView />;
      case 'assets': return <AssetsView />;
      case 'projects': return <ProjectsView />;
      case 'security': return <SecurityView />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-8 flex gap-6 text-white overflow-hidden relative">
      <div className="absolute inset-0 z-0">
        <Image src="/assets/images/admin-bg.jpg" alt="Admin Wallpaper" fill className="object-cover object-center" priority />
        <div className="absolute inset-0 bg-[#050505]/80 backdrop-blur-[4px]"></div>
      </div>

      <aside className={`${glassBase} w-72 p-6 z-10 shrink-0 h-[calc(100vh-4rem)] justify-between`}>
        <div>
          <div className="mb-10 flex flex-col gap-1 border-b-2 border-rose-500/30 pb-6 shadow-[0_2px_0_rgba(255,255,255,0.05)]">
            <h1 className="font-mono text-lg tracking-[0.3em] text-rose-500 uppercase animate-pulse drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]">SYS-OVERRIDE</h1>
            <p className="font-mono text-[8px] tracking-[0.4em] text-white/40 uppercase">ADMINISTRATIVE ACCESS ONLY</p>
          </div>
          <nav className="flex flex-col gap-3 overflow-y-auto max-h-[60vh] custom-scrollbar pr-2">
            {ADMIN_MODULES.map((mod) => (
              <button key={mod.id} onClick={() => setActiveModule(mod.id)} className={`${navBaseClass} ${activeModule === mod.id ? navActiveClass : navInactiveClass}`}>
                {mod.label}
              </button>
            ))}
          </nav>
        </div>
        <button onClick={handleLogout} className={`${glassButton} !text-rose-400 hover:!text-rose-200 hover:!bg-rose-900/40 hover:!border-rose-500/50 w-full mt-10`}>
          TERMINATE SESSION
        </button>
      </aside>

      <main className="flex-1 flex flex-col h-[calc(100vh-4rem)] z-10">
        <header className="mb-6 flex items-center justify-between">
          <h2 className="font-mono text-xl tracking-widest text-cyan-400 uppercase drop-shadow-[0_0_5px_rgba(6,182,212,0.4)]">
            {ADMIN_MODULES.find(m => m.id === activeModule)?.label}
          </h2>
          <div className="flex items-center gap-4">
            <div className="h-2 w-2 rounded-none bg-emerald-500 animate-pulse shadow-[0_0_8px_emerald]"></div>
            <span className="font-mono text-[10px] tracking-widest text-white/50 uppercase">SYSTEM ONLINE</span>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 pb-10">
          {renderActiveModule()}
        </div>
      </main>
    </div>
  );
}