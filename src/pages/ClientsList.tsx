import React from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  ChevronRight, 
  Wallet, 
  Settings, 
  Search, 
  Activity, 
  Sparkles, 
  FileText,
  BadgeAlert
} from 'lucide-react';
import { Client } from '../types';

interface ClientsListProps {
  clients: Client[];
  onSelectClient: (id: string) => void;
  currentTheme: 'light' | 'dark';
  searchQuery: string;
}

export default function ClientsList({
  clients,
  onSelectClient,
  currentTheme,
  searchQuery
}: ClientsListProps) {
  
  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.accountId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.industry.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Search and Quick Metric headers */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={`p-4 rounded-lg border ${
          currentTheme === 'light' ? 'bg-white border-slate-205' : 'bg-slate-900 border-slate-800'
        }`}>
          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">
            Загальна кількість кабінетів
          </span>
          <p className="text-xl font-bold font-display text-slate-850 dark:text-slate-100 mt-1">
            {clients.length}
          </p>
          <span className="text-[9px] text-emerald-500 font-mono">100% Google Ads API connected</span>
        </div>

        <div className={`p-4 rounded-lg border ${
          currentTheme === 'light' ? 'bg-white border-slate-205' : 'bg-slate-900 border-slate-800'
        }`}>
          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">
            Критичний ризик (Alerts)
          </span>
          <p className="text-xl font-bold font-display text-rose-500 mt-1">
            {clients.filter(c => c.riskLevel === 'high').length}
          </p>
          <span className="text-[9px] text-slate-400 font-mono">Потребують термінового фінансування</span>
        </div>

        <div className={`p-4 rounded-lg border ${
          currentTheme === 'light' ? 'bg-white border-slate-205' : 'bg-slate-900 border-slate-800'
        }`}>
          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">
            Середній показник Health Score
          </span>
          <p className="text-xl font-bold font-display text-emerald-505 mt-1">
            {(clients.reduce((acc, c) => acc + c.healthScore, 0) / clients.length).toFixed(1)}%
          </p>
          <span className="text-[9px] text-slate-400 font-mono">Цільова планка: 85%</span>
        </div>

        <div className={`p-4 rounded-lg border ${
          currentTheme === 'light' ? 'bg-white border-slate-205' : 'bg-slate-900 border-slate-800'
        }`}>
          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">
            Загальний ліміт до упору
          </span>
          <p className="text-xl font-bold font-display text-indigo-500 mt-1">
            {clients.reduce((acc, c) => acc + c.budgetLimit, 0).toLocaleString()} UAH
          </p>
          <span className="text-[9px] text-slate-400 font-mono">Сумарний пул активних кампаній</span>
        </div>
      </div>

      {/* Grid of high-density Google Ads Accounts overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredClients.map((client) => (
          <div 
            key={client.id}
            onClick={() => onSelectClient(client.id)}
            className={`p-5 rounded-lg border text-xs cursor-pointer hover:shadow-md transition-all duration-150 flex flex-col justify-between ${
              client.status === 'warning'
                ? 'border-amber-500/30'
                : 'border-slate-200 dark:border-slate-800'
            } ${
              currentTheme === 'light' ? 'bg-white text-slate-800' : 'bg-slate-900 text-slate-100'
            }`}
          >
            {/* Top part with logo and account status */}
            <div>
              <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800/60 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-sm text-slate-900 dark:text-white">
                      {client.name}
                    </span>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono uppercase ${
                      client.status === 'active' 
                        ? 'bg-emerald-500/10 text-emerald-500' 
                        : 'bg-amber-500/10 text-amber-500'
                    }`}>
                      {client.status}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                    Google Ads Account ID: <span className="font-semibold text-slate-350">{client.accountId}</span>
                  </p>
                </div>

                {/* Micro Health Radial chart */}
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-mono">HEALTH SCORE</span>
                  <span className={`font-mono font-bold text-sm ${
                    client.healthScore >= 90 ? 'text-emerald-500' : client.healthScore >= 75 ? 'text-amber-500' : 'text-rose-500'
                  }`}>
                    {client.healthScore}%
                  </span>
                </div>
              </div>

              {/* Account Industry & Info */}
              <div className="text-[11px] text-slate-400 mb-3 font-mono">
                Ніша: <span className="text-slate-200 font-sans">{client.industry}</span>
              </div>

              {/* Core metrics row */}
              <div className="grid grid-cols-3 gap-2 bg-slate-950/20 rounded p-3 mb-4 font-mono">
                <div>
                  <span className="text-[9px] text-slate-400 block uppercase">Середній CTR</span>
                  <span className="text-xs font-bold font-sans text-slate-900 dark:text-slate-100">{client.ctr}%</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 block uppercase">Вартість Кліку</span>
                  <span className="text-xs font-bold font-sans text-slate-900 dark:text-slate-100">{client.cpc} {client.currency}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 block uppercase font-bold text-indigo-400">Поточний CPA</span>
                  <span className="text-xs font-bold font-sans text-indigo-400">{client.cpa} {client.currency}</span>
                </div>
              </div>

              {/* State & Risk warnings */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-[11px]">
                  <span className="text-slate-400 font-semibold font-mono w-24">Остання дія:</span>
                  <span className="text-slate-350 truncate flex-1">{client.lastAction}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px]">
                  <span className="text-indigo-400 font-semibold font-mono w-24">Наступний крок:</span>
                  <span className="text-indigo-400 font-bold truncate flex-1">{client.nextStep}</span>
                </div>
              </div>
            </div>

            {/* Down button panel */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/40 flex justify-between items-center bg-slate-100/10 dark:bg-slate-950/20 px-3 py-2 -mx-5 -mb-5 rounded-b-lg">
              <div className="flex items-center gap-2 text-[10px] text-slate-400">
                <Wallet size={12} className={client.riskLevel === 'high' ? 'text-rose-500 animate-bounce' : 'text-slate-400'} />
                <span>Оплачено: <b className="font-mono text-slate-200">{client.budgetSpent.toLocaleString()} / {client.budgetLimit.toLocaleString()} UAH</b></span>
              </div>
              <span className="text-xs text-indigo-500 font-medium font-sans inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Перейти в кабінет <ChevronRight size={13} />
              </span>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
