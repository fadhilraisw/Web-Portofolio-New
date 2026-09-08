import { useState, useRef, useEffect } from 'react';

export function SidebarRight({ collapsed, setCollapsed, visitor }: any) {
  const [history, setHistory] = useState([
    { sender: 'sys', text: 'CONNECTION ESTABLISHED.' },
    { sender: 'sys', text: `HELLO ${visitor.name?.toUpperCase() || 'USER'}. I AM READY TO PROVIDE CONTEXT. TYPE "HELP" FOR COMMANDS.` }
  ]);
  const [inputValue, setInputValue] = useState('');
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  // Auto-scroll ke bawah saat ada pesan baru
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      const cmd = inputValue.toUpperCase().trim();
      const newHistory = [...history, { sender: 'user', text: `> ${cmd}` }];
      
      setInputValue(''); // Reset input

      // Logika AI sederhana (Bisa disambung ke API OpenAI nanti)
      setTimeout(() => {
        let response = '';
        if (cmd === 'HELP') {
          response = 'AVAILABLE COMMANDS: HELP, WHOAMI, STACK, EXPORT_CV';
        } else if (cmd === 'WHOAMI') {
          response = 'RAIS IS A 21-YEAR-OLD DEV FROM CCIT FTUI. RUN "WHOAMI --PERSONAL" FOR CLASSIFIED INTEL.';
        } else if (cmd === 'WHOAMI --PERSONAL') {
          // EASTER EGG!
          response = 'CLASSIFIED INTEL: RAIS EXCLUDES SEAFOOD FROM HIS DIET, TRACKS MACROS IN EXCEL, PLAYS THE STRATOCASTER, AND RUNS ON ICED COFFEE.';
        } else if (cmd === 'STACK') {
          response = 'PRIMARY DIRECTIVES: PYTHON, NEXT.JS, TYPESCRIPT, MONGODB, FLASK, MACHINE LEARNING.';
        } else if (cmd === 'EXPORT_CV' || cmd === 'RESUME') {
          response = 'GENERATING PDF EXPORT... PLEASE USE THE MAIN DASHBOARD TO FINALIZE DOWNLOAD.';
        } else {
          response = `COMMAND NOT RECOGNIZED: ${cmd}. TYPE "HELP" FOR LIST OF DIRECTIVES.`;
        }
        setHistory((prev) => [...prev, { sender: 'sys', text: response }]);
      }, 400); // Simulasi delay berpikir AI
    }
  };

  return (
    <aside className={`flex h-full flex-col rounded-xl border border-white/5 bg-white/5 shadow-2xl backdrop-blur-md transition-all duration-500 ease-in-out ${collapsed ? 'w-16 items-center px-2 py-6' : 'w-80 p-6'} hidden lg:flex`}>
      <div className="mb-6 flex w-full items-center justify-between border-b border-white/5 pb-4">
        <button onClick={() => setCollapsed(!collapsed)} className="text-white/40 hover:text-white focus:outline-none transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" /></svg>
        </button>
        
        {!collapsed && (
          <div className="flex items-center gap-4">
            <div className="grid grid-cols-6 gap-[2px]">
              {Array.from({ length: 36 }).map((_, i) => {
                const isLit = [0, 5, 7, 10, 14, 15, 20, 21, 25, 29, 30, 35].includes(i);
                return <div key={i} className={`h-[2px] w-[2px] rounded-[1px] ${isLit ? 'bg-white shadow-[0_0_2px_rgba(255,255,255,1)]' : 'bg-white/10'}`} />;
              })}
            </div>
            <h3 className="font-mono text-xs tracking-[0.2em] text-white uppercase">AI TERMINAL</h3>
          </div>
        )}
      </div>

      {!collapsed && (
        <>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="flex flex-col gap-3 font-mono text-[10px] tracking-widest leading-relaxed uppercase">
              {history.map((msg, index) => (
                <div key={index} className={msg.sender === 'user' ? 'text-white/40' : 'text-white/80'}>
                  {msg.text}
                </div>
              ))}
              <div ref={endOfMessagesRef} />
            </div>
          </div>
          <div className="mt-4 border-t border-white/5 pt-4">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleCommand}
              placeholder="QUERY SYSTEM" 
              className="w-full bg-transparent py-2 font-mono text-[10px] tracking-[0.2em] text-white transition-colors focus:outline-none placeholder:text-white/20 uppercase"
            />
          </div>
        </>
      )}
    </aside>
  );
}