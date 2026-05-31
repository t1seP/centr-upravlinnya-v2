import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  Send, 
  User, 
  Bot, 
  ChevronRight, 
  Sparkles, 
  Zap,
  Activity,
  AlertTriangle
} from 'lucide-react';
import { Client, AgentChatMessage } from '../types';

interface AgentChatProps {
  clients: Client[];
  chatMessages: AgentChatMessage[];
  onSendMessage: (message: string, clientId?: string) => void;
  currentTheme: 'light' | 'dark';
}

export default function AgentChat({
  clients,
  chatMessages,
  onSendMessage,
  currentTheme
}: AgentChatProps) {
  const [selectedClientId, setSelectedClientId] = useState<string>('all');
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const activeClient = clients.find(c => c.id === selectedClientId);

  const handleSend = () => {
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim(), selectedClientId === 'all' ? undefined : selectedClientId);
    setInputText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickAction = (text: string) => {
    onSendMessage(text, selectedClientId === 'all' ? undefined : selectedClientId);
  };

  const quickChips = [
    "Що потребує уваги сьогодні?",
    "Поясни останнє рішення",
    "Який стан балансів?",
    "Що оптимізувати першим?"
  ];

  return (
    <div className="h-[calc(100vh-130px)] flex flex-col justify-between animate-fade-in">
      
      {/* Header Panel with Client Context Selector */}
      <div className={`p-4 rounded-lg border mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
        currentTheme === 'light' ? 'bg-white border-slate-205' : 'bg-slate-900 border-slate-800'
      }`}>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <MessageSquare size={16} className="text-indigo-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-display">
              Інтерактивний асистент управління
            </h3>
          </div>
          <span className="text-[10px] text-slate-400">
            Запитуйте AI прямо про будь-які рекламні кампаніі, аномалії чи плани погодження
          </span>
        </div>

        {/* Bind Context */}
        <div className="flex flex-col gap-1.5 justify-end min-w-48">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase text-slate-400">Контекст клієнта:</span>
            <select
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              className="p-1 px-2.5 bg-slate-100/10 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded outline-none text-xs font-semibold focus:border-indigo-500"
            >
              <option value="all">Загальний десктиск</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {activeClient && (
            <div className="flex gap-2 items-center text-[10px] bg-slate-500/5 px-2 py-0.5 rounded border border-slate-550/10 font-mono self-end">
              <span className="flex items-center gap-0.5">
                <Activity size={10} className="text-emerald-500" /> Health: <b>{activeClient.healthScore}%</b>
              </span>
              <span className="text-slate-500">•</span>
              <span className="flex items-center gap-0.5">
                <AlertTriangle size={10} className={activeClient.riskLevel === 'high' ? 'text-rose-500' : 'text-amber-500'} /> 
                Ризик: <b className="uppercase">{activeClient.riskLevel}</b>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Messages viewport */}
      <div className={`flex-1 p-5 rounded-lg border overflow-y-auto mb-4 space-y-4 ${
        currentTheme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/40 border-slate-900'
      }`}>
        {chatMessages.map((msg) => {
          const isAgent = msg.role === 'agent';
          
          return (
            <div 
              key={msg.id}
              className={`flex gap-3.5 max-w-3xl ${isAgent ? '' : 'ml-auto flex-row-reverse'}`}
            >
              <div className={`p-1.5 rounded-full h-8 w-8 flex-shrink-0 flex items-center justify-center border font-mono ${
                isAgent 
                  ? 'bg-slate-800 text-slate-200 border-slate-700' 
                  : 'bg-indigo-600 text-white border-indigo-500'
              }`}>
                {isAgent ? <Bot size={15} /> : <User size={15} />}
              </div>

              <div className="space-y-1">
                <div className={`p-3.5 rounded-lg text-xs leading-relaxed ${
                  isAgent 
                    ? (currentTheme === 'light' ? 'bg-white text-slate-800 border' : 'bg-slate-900 border border-slate-850 text-slate-100')
                    : 'bg-indigo-650 text-white font-medium'
                }`}>
                  {msg.isLoading ? (
                    <div className="flex items-center gap-1 py-1 font-semibold">
                      <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  ) : (
                    msg.content
                  )}
                </div>
                <span className={`text-[9px] font-mono text-slate-400 block ${isAgent ? 'text-left' : 'text-right'}`}>
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area + Quick Chips */}
      <div className="space-y-3">
        
        {/* Chips */}
        <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-1 max-w-full">
          {quickChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickAction(chip)}
              className={`px-3 py-1 rounded-full border text-[10px] font-medium font-sans text-left transition-all outline-none ${
                currentTheme === 'light'
                  ? 'bg-white border-slate-205 text-slate-600 hover:border-indigo-400 hover:text-indigo-600'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-indigo-500 hover:text-indigo-400'
              }`}
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input Textarea controls */}
        <div className={`p-2 rounded-lg border flex gap-3 items-end ${
          currentTheme === 'light' ? 'bg-white border-slate-205' : 'bg-slate-905 border-slate-850'
        }`}>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={2}
            placeholder="Запитай про клієнта, кампанію або рішення..."
            className="flex-1 bg-transparent p-1 px-2.5 outline-none resize-none border-none text-xs focus:ring-0 text-slate-900 dark:text-slate-100 leading-relaxed max-h-24"
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="p-2 px-3 bg-indigo-650 hover:bg-indigo-750 disabled:bg-slate-850 disabled:text-slate-550 text-white font-bold rounded flex items-center gap-1 outline-none text-xs transition"
          >
            <Send size={12} /> Надіслати
          </button>
        </div>

      </div>

    </div>
  );
}
