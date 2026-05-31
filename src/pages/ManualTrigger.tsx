import React, { useState } from 'react';
import { 
  Play, 
  Terminal, 
  Trash2, 
  ChevronRight, 
  Database, 
  Bot, 
  Check, 
  Server,
  Loader2
} from 'lucide-react';
import { AutomationScript } from '../types';

interface ManualTriggerProps {
  scripts: AutomationScript[];
  onTriggerScript: (id: string) => void;
  isRunningScriptId: string | null;
  currentTheme: 'light' | 'dark';
  onAddDecisionLog: (msg: string, level: 'info' | 'success' | 'warning' | 'critical') => void;
}

export default function ManualTrigger({
  scripts,
  onTriggerScript,
  isRunningScriptId,
  currentTheme,
  onAddDecisionLog
}: ManualTriggerProps) {
  
  const [targetScript, setTargetScript] = useState<string>(scripts[0]?.id || 'scr-1');
  const [params, setParams] = useState('--client_id=all --limit=10 --use_llm=true');
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    'SYSTEM: Initialize console terminal context success.',
    'SYSTEM: Hooking Node.js processes on port 3000.',
    'READY: Manual PPC Agent launcher waiting for manual payload...'
  ]);
  const [isLaunching, setIsLaunching] = useState(false);

  const handleLaunch = () => {
    if (!targetScript) return;
    const selected = scripts.find(s => s.id === targetScript);
    if (!selected) return;

    setIsLaunching(true);
    setTerminalLogs(prev => [
      ...prev,
      `LAUNCHING: python3 ${selected.filename} ${params}`,
      `STATUS: Est. Google Ads API secure connection via OAuth...`,
    ]);

    // Simulate stdout streams
    setTimeout(() => {
      setTerminalLogs(prev => [
        ...prev,
        `STDOUT: Importing config pipelines... OK`,
        `STDOUT: Querying DB view search_term_view where date >= 2026-05-24...`,
      ]);
    }, 1000);

    setTimeout(() => {
      onTriggerScript(targetScript);
      const outputMsg = selected.status === 'failed' 
        ? `STDERR: Refresh oauth token failed! (OAuthExpired Exception in fetch_audit_data.py)`
        : `STDOUT: Run process of ${selected.filename} finished. Exit code: 0 [SUCCESS]`;

      setTerminalLogs(prev => [
        ...prev,
        outputMsg,
        `SYSTEM: Operational logs dispatched to Audit Trail successfully.`
      ]);

      onAddDecisionLog(
        `Ручний Запуск: Виконано примусовий пуск ${selected.filename} з параметрами [${params}]`,
        selected.status === 'failed' ? 'critical' : 'success'
      );

      setIsLaunching(false);
    }, 2500);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Launcher Control Board */}
        <div className={`p-5 rounded-lg border space-y-4 ${
          currentTheme === 'light' ? 'bg-white border-slate-205' : 'bg-slate-905 border-slate-800'
        }`}>
          <div className="pb-3 border-b border-slate-800/10">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-display">
              Пульт Керування Запуском
            </h4>
          </div>

          <div className="space-y-4 text-xs font-sans">
            <div>
              <label className="text-slate-400 block mb-1 font-semibold uppercase text-[10px]">
                Оберіть модуль для запуску:
              </label>
              <select
                value={targetScript}
                onChange={(e) => setTargetScript(e.target.value)}
                className={`w-full py-2 px-2.5 rounded border outline-none ${
                  currentTheme === 'light'
                    ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-indigo-505'
                    : 'bg-slate-900 border-slate-805 text-slate-100 focus:bg-slate-800 focus:border-indigo-400'
                }`}
              >
                {scripts.map((script) => (
                  <option key={script.id} value={script.id}>
                    {script.filename} ({script.name})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-semibold uppercase text-[10px]">
                Додаткові sys.argv параметри:
              </label>
              <input
                type="text"
                value={params}
                onChange={(e) => setParams(e.target.value)}
                className={`w-full py-2 px-2.5 rounded border outline-none font-mono ${
                  currentTheme === 'light'
                    ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-indigo-505'
                    : 'bg-slate-900 border-slate-805 text-slate-100 focus:bg-slate-800 focus:border-indigo-400'
                }`}
              />
            </div>

            <div className="p-3 bg-slate-950/20 rounded font-mono text-[10px] text-slate-400 space-y-1 border border-slate-800/10">
              <div className="flex justify-between">
                <span>Виконавець:</span>
                <span>python3.11-linux_amd64</span>
              </div>
              <div className="flex justify-between">
                <span>Середовище:</span>
                <span className="text-emerald-500 font-semibold">Local sandboxed container</span>
              </div>
            </div>

            <button
              onClick={handleLaunch}
              disabled={isLaunching}
              className={`w-full py-2.5 rounded font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                isLaunching
                  ? 'bg-indigo-600/30 text-indigo-305 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md'
              }`}
            >
              {isLaunching ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  <span>Виконується запуск...</span>
                </>
              ) : (
                <>
                  <span>Запустити модуль</span>
                  <Play size={14} />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live Terminal outputs */}
        <div className={`p-5 rounded-lg border lg:col-span-2 space-y-4 ${
          currentTheme === 'light' ? 'bg-white border-slate-205' : 'bg-slate-900 border-slate-800'
        }`}>
          <div className="pb-3 border-b border-slate-800/10 flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <Terminal size={15} className="text-[#38bdf8]" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-display">
                stdout / stderr Інтерактивна Консоль
              </h4>
            </div>
            <button
              onClick={() => setTerminalLogs(['SYSTEM: Terminal logs cleared. Ready...'])}
              className="text-[10px] text-slate-500 hover:text-rose-500 font-mono flex items-center gap-1"
            >
              <Trash2 size={11} /> Очистити консоль
            </button>
          </div>

          <div className="bg-[#0f172a] text-[#38bdf8] p-4 rounded border border-slate-800 font-mono text-xs leading-relaxed h-80 overflow-y-auto space-y-1.5 scrollbar-thin">
            {terminalLogs.map((log, idx) => {
              let styleCls = 'text-[#38bdf8]';
              if (log.startsWith('SYSTEM:')) styleCls = 'text-slate-500';
              if (log.startsWith('LAUNCHING:')) styleCls = 'text-yellow-400 font-bold';
              if (log.startsWith('READY:')) styleCls = 'text-indigo-400';
              if (log.includes('finished') || log.includes('success')) styleCls = 'text-emerald-400 font-semibold';
              if (log.includes('failed') || log.startsWith('STDERR:')) styleCls = 'text-rose-400 font-bold';
              
              return (
                <div key={idx} className={styleCls}>
                  <span className="text-slate-600 mr-2">&gt;</span>
                  {log}
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
