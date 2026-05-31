import React, { useState } from 'react';
import { 
  Bell, 
  Search, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle,
  Database,
  Sliders,
  Send,
  Loader2
} from 'lucide-react';
import { AuditLog } from '../types';

interface HeaderProps {
  currentTab: string;
  onRunAudit: () => void;
  isAuditing: boolean;
  syncTime: string;
  logs: AuditLog[];
  currentTheme: 'light' | 'dark';
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenUploadModal: () => void;
  pendingStagedChangesCount: number;
  isUploading: boolean;
}

export default function Header({
  currentTab,
  onRunAudit,
  isAuditing,
  syncTime,
  logs,
  currentTheme,
  searchQuery,
  setSearchQuery,
  onOpenUploadModal,
  pendingStagedChangesCount,
  isUploading
}: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);

  // Friendly translate of tabs
  const tabTitles: Record<string, string> = {
    'command-center': 'Командний центр роботи',
    'clients': 'Операційний стан рекламних акаунтів',
    'client-detail': 'Карта рекламного кабінету клієнта',
    'balances': 'Моніторинг білінгу та касових розривів',
    'semantics': 'Аналіз пошукової семантики & Мінус-слова',
    'recommendations': 'AI Рекомендаційне ядро агентів',
    'automations': 'Диспетчер автоматизацій & Скрипти (Python)',
    'manual-init': 'Ручний запуск автономних агентів',
    'documents': 'База знань & SOP інструкції спеціаліста',
    'audit-trail': 'Лог дій і транзакційний слід'
  };

  const criticalLogs = logs.filter(l => l.level === 'critical' || l.level === 'warning').slice(0, 4);

  return (
    <header className={`h-16 border-b px-6 flex items-center justify-between relative ${
      currentTheme === 'dark'
        ? 'bg-slate-900 border-slate-800 text-white'
        : 'bg-white border-slate-300 text-slate-850 shadow-sm'
    }`}>
      
      {/* Title & Status Indicator */}
      <div className="flex items-center gap-4">
        <div>
          <h2 className="text-sm font-semibold font-display tracking-tight uppercase">
            {tabTitles[currentTab] || 'Режим роботи'}
          </h2>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="flex h-1.5 w-1.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            <p className="text-[10px] text-slate-400 font-mono">
              Оновлено: {syncTime} | 
              <span className="ml-1 text-amber-500 font-semibold px-1 py-0.2 rounded bg-amber-500/10 inline-flex items-center gap-1">
                <Database size={8} /> Google Sheets disconnected (Demo Mode)
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Action panel & search */}
      <div className="flex items-center gap-4">
        
        {/* Search */}
        <div className="relative w-52 sm:w-64">
          <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none text-slate-400">
            <Search size={14} />
          </span>
          <input
            type="text"
            placeholder="Швидкий фільтр / клієнт..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full py-1.5 pl-8 pr-3 text-xs rounded-md border outline-none font-sans transition-colors ${
              currentTheme === 'light'
                ? 'bg-slate-50 border-slate-200 text-slate-800 focus:bg-white focus:border-indigo-500'
                : 'bg-slate-800/80 border-slate-700 text-white focus:bg-slate-800 focus:border-indigo-400'
            }`}
          />
        </div>

        {/* Sync Trigger button */}
        <button
          onClick={onRunAudit}
          disabled={isAuditing}
          className={`px-3 py-1.5 rounded text-xs font-medium font-sans flex items-center gap-1.5 cursor-pointer select-none transition ${
            isAuditing
              ? 'bg-indigo-600/30 text-indigo-300 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-600/15'
          }`}
        >
          {isAuditing ? (
            <>
              <Loader2 size={13} className="animate-spin" />
              <span>Аналіз...</span>
            </>
          ) : (
            <>
              <RefreshCw size={13} className="hover:rotate-180 transition-transform duration-500" />
              <span>Запустити перевірку</span>
            </>
          )}
        </button>

        {/* Upload Staging button */}
        <button
          onClick={onOpenUploadModal}
          disabled={pendingStagedChangesCount === 0 || isUploading}
          className={`px-3 py-1.5 rounded text-xs font-semibold font-sans flex items-center gap-1.5 cursor-pointer select-none transition ${
            pendingStagedChangesCount === 0
              ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed border border-transparent'
              : isUploading
              ? 'bg-indigo-600/20 text-indigo-400 cursor-wait'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-600/15'
          }`}
        >
          {isUploading ? (
            <>
              <Loader2 size={13} className="animate-spin text-indigo-400" />
              <span>Вигружається...</span>
            </>
          ) : (
            <>
              <span>📤</span>
              <span>Вигрузити в Google Ads ({pendingStagedChangesCount})</span>
            </>
          )}
        </button>

        {/* Notifications and Alert box */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`p-2 rounded-full relative transition border ${
              currentTheme === 'light'
                ? 'bg-[#f8fafc] border-slate-200 hover:bg-slate-100 text-slate-700'
                : 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-200'
            }`}
          >
            <Bell size={15} />
            {criticalLogs.length > 0 && (
              <span className="absolute top-1 right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
            )}
          </button>

          {showNotifications && (
            <div className={`absolute right-0 mt-2 w-80 rounded-lg shadow-xl border z-50 p-4 transition-all duration-200 ${
              currentTheme === 'light' ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-slate-800 text-slate-150'
            }`}>
              <div className="flex items-center justify-between pb-2 border-b border-slate-800/20 mb-3">
                <h4 className="text-xs font-bold font-display uppercase tracking-wide">
                  Тривожні сповіщення
                </h4>
                <button 
                  onClick={() => setShowNotifications(false)}
                  className="text-[10px] text-slate-400 hover:text-indigo-500"
                >
                  Закрити
                </button>
              </div>

              {criticalLogs.length > 0 ? (
                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                  {criticalLogs.map((log) => (
                    <div 
                      key={log.id} 
                      className={`p-2 rounded text-[11px] leading-relaxed border flex gap-2 ${
                        log.level === 'critical' 
                          ? 'bg-rose-500/10 border-rose-500/20 text-rose-700 dark:text-rose-400' 
                          : 'bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-400'
                      }`}
                    >
                      <AlertTriangle size={12} className="flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">{log.message}</p>
                        <span className="text-[9px] text-slate-400 font-mono mt-0.5 block">
                          {log.timestamp} | {log.actor}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center text-slate-455 text-xs">
                  <CheckCircle size={24} className="mx-auto text-emerald-500 mb-2" />
                  <span>Всі системи в нормі. Критичних аномалій не знайдено.</span>
                </div>
              )}

              <div className="mt-3 pt-2 border-t border-slate-800/10 text-center">
                <button
                  onClick={() => { setShowNotifications(false); onRunAudit(); }}
                  className="text-[10px] text-indigo-500 hover:underline inline-flex items-center gap-1"
                >
                  Перезапустити діагностичні скрипти
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
