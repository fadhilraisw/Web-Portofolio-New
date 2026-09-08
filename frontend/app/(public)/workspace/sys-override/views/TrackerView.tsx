import { glassBase, glassButton } from '../page';

export default function TrackerView() {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`${glassBase} bg-indigo-500/10 p-0 overflow-hidden min-h-[400px]`}>
          <div className="p-4 border-b-2 border-white/10 bg-white/5 flex justify-between items-center"><span className="font-mono text-[10px] text-indigo-400 uppercase">JOB APPLICATIONS SENT</span><button className="font-mono text-[10px] text-white/50 hover:text-white">+</button></div>
          <div className="p-4 flex flex-col gap-3">
            <div className="flex justify-between items-center p-3 bg-white/5 hover:bg-white/10 group cursor-pointer transition-colors border border-transparent hover:border-white/10"><div className="font-mono flex flex-col"><span className="text-xs text-white uppercase">GOJEK</span><span className="text-[9px] text-white/50 uppercase">JR DATA ENGINEER</span></div><span className="font-mono text-[9px] uppercase text-amber-400">INTERVIEW</span></div>
          </div>
        </div>
        <div className={`${glassBase} bg-emerald-500/10 p-0 overflow-hidden min-h-[400px]`}>
          <div className="p-4 border-b-2 border-white/10 bg-white/5 flex justify-between items-center"><span className="font-mono text-[10px] text-emerald-400 uppercase">FREELANCE TASKS</span><button className="font-mono text-[10px] text-white/50 hover:text-white">+</button></div>
          <div className="p-4 flex flex-col gap-3">
            <div className="flex justify-between items-center p-3 bg-white/5 border border-transparent hover:border-white/10"><div className="font-mono flex flex-col"><span className="text-xs text-white uppercase">SYS-DASHBOARD</span><span className="text-[9px] text-white/50 uppercase">CLIENT: INTERNAL</span></div><span className="font-mono text-[9px] uppercase text-emerald-400">IN PROGRESS</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}