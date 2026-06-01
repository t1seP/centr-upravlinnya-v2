import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Trash2, 
  Filter, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  Server,
  Copy,
  Check,
  Sparkles,
  Cpu,
  FolderOpen,
  Database,
  ArrowRight,
  Code
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
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [copiedPath, setCopiedPath] = useState<string | null>(null);
  const [expandedPayloads, setExpandedPayloads] = useState<Record<string, boolean>>({});

  const filteredLogs = logs.filter(l => {
    const matchesSearch = l.message.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          l.actor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = levelFilter === 'all' || l.level === levelFilter;
    const matchesActor = actorFilter === 'all' || l.actor === actorFilter;
    
    // Category filter matching
    const matchesCategory = categoryFilter === 'all' || l.category === categoryFilter;
    
    return matchesSearch && matchesLevel && matchesActor && matchesCategory;
  });

  const levelStyles: Record<string, { bg: string, text: string, icon: any }> = {
    info: { bg: 'bg-blue-500/10', text: 'text-blue-500', icon: Info },
    success: { bg: 'bg-emerald-500/10', text: 'text-emerald-500', icon: CheckCircle },
    warning: { bg: 'bg-amber-500/10', text: 'text-amber-550', icon: AlertTriangle },
    critical: { bg: 'bg-rose-500/15 text-rose-550 animate-pulse', text: 'text-rose-500', icon: AlertTriangle }
  };

  const categoryLabels: Record<string, string> = {
    all: 'Усі категорії',
    action: 'Дія оператора',
    analysis: 'ШІ Аналіз',
    staging: 'Черга вивантаження (Staging)',
    upload: 'Вивантаження в Ads',
    automation: 'Автоматизація',
    sync: 'Синхронізація',
    system: 'Система'
  };

  const handleCopyPath = (path: string) => {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(path);
    setCopiedPath(path);
    setTimeout(() => setCopiedPath(null), 2000);
  };

  const togglePayload = (id: string) => {
    setExpandedPayloads(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Filtering desk */}
      <div className={`p-4 rounded-lg border flex flex-col gap-4 ${
        currentTheme === 'light' ? 'bg-white border-slate-205' : 'bg-slate-905 border-slate-800'
      }`}>
        <div className="flex flex-wrap lg:flex-nowrap justify-between gap-4">
          
          {/* Level Filter */}
          <div className="flex flex-wrap gap-2 items-center font-mono text-[10px]">
            <span className="text-slate-400 uppercase font-bold">Рівень:</span>
            {['all', 'info', 'success', 'warning', 'critical'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setLevelFilter(lvl as any)}
                className={`px-2 py-1 rounded border cursor-pointer transition uppercase ${
                  levelFilter === lvl
                    ? 'bg-indigo-600 text-white border-indigo-600 font-bold'
                    : 'bg-slate-800/15 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* Actor Filter */}
          <div className="flex flex-wrap gap-2 items-center font-mono text-[10px]">
            <span className="text-slate-400 uppercase font-bold">Ініціатор:</span>
            {['all', 'User', 'AI Agent', 'System', 'Script'].map((act) => (
              <button
                key={act}
                onClick={() => setActorFilter(act as any)}
                className={`px-2 py-1 rounded border cursor-pointer transition ${
                  actorFilter === act
                    ? 'bg-indigo-600 text-white border-indigo-600 font-bold'
                    : 'bg-slate-800/15 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                {act === 'all' ? 'Всі' : act}
              </button>
            ))}
          </div>

        </div>

        {/* Category Filters */}
        <div className="pt-2.5 border-t border-slate-100 dark:border-slate-850 flex flex-wrap gap-2 items-center font-mono text-[10px]">
          <span className="text-slate-400 uppercase font-bold">Категорія:</span>
          {['all', 'analysis', 'staging', 'upload', 'automation', 'sync', 'action'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-2.5 py-1 rounded border cursor-pointer transition ${
                categoryFilter === cat
                  ? 'bg-indigo-650 text-white border-indigo-600 font-bold'
                  : 'bg-slate-800/15 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              {categoryLabels[cat] || cat}
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
            Автоматизований захист (Second Brain & Immutable Logs)
          </span>
        </div>

        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
          {filteredLogs.length > 0 ? (
            filteredLogs.map((log) => {
              const style = levelStyles[log.level] || levelStyles.info;
              const LogIcon = style.icon;
              
              // Custom design identifiers for distinctive logs
              const isSpecial = ['analysis', 'staging', 'upload', 'automation'].includes(log.category || '');
              
              // Custom visual gradients & backgrounds for categories as requested
              const specialCardClasses = {
                analysis: 'bg-purple-650/[0.02] border-l-3 border-l-purple-500 border-purple-500/10',
                staging: 'bg-indigo-650/[0.02] border-l-3 border-l-indigo-500 border-indigo-500/10',
                upload: 'bg-emerald-650/[0.02] border-l-3 border-l-emerald-500 border-emerald-500/10',
                automation: 'bg-cyan-650/[0.02] border-l-3 border-l-cyan-500 border-cyan-500/10'
              } as Record<string, string>;

              const isUserType = log.actor === 'User';

              const cardBg = isSpecial && !isUserType
                ? specialCardClasses[log.category || ''] 
                : currentTheme === 'light' 
                ? 'bg-slate-50 border-slate-200' 
                : 'bg-slate-950/30 border-slate-805/40';

              return (
                <div 
                  key={log.id} 
                  className={`p-3 rounded border text-xs leading-relaxed flex items-start gap-3 transition-colors ${cardBg}`}
                >
                  {/* Category icon badges */}
                  <div className={`p-1.5 rounded mt-0.5 ${style.bg} ${style.text}`}>
                    {log.category === 'analysis' ? (
                      <Sparkles size={13} className="text-purple-500" />
                    ) : log.category === 'automation' ? (
                      <Cpu size={13} className="text-cyan-500" />
                    ) : log.category === 'sync' ? (
                      <Database size={13} className="text-blue-500" />
                    ) : (
                      <LogIcon size={13} />
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-1.5 min-w-0">
                    <div className="flex justify-between items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-900 dark:text-slate-100 font-mono">
                        {log.actor} • <span className={`text-[9px] uppercase tracking-wider font-mono font-bold px-1.5 py-0.2 rounded ${
                          log.category === 'analysis' 
                            ? 'bg-purple-500/10 text-purple-400' 
                            : log.category === 'staging'
                            ? 'bg-indigo-500/10 text-indigo-400'
                            : log.category === 'upload'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-slate-500/10 text-slate-400'
                        }`}>{categoryLabels[log.category || ''] || log.category}</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{log.timestamp}</span>
                    </div>

                    <p className={`text-[11px] font-sans ${isSpecial ? 'font-mono text-slate-800 dark:text-slate-200 bg-slate-950/[0.015] p-2 rounded dark:bg-slate-950/20 leading-relaxed' : 'text-slate-650 dark:text-slate-300'}`}>
                      {log.message}
                    </p>

                    {/* Metadata attachments panel */}
                    <div className="flex flex-wrap items-center gap-2 pt-0.5">
                      
                      {/* Brand client/campaign badge links if present */}
                      {log.clientName && (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-450">
                          Клієнт: {log.clientName}
                        </span>
                      )}

                      {log.campaignName && (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-450">
                          Кампанія: {log.campaignName}
                        </span>
                      )}

                      {/* Second Brain File Path badge */}
                      {log.secondBrainPath && (
                        <button
                          onClick={() => handleCopyPath(log.secondBrainPath!)}
                          type="button"
                          className="text-[9px] font-mono px-1.5 py-0.5 rounded flex items-center gap-1 cursor-pointer transition select-none bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-200/50 dark:bg-indigo-950/30 dark:hover:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-900/30"
                          title="Натисніть щоб скопіювати файловий шлях логів клієнта"
                        >
                          <FolderOpen size={10} />
                          <span>
                            {copiedPath === log.secondBrainPath ? 'Шлях скопійовано!' : `📂 ${log.secondBrainPath}`}
                          </span>
                          {copiedPath !== log.secondBrainPath && <Copy size={8} />}
                        </button>
                      )}

                      {/* Expandable JSON Payload button */}
                      {log.payload && (
                        <button
                          onClick={() => togglePayload(log.id)}
                          type="button"
                          className="text-[9px] font-mono px-1.5 py-0.5 rounded flex items-center gap-1 cursor-pointer transition bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400"
                        >
                          <Code size={10} />
                          <span>{expandedPayloads[log.id] ? 'Сховати JSON' : 'Показати JSON'}</span>
                        </button>
                      )}

                    </div>

                    {/* Expanded payload output */}
                    {log.payload && expandedPayloads[log.id] && (
                      <pre className="text-[9.5px] leading-relaxed font-mono p-2.5 rounded bg-[#1e293b] text-emerald-400 border border-[#334155] max-w-full overflow-x-auto">
                        {JSON.stringify(log.payload, null, 2)}
                      </pre>
                    )}

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
