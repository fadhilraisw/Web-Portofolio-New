'use client';

import { useEffect, useState } from 'react';
import { glassBase, glassButton } from '../page';

type Message = { role: 'user' | 'assistant'; content: string };

export default function AiCortexView() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'CORTEX ONLINE. ASK FOR A PORTFOLIO RECOMMENDATION, VISITOR MATCH, OR DATA SUMMARY.' }
  ]);
  const [prompt, setPrompt] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('You are the portfolio recommendation assistant. Read the portfolio data and give concise, evidence-based recommendations.');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const api = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5555';

  const sendMessage = async (event: React.FormEvent) => {
    event.preventDefault();
    const content = prompt.trim();
    if (!content || isLoading) return;
    setPrompt('');
    setError('');
    setMessages((current) => [...current, { role: 'user', content }]);
    setIsLoading(true);
    try {
      const response = await fetch(`${api}/api/ai-cortex/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          systemPrompt,
          visitor: JSON.parse(localStorage.getItem('visitor_profile') || '{}')
        })
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || 'Cortex request failed');
      setMessages((current) => [...current, { role: 'assistant', content: result.data.recommendation }]);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Cortex request failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 min-h-[600px]">
      <div className={`${glassBase} bg-purple-500/10 p-6`}>
        <h3 className="font-mono text-[10px] tracking-[0.2em] text-purple-400 uppercase mb-2">AI CORTEX CHATBOT</h3>
        <p className="font-mono text-[9px] text-white/50 uppercase">ASK THE CORTEX TO READ YOUR PORTFOLIO DATA AND RECOMMEND THE RIGHT PROJECTS OR CV POSITIONING.</p>
        <textarea value={systemPrompt} onChange={(event) => setSystemPrompt(event.target.value)} rows={2} className="mt-4 w-full bg-black/40 border border-purple-500/30 p-3 font-mono text-[10px] text-white/80 outline-none focus:border-purple-400" />
      </div>
      <div className={`${glassBase} bg-black/60 p-6 flex-1 flex flex-col`}>
        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-4">
          {messages.map((message, index) => (
            <div key={`${message.role}-${index}`} className={`max-w-[90%] p-4 font-mono text-xs uppercase ${message.role === 'assistant' ? 'self-start bg-purple-900/30 border border-purple-500/30 text-white/80' : 'self-end bg-cyan-900/20 border border-cyan-500/30 text-cyan-100'}`}>
              <span className="block mb-2 text-[8px] tracking-widest opacity-60">{message.role === 'assistant' ? 'CORTEX' : 'ADMIN'}</span>
              {message.content}
            </div>
          ))}
          {isLoading && <div className="text-purple-400 font-mono text-[10px] animate-pulse">CORTEX IS READING PORTFOLIO DATA...</div>}
          {error && <div className="text-rose-400 font-mono text-[10px] uppercase">{error}</div>}
        </div>
        <form onSubmit={sendMessage} className="mt-6 flex gap-3">
          <input value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="ASK FOR A RECOMMENDATION..." className="flex-1 bg-white/5 border border-white/10 px-4 py-3 font-mono text-xs text-white outline-none focus:border-purple-400" />
          <button className={`${glassButton} bg-purple-500/20 text-purple-300`}>SEND</button>
        </form>
      </div>
    </div>
  );
}
