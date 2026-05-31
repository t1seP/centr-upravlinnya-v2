import React, { useState } from 'react';
import { 
  FileCheck, 
  Play, 
  Terminal, 
  AlertTriangle, 
  Check, 
  Clock, 
  ChevronRight,
  Code2
} from 'lucide-react';
import { AutomationScript } from '../types';

interface AutomationsProps {
  scripts: AutomationScript[];
  onTriggerScript: (id: string) => void;
  isRunningScriptId: string | null;
  currentTheme: 'light' | 'dark';
  onAddDecisionLog: (msg: string, level: 'info' | 'success' | 'warning' | 'critical') => void;
}

export default function Automations({
  scripts,
  onTriggerScript,
  isRunningScriptId,
  currentTheme,
  onAddDecisionLog
}: AutomationsProps) {
  
  const [selectedScriptId, setSelectedScriptId] = useState<string>(scripts[0]?.id || 'scr-1');
  const activeScript = scripts.find(s => s.id === selectedScriptId) || scripts[0];

  const scriptColors: Record<string, string> = {
    active: 'bg-emerald-500',
    warning: 'bg-amber-400',
    failed: 'bg-rose-500',
    idle: 'bg-slate-400'
  };

  const handleManualRunTrigger = (id: string) => {
    onTriggerScript(id);
    const scrName = scripts.find(s => s.id === id)?.filename || 'script.py';
    onAddDecisionLog(`Автоматизатор: Запущено ручний тест-консольного скрипту ${scrName} з верифікованої панелі.`, 'info');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Script layout container: list left, code preview right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Scripts list sidebar */}
        <div className={`p-5 rounded-lg border lg:col-span-1 space-y-4 h-fit ${
          currentTheme === 'light' ? 'bg-white border-slate-205' : 'bg-slate-900 border-slate-800'
        }`}>
          <div className="pb-3 border-b border-slate-800/10">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-display">
              Ядро автоматизацій .py
            </h4>
            <p className="text-[10px] text-slate-400">Спеціалізовані Python-скрипти на серверному утриманні</p>
          </div>

          <div className="space-y-2">
            {scripts.map((script) => (
              <div
                key={script.id}
                onClick={() => setSelectedScriptId(script.id)}
                className={`p-3 rounded border text-xs cursor-pointer transition flex items-center justify-between gap-3 ${
                  selectedScriptId === script.id
                    ? 'border-indigo-500 bg-indigo-500/5'
                    : 'border-slate-800/20 hover:bg-slate-850/30'
                }`}
              >
                <div className="space-y-1">
                  <span className="font-mono font-bold text-slate-850 dark:text-slate-100 flex items-center gap-1.5 text-xs">
                    <span className={`w-2 h-2 rounded-full ${scriptColors[script.status]}`} />
                    {script.filename}
                  </span>
                  <p className="text-[10px] text-slate-400 font-sans truncate max-w-40">{script.name}</p>
                </div>

                <div className="text-right">
                  <span className={`px-1 text-[8px] font-mono rounded ${
                    script.status === 'failed' ? 'bg-rose-500/10 text-rose-500' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {script.status}
                  </span>
                  <ChevronRight size={12} className="text-slate-500 ml-auto block mt-1" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Script code & state detail card */}
        <div className={`p-5 rounded-lg border lg:col-span-2 space-y-4 ${
          currentTheme === 'light' ? 'bg-white border-slate-205' : 'bg-slate-900 border-slate-800'
        }`}>
          <div className="pb-3 border-b border-slate-800/10 flex justify-between items-center bg-slate-950/20 px-4 py-2.5 -mx-5 -mt-5 rounded-t-lg">
            <div>
              <span className="text-[9px] font-mono text-indigo-400 uppercase tracking-wider">Файл конфігуратора</span>
              <h3 className="text-sm font-bold font-mono text-slate-900 dark:text-slate-100 mt-0.5">{activeScript.filename}</h3>
            </div>
            
            <button
              onClick={() => handleManualRunTrigger(activeScript.id)}
              disabled={isRunningScriptId !== null}
              className={`px-3 py-1.5 rounded font-bold text-xs font-mono inline-flex items-center gap-1 cursor-pointer transition ${
                isRunningScriptId === activeScript.id
                  ? 'bg-amber-500/20 text-amber-500 animate-pulse'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              {isRunningScriptId === activeScript.id ? (
                <span>ПРАЦЮЄ...</span>
              ) : (
                <>
                  <Play size={11} /> <span>ТЕСТ РУН</span>
                </>
              )}
            </button>
          </div>

          <div className="space-y-3 font-sans text-xs">
            {/* Meta values */}
            <div className="grid grid-cols-2 gap-4 bg-slate-950/20 p-3 rounded">
              <div>
                <span className="text-slate-400 text-[9px] uppercase font-mono block">Останній запуск (UTC)</span>
                <span className="font-mono font-medium text-slate-850 dark:text-slate-100">{activeScript.lastRun}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[9px] uppercase font-mono block">Наступний запуск</span>
                <span className="font-mono font-medium text-slate-850 dark:text-slate-100">{activeScript.nextRun}</span>
              </div>
            </div>

            {/* Run Output */}
            <div className="space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-mono block">Консольний результат (Stderr/stdout)</span>
              <div className="p-3 bg-[#0f172a] text-[#38bdf8] border border-slate-800 rounded font-mono text-[10.5px] leading-relaxed max-h-24 overflow-y-auto">
                {isRunningScriptId === activeScript.id ? (
                  <span className="animate-pulse">INFO: Initiating simulation layer... connecting Google Ads SDK client... parsing...</span>
                ) : (
                  <span>{activeScript.resultMessage}</span>
                )}
              </div>
            </div>

            {/* Code Snippet */}
            <div className="space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-mono block flex items-center gap-1">
                <Code2 size={13} /> Серверний код (Python SDK)
              </span>
              <pre className="p-4 bg-slate-955 text-slate-300 border border-slate-805/40 rounded font-mono text-[10px] overflow-x-auto leading-relaxed max-h-56">
                <code>{activeScript.codePreview}</code>
              </pre>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
