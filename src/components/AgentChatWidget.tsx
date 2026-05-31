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
  AlertTriangle,
  X,
  Minus
} from 'lucide-react';
import { Client, AgentChatMessage } from '../types';

interface AgentChatWidgetProps {
  clients: Client[];
  chatMessages: AgentChatMessage[];
  onSendMessage: (message: string, clientId?: string) => void;
  currentTheme: 'light' | 'dark';
  isOpen: boolean;
  onClose: () => void;
}

export default function AgentChatWidget({
  clients,
  chatMessages,
  onSendMessage,
  currentTheme,
  isOpen,
  onClose
}: AgentChatWidgetProps) {
  const [selectedClientId, setSelectedClientId] = useState<string>('all');
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll when new messages arrive or when widget is opened
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isOpen]);

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
    "Що потребує уваги?",
    "Поясни рішення",
    "Стан балансів?",
    "Що оптимізувати?"
  ];

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed bottom-24 right-6 z-50 w-[380px] h-[520px] rounded-2xl shadow-2xl flex flex-col border transition-all duration-200 overflow-hidden animate-fade-in ${
        currentTheme === 'light' 
          ? 'bg-white border-slate-200 text-slate-800' 
          : 'bg-slate-950 border-slate-800 text-slate-100'
      }`}
    >
      {/* Header */}
      <div className={`p-3.5 border-b flex items-center justify-between gap-3 ${
        currentTheme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-850'
      }`}>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <div className="space-y-0.5">
            <h3 className="text-xs font-bold uppercase tracking-wider font-display flex items-center gap-1">
              <Bot size={13} className="text-indigo-500" />
              Асистент LIVE
            </h3>
          </div>
        </div>

        {/* Action controls & selector */}
        <div className="flex items-center gap-1.5">
          <select
            value={selectedClientId}
            onChange={(e) => setSelectedClientId(e.target.value)}
            className="p-1 px-1.5 bg-slate-100/10 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded outline-none text-[11px] font-semibold focus:border-indigo-500 max-w-28 truncate"
          >
            <option value="all">Загальний деск</option>
            {clients.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <button 
            onClick={onClose}
            className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            title="Закрити"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* Under-header client mini analytics */}
      {activeClient && (
        <div className={`px-3 py-1 flex items-center justify-between text-[10px] font-mono border-b ${
          currentTheme === 'light' ? 'bg-indigo-50/30 border-slate-100 text-slate-500' : 'bg-slate-900/40 border-slate-850 text-slate-400'
        }`}>
          <span className="flex items-center gap-0.5">
            <Activity size={10} className="text-emerald-500" /> Score: <b className="text-emerald-400">{activeClient.healthScore}%</b>
          </span>
          <span className="flex items-center gap-0.5">
            <AlertTriangle size={10} className={activeClient.riskLevel === 'high' ? 'text-rose-500' : 'text-amber-500'} /> 
            Ризик: <b className="uppercase">{activeClient.riskLevel}</b>
          </span>
        </div>
      )}

      {/* Messages viewport */}
      <div className={`flex-1 p-4 overflow-y-auto space-y-3 ${
        currentTheme === 'light' ? 'bg-slate-50/50' : 'bg-slate-950/20'
      }`}>
        {chatMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-5 text-slate-500 space-y-2">
            <Bot size={36} className="text-slate-600 animate-bounce" />
            <p className="text-xs leading-relaxed max-w-[240px]">
              Вітаю! Я ваш інтелектуальний LIVE асистент. Запитайте мене про будь-яку з компаній чи баланси.
            </p>
          </div>
        ) : (
          chatMessages.map((msg) => {
            const isAgent = msg.role === 'agent';
            return (
              <div 
                key={msg.id}
                className={`flex gap-2.5 max-w-[90%] ${isAgent ? '' : 'ml-auto flex-row-reverse'}`}
              >
                <div className={`p-1 rounded-full h-6 w-6 flex-shrink-0 flex items-center justify-center border font-mono text-[10px] ${
                  isAgent 
                    ? 'bg-slate-800 text-slate-200 border-slate-700' 
                    : 'bg-indigo-600 text-white border-indigo-500'
                }`}>
                  {isAgent ? <Bot size={12} /> : <User size={12} />}
                </div>

                <div className="space-y-0.5 max-w-[85%]">
                  <div className={`p-3 rounded-xl text-xs leading-relaxed break-words ${
                    isAgent 
                      ? (currentTheme === 'light' ? 'bg-white text-slate-800 border shadow-sm' : 'bg-slate-905 border border-slate-850 text-slate-100')
                      : 'bg-indigo-650 text-white font-medium'
                  }`}>
                    {msg.isLoading ? (
                      <div className="flex items-center gap-1 py-1 font-semibold">
                        <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    ) : (
                      msg.content
                    )}
                  </div>
                  <span className={`text-[8px] font-mono text-slate-500 block ${isAgent ? 'text-left' : 'text-right'}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input section & Quick chips */}
      <div className={`p-3 border-t space-y-2 ${
        currentTheme === 'light' ? 'bg-white border-slate-150' : 'bg-slate-950 border-slate-850'
      }`}>
        
        {/* Quick actions slider horizontal */}
        <div className="flex gap-1 overflow-x-auto no-scrollbar pb-1 max-w-full">
          {quickChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickAction(chip)}
              className={`px-2.5 py-0.5 rounded-full border text-[9px] font-medium whitespace-nowrap outline-none transition-all ${
                currentTheme === 'light'
                  ? 'bg-slate-50 border-slate-200 text-slate-600 hover:border-indigo-400 hover:text-indigo-600'
                  : 'bg-slate-900 border-slate-805 text-slate-350 hover:border-indigo-500 hover:text-indigo-400'
              }`}
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input box */}
        <div className={`p-1.5 rounded-xl border flex gap-2 items-end ${
          currentTheme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-800'
        }`}>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Напишіть своє питання тут..."
            className="flex-1 bg-transparent p-1 px-1.5 outline-none resize-none border-none text-xs focus:ring-0 text-slate-900 dark:text-slate-100 leading-normal max-h-16"
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="p-1.5 bg-indigo-650 hover:bg-indigo-750 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-lg flex items-center justify-center transition-colors outline-none"
            title="Надіслати"
          >
            <Send size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
