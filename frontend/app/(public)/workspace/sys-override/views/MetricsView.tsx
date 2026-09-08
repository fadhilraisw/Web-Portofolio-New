import { glassBase } from '../page';

export default function MetricsView() {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`${glassBase} bg-rose-500/10 p-0 overflow-hidden`}>
          <div className="p-4 border-b-2 border-white/10 bg-white/5 flex justify-between items-center"><span className="font-mono text-[10px] text-rose-400 uppercase">MEDICAL CLEARANCE</span><button className="font-mono text-[10px] text-white/50 hover:text-white">+</button></div>
          <div className="p-4 flex flex-col gap-3 font-mono text-[10px] uppercase text-white/70"><div className="flex justify-between"><span>STATUS</span><span className="text-green-400">FIT FOR DUTY</span></div></div>
        </div>
        <div className={`${glassBase} bg-teal-500/10 p-0 overflow-hidden`}>
          <div className="p-4 border-b-2 border-white/10 bg-white/5 flex justify-between items-center"><span className="font-mono text-[10px] text-teal-400 uppercase">DEPLOYMENT PROTOCOLS</span><button className="font-mono text-[10px] text-white/50 hover:text-white">+</button></div>
          <div className="p-4 flex flex-col gap-3 font-mono text-[10px] uppercase text-white"><div className="flex justify-between"><span>AI ENGINEER</span><span className="text-rose-400 cursor-pointer">DEL</span></div></div>
        </div>
        <div className={`${glassBase} bg-orange-500/10 p-0 overflow-hidden`}>
          <div className="p-4 border-b-2 border-white/10 bg-white/5 flex justify-between items-center"><span className="font-mono text-[10px] text-orange-400 uppercase">BEHAVIORAL METRICS</span><button className="font-mono text-[10px] text-white/50 hover:text-white">+</button></div>
          <div className="p-4 flex flex-col gap-3 font-mono text-[10px] uppercase text-white"><div className="flex justify-between"><span>AGILE PROBLEM SOLVING</span><span className="text-rose-400 cursor-pointer">DEL</span></div></div>
        </div>
      </div>
    </div>
  );
}