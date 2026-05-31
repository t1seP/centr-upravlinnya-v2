import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  UserSquare2, 
  Wallet, 
  BookOpen, 
  Terminal, 
  Cpu, 
  FileText, 
  History, 
  FileCheck,
  Activity,
  Play,
  MessageSquare,
  Sparkles,
  Image
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  selectedClientId: string;
  clientsCount: number;
  criticalAlertsCount: number;
  pendingDecisionsCount: number;
  currentTheme: 'light' | 'dark';
  setCurrentTheme: (theme: 'light' | 'dark') => void;
  onToggleChatWidget: () => void;
  pendingStagedChangesCount: number;
  onOpenUploadModal: () => void;
}

export default function Sidebar({
  currentTab,
  setCurrentTab,
  selectedClientId,
  clientsCount,
  criticalAlertsCount,
  pendingDecisionsCount,
  currentTheme,
  setCurrentTheme,
  onToggleChatWidget,
  pendingStagedChangesCount,
  onOpenUploadModal
}: SidebarProps) {
  
  const menuItems = [
    { id: 'command-center', label: 'Командний центр', icon: LayoutDashboard, badge: pendingDecisionsCount },
    { id: 'clients', label: 'Стан клієнтів', icon: Users, badge: null },
    { id: 'client-detail', label: 'Картка клієнта', icon: UserSquare2, badge: null, subtext: 'Вибрано клієнта' },
    { id: 'agent-chat', label: 'Чат з Агентом', icon: MessageSquare, badge: 'LIVE' },
    { id: 'campaign-builder', label: 'Кампанії з Агентом', icon: Sparkles, badge: 'AI' },
    { id: 'ad-assets', label: 'Активи реклами', icon: Image, badge: 'New' },
    { id: 'balances', label: 'Контроль балансів', icon: Wallet, badge: criticalAlertsCount ? '🚨 Run-out' : null },
    { id: 'semantics', label: 'Пошукові терміни', icon: BookOpen, badge: '98%' },
    { id: 'recommendations', label: 'Рекомендації AI', icon: Cpu, badge: 'Smart' },
    { id: 'automations', label: 'Автоматизації & Скрипти', icon: FileCheck, badge: null },
    { id: 'manual-init', label: 'Ручний запуск', icon: Play, badge: 'Console' },
    { id: 'documents', label: 'Бібліотека SOP', icon: FileText, badge: null },
    { id: 'audit-trail', label: 'Логи роботи', icon: History, badge: null },
  ];

  return (
    <div className={`w-64 flex-shrink-0 flex flex-col justify-between border-r ${
      currentTheme === 'dark' 
        ? 'bg-slate-950 border-slate-805 text-slate-100' 
        : 'bg-white border-slate-300 text-slate-900 shadow-sm'
    }`}>
      {/* Top Header */}
      <div>
        <div className={`p-5 border-b flex items-center gap-3 ${
          currentTheme === 'light' ? 'border-slate-300 bg-slate-200/40' : 'border-slate-800/60'
        }`}>
          <div className="p-2 bg-indigo-600 rounded-lg text-white">
            <Activity size={20} className="glow-indicator" />
          </div>
          <div>
            <h1 className={`font-display font-bold text-sm tracking-wide ${
              currentTheme === 'light' ? 'text-slate-900' : 'text-white'
            }`}>
              PPC CONTROL UNIT
            </h1>
            <p className={`text-[10px] font-mono tracking-wider ${
              currentTheme === 'light' ? 'text-slate-605' : 'text-slate-400'
            }`}>
              OPERATIONS ROOM v2.0
            </p>
          </div>
        </div>

        {/* Navigation Elements */}
        <nav className="p-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-link-${item.id}`}
                onClick={() => {
                  if (item.id === 'agent-chat') {
                    onToggleChatWidget();
                  } else {
                    setCurrentTab(item.id);
                  }
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-xs font-medium transition-all duration-150 ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-sm font-bold' 
                    : currentTheme === 'light'
                    ? 'text-slate-650 hover:text-slate-900 hover:bg-slate-200/80'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon size={16} className={isActive ? 'text-white' : currentTheme === 'light' ? 'text-slate-600' : 'text-slate-400'} />
                  <span className="text-left">{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-mono ${
                    isActive 
                      ? 'bg-white/20 text-white font-bold' 
                      : item.badge.toString().includes('🚨') 
                      ? 'bg-red-500/10 text-red-600 font-bold border border-red-200' 
                      : currentTheme === 'light'
                      ? 'bg-slate-250 text-slate-700'
                      : 'bg-slate-800 text-slate-350'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {pendingStagedChangesCount > 0 && (
        <div className={`p-4 border-t ${
          currentTheme === 'light' ? 'border-indigo-100 bg-indigo-50/40' : 'border-indigo-950/20 bg-indigo-950/10'
        }`}>
          <button
            onClick={onOpenUploadModal}
            className="w-full flex items-center justify-between p-2 px-3 rounded bg-indigo-600 hover:bg-indigo-755 text-white text-xs font-bold font-mono transition-all duration-200 cursor-pointer shadow-indigo-500/20 shadow-md"
            title="Переглянути та вигрузити зміни"
          >
            <div className="flex items-center gap-1.5 animate-pulse">
              <span>📤</span>
              <span className="tracking-tight">Змін в черзі:</span>
            </div>
            <span className="bg-white text-indigo-750 px-2 py-0.2 rounded-md font-bold font-sans text-[11px] tracking-wide">
              {pendingStagedChangesCount}
            </span>
          </button>
        </div>
      )}

      {/* Theme Presets View and Quick Action */}
      <div className={`p-4 border-t ${
        currentTheme === 'light' ? 'border-slate-300 bg-slate-50' : 'border-slate-800/60 bg-slate-950/40'
      }`}>
        <label className={`block text-[10px] font-mono uppercase tracking-wider mb-2 ${
          currentTheme === 'light' ? 'text-slate-600 font-bold' : 'text-slate-400'
        }`}>
          Активна тема оформлення
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={() => setCurrentTheme('light')}
            className={`px-3 py-1.5 rounded text-[10px] uppercase font-mono font-bold tracking-wide border cursor-pointer text-center transition ${
              currentTheme === 'light'
                ? 'bg-indigo-600 text-white border-indigo-650 font-bold shadow'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
            }`}
          >
            Світла
          </button>
          <button
            onClick={() => setCurrentTheme('dark')}
            className={`px-3 py-1.5 rounded text-[10px] uppercase font-mono font-bold tracking-wide border cursor-pointer text-center transition ${
              currentTheme === 'dark'
                ? 'bg-slate-800 text-white border-slate-700 font-bold'
                : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
            }`}
          >
            Темна
          </button>
        </div>
        
        {/* Sync panel indicator */}
        <div className={`mt-4 pt-4 border-t flex flex-col gap-1 text-[10px] font-mono ${
          currentTheme === 'light' ? 'border-slate-300 text-slate-500' : 'border-slate-800/50 text-slate-500'
        }`}>
          <div className="flex justify-between">
            <span>Акаунти:</span>
            <span className={`${currentTheme === 'light' ? 'text-slate-900' : 'text-slate-350'} font-bold`}>{clientsCount} активних</span>
          </div>
          <div className="flex justify-between">
            <span>Консультант:</span>
            <span className="text-emerald-600 dark:text-emerald-500 font-semibold">Gemini Pro Agent</span>
          </div>
        </div>
      </div>
    </div>
  );
}
