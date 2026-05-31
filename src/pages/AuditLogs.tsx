import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Trash2, 
  Filter, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  Server
} from 'lucide-react';
import { AuditLog } from '../types';

interface AuditLogsProps {
  logs: AuditLog[];
  currentTheme: 'light' | 'dark';
  searchQuery: string;
}

export default function AuditLogs({
  logs,
  currentTheme,
  searchQuery
}: AuditLogsProps) {
  
  const [levelFilter, setLevelFilter] = useState<'all' | 'info' | 'warning' | 'success' | 'critical'>('all');
  const [actorFilter, setActorFilter] = useState<'all' | 'User' | 'AI Agent' | 'System' | 'Script'>('all');

  const filteredLogs = logs.filter(l => {
    const matchesSearch = l.message.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          l.actor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = levelFilter === 'all' || l.level === levelFilter;
    const matchesActor = actorFilter === 'all' || l.actor === actorFilter;
    return matchesSearch && matchesLevel && matchesActor;
  });

  const levelStyles: Record<string, { bg: string, text: string, icon: any }> = {
    info: { bg: 'bg-blue-500/10', text: 'text-blue-500', icon: Info },
    success: { bg: 'bg-emerald-500/10', text: 'text-emerald-500', icon: CheckCircle },
    warning: { bg: 'bg-amber-500/10', text: 'text-amber-550', icon: AlertTriangle },
    critical: { bg: 'bg-rose-500/15 text-rose-550 animate-pulse', text: 'text-rose-500', icon: AlertTriangle }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Filtering desk */}
      <div className={`p-4 rounded-lg border flex flex-col sm:flex-row justify-between sm:items-center gap-3 ${
        currentTheme === 'light' ? 'bg-white border-slate-205' : 'bg-slate-905 border-slate-800'
      }`}>
        <div className="flex flex-wrap gap-2.5 items-center font-mono text-[10px]">
          <span className="text-slate-400 uppercase font-semibold">Рівень:</span>
          {['all', 'info', 'success', 'warning', 'critical'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setLevelFilter(lvl as any)}
              className={`px-2 py-1 rounded border uppercase ${
                levelFilter === lvl
                  ? 'bg-indigo-650 text-white border-indigo-600 font-bold'
                  : 'bg-slate-800/15 text-slate-400 border-slate-800'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2.5 items-center font-mono text-[10px]">
          <span className="text-slate-400 uppercase font-semibold">Ініціатор:</span>
          {['all', 'User', 'AI Agent', 'System', 'Script'].map((act) => (
            <button
              key={act}
              onClick={() => setActorFilter(act as any)}
              className={`px-2 py-1 rounded border ${
                actorFilter === act
                  ? 'bg-indigo-650 text-white border-indigo-600 font-bold'
                  : 'bg-slate-800/15 text-slate-400 border-slate-800'
              }`}
            >
              {act === 'all' ? 'Всі' : act}
            </button>
          ))}
        </div>
      </div>

      {/* Main Immutable List output */}
      <div className={`p-5 rounded-lg border space-y-4 ${
        currentTheme === 'light' ? 'bg-white border-slate-205' : 'bg-slate-900 border-slate-800'
      }`}>
        <div className="pb-3 border-b border-slate-805/10 flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <History size={15} className="text-indigo-400 animate-spin-slow" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-display">
              Транзакційний журнальний слід роботи ({filteredLogs.length} подій)
            </h4>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            Джерело запису: SQLite / Docker daemon stdout proxy
          </span>
        </div>

        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
          {filteredLogs.length > 0 ? (
            filteredLogs.map((log) => {
              const style = levelStyles[log.level] || levelStyles.info;
              const LogIcon = style.icon;
              
              return (
                <div 
                  key={log.id} 
                  className={`p-3 rounded border text-xs leading-relaxed flex items-start gap-3 transition-colors ${
                    currentTheme === 'light' 
                      ? 'bg-slate-50 border-slate-200' 
                      : 'bg-slate-950/30 border-slate-805/40'
                  }`}
                >
                  <div className={`p-1.5 rounded mt-0.5 ${style.bg} ${style.text}`}>
                    <LogIcon size={13} />
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-900 dark:text-slate-100 font-mono">
                        {log.actor} • <span className="text-[10px] uppercase text-indigo-400">{log.category}</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{log.timestamp}</span>
                    </div>
                    <p className="text-slate-450 text-[11px] font-sans">
                      {log.message}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center text-slate-500 font-mono text-xs">
              Нічого не знайдено за вказаними фільтрами. Спробуйте скинути фільтрацію.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
