import { useState } from 'react';
import { glassBase, glassButton } from '../page';

const CHART_LIBRARY = [
  { id: 'BAR', label: 'BAR CHART (HORIZONTAL/VERTICAL)' },
  { id: 'PIE', label: 'PIE / DONUT CHART' },
  { id: 'RADAR', label: 'RADAR / SPIDER WEB' },
  { id: 'WAFFLE', label: 'WAFFLE / DOT MATRIX' }
];

export default function VisualsView() {
  const [selectedBuilderChart, setSelectedBuilderChart] = useState('BAR');
  const [isUploadingExcel, setIsUploadingExcel] = useState(false);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <div className={`${glassBase} bg-cyan-500/10 p-0 overflow-hidden border-l-4 border-cyan-400`}>
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
          <div>
            <h3 className="font-mono text-sm tracking-[0.2em] text-cyan-400 uppercase mb-1">TABLEAU-MODE: VISUALIZATION BUILDER</h3>
            <p className="font-mono text-[9px] text-white/50 uppercase">SELECT CHART. INJECT MANUALLY OR UPLOAD .XLSX TO AUTOGENERATE.</p>
          </div>
          <button className={`${glassButton} bg-cyan-500 text-black hover:bg-white hover:text-black`}>PUBLISH TO DASHBOARD</button>
        </div>
        <div className="flex flex-col lg:flex-row min-h-[400px]">
          <div className="w-full lg:w-1/3 border-r border-white/10 bg-black/20 p-4 overflow-y-auto max-h-[400px] custom-scrollbar">
            <p className="font-mono text-[9px] text-white/40 uppercase mb-4 tracking-widest">CHART REPOSITORY</p>
            <div className="flex flex-col gap-2">
              {CHART_LIBRARY.map(chart => (
                <button key={chart.id} onClick={() => setSelectedBuilderChart(chart.id)} className={`font-mono text-[10px] text-left px-3 py-2 uppercase transition-colors ${selectedBuilderChart === chart.id ? 'bg-cyan-500/30 text-cyan-300 border-l-2 border-cyan-400' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}>{chart.label}</button>
              ))}
            </div>
          </div>
          <div className="w-full lg:w-2/3 p-6 bg-white/5 flex flex-col">
            <div className="flex justify-between items-end mb-6 border-b border-white/10 pb-4">
              <div>
                <p className="font-mono text-[10px] text-cyan-400 uppercase tracking-widest mb-1">ACTIVE: {CHART_LIBRARY.find(c => c.id === selectedBuilderChart)?.label}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setIsUploadingExcel(!isUploadingExcel)} className={`${glassButton} bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500 hover:text-black px-3 py-2`}>
                  {isUploadingExcel ? 'CANCEL UPLOAD' : 'IMPORT .XLSX / .CSV'}
                </button>
                <button className="font-mono text-[9px] text-white hover:text-cyan-400 bg-white/5 px-3 py-2 border border-white/10">+ ADD ROW</button>
              </div>
            </div>
            {isUploadingExcel ? (
              <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-emerald-500/30 bg-emerald-500/5 p-6 hover:bg-emerald-500/10 transition-colors cursor-pointer group relative">
                <div className="w-12 h-12 bg-emerald-500/20 mb-4 flex items-center justify-center text-emerald-400 font-mono font-bold group-hover:scale-110 transition-transform">XLS</div>
                <p className="font-mono text-xs text-emerald-400 uppercase tracking-widest mb-2">DROP SPREADSHEET HERE</p>
                <input type="file" accept=".xlsx, .xls, .csv" className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-12 gap-2 border-b border-white/10 pb-2 mb-2 font-mono text-[9px] text-white/50 uppercase"><div className="col-span-4">DATA LABEL</div><div className="col-span-3">VALUE</div><div className="col-span-3">COLOR (HEX)</div><div className="col-span-2 text-right">ACTION</div></div>
                {[1, 2, 3].map((row) => (
                  <div key={row} className="grid grid-cols-12 gap-2 mb-2">
                    <input type="text" placeholder="e.g. Next.js" className="col-span-4 bg-black/40 border border-white/10 px-2 py-1.5 font-mono text-[10px] text-white outline-none" />
                    <input type="number" placeholder="e.g. 95" className="col-span-3 bg-black/40 border border-white/10 px-2 py-1.5 font-mono text-[10px] text-white outline-none" />
                    <input type="text" placeholder="#00e5ff" className="col-span-3 bg-black/40 border border-white/10 px-2 py-1.5 font-mono text-[10px] text-white outline-none" />
                    <div className="col-span-2 flex justify-end items-center"><button className="text-rose-500 text-[10px] font-mono">DEL</button></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}