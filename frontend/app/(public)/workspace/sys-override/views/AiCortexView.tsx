import { glassBase, glassButton } from '../page';

export default function AiCortexView() {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 h-[600px]">
      <div className={`${glassBase} bg-purple-500/10 p-6 flex-1 relative overflow-hidden flex flex-col justify-between`}>
        <div className="flex justify-between items-center mb-4 border-b border-purple-500/20 pb-4"><div><h3 className="font-mono text-[10px] tracking-[0.2em] text-purple-400 uppercase">AI ANALYTICS ENGINE</h3></div></div>
        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-6 p-2">
          <div className="flex flex-col gap-1 items-start"><span className="font-mono text-[8px] text-purple-400">AI CORTEX</span><div className="bg-purple-900/20 border border-purple-500/30 p-4 text-white/80 font-mono text-xs max-w-[80%] uppercase">SISTEM SIAP MENERIMA PERINTAH MANIPULASI DASHBOARD ATAU ANALISA DATA.</div></div>
        </div>
        <div className="mt-4 flex gap-4"><input type="text" placeholder="ASK AI CORTEX..." className="flex-1 bg-white/5 border border-white/10 px-4 py-3 font-mono text-white text-xs outline-none focus:border-purple-500 transition-colors rounded-none uppercase"/><button className={`${glassButton} bg-white/10 text-white hover:bg-white hover:text-black`}>EXECUTE</button></div>
      </div>
    </div>
  );
}