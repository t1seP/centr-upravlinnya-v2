import React, { useState } from 'react';
import { 
  AlertOctagon, 
  Sparkles, 
  CheckSquare, 
  Clock, 
  ArrowRight, 
  TrendingUp, 
  Check, 
  X, 
  MoreHorizontal, 
  ArrowUpRight, 
  Bot, 
  Zap, 
  AlertCircle,
  TrendingDown,
  Sliders
} from 'lucide-react';
import { Client, Decision, AIAgent, AutomationScript, AuditLog } from '../types';

interface CommandCenterProps {
  clients: Client[];
  decisions: Decision[];
  agents: AIAgent[];
  scripts: AutomationScript[];
  onStageDecision: (decision: Decision) => void;
  onRejectDecision: (id: string, note?: string) => void;
  onPostponeDecision: (id: string) => void;
  onSelectClient: (id: string) => void;
  spendHistory: Array<{ date: string; spend: number; target: number; conversions: number }>;
  currentTheme: 'light' | 'dark';
  searchQuery: string;
}

export default function CommandCenter({
  clients,
  decisions,
  agents,
  scripts,
  onStageDecision,
  onRejectDecision,
  onPostponeDecision,
  onSelectClient,
  spendHistory,
  currentTheme,
  searchQuery
}: CommandCenterProps) {
  const [selectedDetails, setSelectedDetails] = useState<Decision | null>(null);

  // Rejection note states
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectNote, setRejectNote] = useState('');

  // Filter decisions based on query
  const filteredDecisions = decisions.filter(d => 
    d.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Stats calculation
  const pendingCount = decisions.filter(d => d.status === 'pending' || d.status === 'staged').length;
  const highPriorityCount = decisions.filter(d => d.priority === 'high' && (d.status === 'pending' || d.status === 'staged')).length;
  const criticalBalancesCount = clients.filter(c => c.status === 'warning' || c.riskLevel === 'high').length;
  
  // Custom script quick status indicator mapping
  const scriptStatusColors: Record<string, string> = {
    active: 'bg-emerald-500',
    warning: 'bg-amber-400',
    failed: 'bg-rose-500',
    idle: 'bg-slate-400'
  };

  // High quality custom SVG chart generators
  const maxSpend = Math.max(...spendHistory.map(d => d.spend));
  const minSpend = Math.min(...spendHistory.map(d => d.spend));
  const heightRatio = 80 / (maxSpend - minSpend + 3000);
  const widthStep = 450 / (spendHistory.length - 1);
  
  // Create path coordinates
  const svgPoints = spendHistory.map((d, i) => {
    const x = i * widthStep + 10;
    const y = 90 - (d.spend - minSpend) * heightRatio;
    return `${x},${y}`;
  }).join(' ');

  const targetPoints = spendHistory.map((d, i) => {
    const x = i * widthStep + 10;
    const y = 90 - (d.target - minSpend) * heightRatio;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* SECTION 2: OPERATIONAL DAY (ОПЕРАЦІЙНИЙ ДЕНЬ) */}
      <div className={`p-4 rounded-lg border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
        currentTheme === 'light' 
          ? 'bg-slate-50 border-slate-200' 
          : 'bg-slate-900/60 border-slate-850'
      }`}>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-500 text-[10px] font-mono rounded font-bold uppercase tracking-wider">
              Стан дня
            </span>
            <span className="text-slate-405 text-xs">PPC Cockpit Summary</span>
          </div>
          <h3 className="text-base font-semibold font-display tracking-tight text-indigo-950 dark:text-slate-100">
            Сьогодні потрібно перевірити {clients.filter(c => c.status === 'warning').length} клієнтів, підтвердити {pendingCount} рекомендації, поповнити {clients.filter(c => c.riskLevel === 'high').length} баланс.
          </h3>
          <p className="text-xs text-slate-400">
            Скрипти фіксують нецільові фрази в Beta. Рекомендаційне ядро стабілізувало CPA по Gamma.
          </p>
        </div>

        {/* Dense Counter Blocks */}
        <div className="flex gap-2 flex-shrink-0 w-full md:w-auto">
          <div className="bg-rose-500/10 border border-rose-500/20 px-3 py-2 rounded text-center min-w-24">
            <span className="text-rose-500 text-lg font-bold font-display block leading-none">
              {highPriorityCount}
            </span>
            <span className="text-[10px] text-rose-600 font-mono uppercase tracking-wider block mt-1">
              Увага (High)
            </span>
          </div>
          <div className="bg-amber-500/10 border border-amber-500/20 px-3 py-2 rounded text-center min-w-24">
            <span className="text-amber-500 text-lg font-bold font-display block leading-none">
              {pendingCount}
            </span>
            <span className="text-[10px] text-amber-600 font-mono uppercase tracking-wider block mt-1">
              Черга дій
            </span>
          </div>
          <div className="bg-indigo-500/10 border border-indigo-500/20 px-3 py-2 rounded text-center min-w-24">
            <span className="text-indigo-500 text-lg font-bold font-display block leading-none">
              4 / 4
            </span>
            <span className="text-[10px] text-indigo-650 font-mono uppercase tracking-wider block mt-1">
              AI Моніторинг
            </span>
          </div>
        </div>
      </div>

      {/* Grid Layout: Main decisions room Left / Scripts & Charts Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Section - Decisions Queue (Черга рішень) */}
        <div className="lg:col-span-2 space-y-6">
          <div className={`p-5 rounded-lg border ${
            currentTheme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
          }`}>
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <CheckSquare size={16} className="text-indigo-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-display">
                  Черга рішень ({pendingCount})
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                Сортування: найперші за пріоритетом
              </span>
            </div>

            {/* Decisions List */}
            {filteredDecisions.filter(d => d.status === 'pending' || d.status === 'staged').length > 0 ? (
              <div className="space-y-3">
                {filteredDecisions.filter(d => d.status === 'pending' || d.status === 'staged').map((decision) => (
                  <div 
                    key={decision.id}
                    id={`decision-card-${decision.id}`}
                    className={`p-3.5 rounded border transition-all duration-150 relative overflow-hidden group ${
                      decision.priority === 'high' 
                        ? 'border-l-4 border-l-rose-500 ' 
                        : decision.priority === 'medium' 
                        ? 'border-l-4 border-l-amber-500 ' 
                        : 'border-l-4 border-l-slate-400 '
                    } ${
                      decision.status === 'staged'
                        ? (currentTheme === 'light' ? 'bg-slate-100/50 border-slate-200 opacity-75' : 'bg-slate-900/40 border-slate-850 opacity-75')
                        : currentTheme === 'light' 
                        ? 'bg-slate-50 hover:bg-slate-100 border-slate-205' 
                        : 'bg-slate-850 hover:bg-slate-800 border-slate-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1 pb-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-xs text-indigo-650 dark:text-indigo-400">
                             {decision.clientName}
                          </span>
                          <span className={`text-[9px] px-1.5 py-0.2 rounded font-semibold uppercase ${
                            decision.priority === 'high' 
                              ? 'bg-rose-500/10 text-rose-500' 
                              : decision.priority === 'medium' 
                              ? 'bg-amber-500/10 text-amber-500' 
                              : 'bg-slate-500/10 text-slate-400'
                          }`}>
                            {decision.priority}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            Джерело: <span className="font-medium text-slate-350">{decision.sourceName}</span>
                          </span>
                          {decision.status === 'staged' && (
                            <span className="text-[9px] bg-indigo-500/10 text-indigo-400 px-1.5 rounded font-bold uppercase tracking-wider font-mono">
                              В черзі вигрузки
                            </span>
                          )}
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1">
                          {decision.title}
                        </h4>
                        <p className="text-xs text-slate-400 leading-relaxed max-w-2xl mt-0.5">
                          {decision.desc}
                        </p>

                        {decision.feedbackStats && (decision.feedbackStats.timesApproved > 0 || decision.feedbackStats.timesRejected > 0) && (
                          <div className="mt-2.5 flex flex-wrap items-center gap-2 p-1.5 px-2.5 rounded bg-indigo-550/[0.04] border border-indigo-500/10 text-[10px] font-mono text-slate-400">
                            <span className="text-indigo-400 font-bold uppercase tracking-wider text-[9px]">🧠 Memory recall:</span>
                            {decision.feedbackStats.timesApproved > 0 && (
                              <span className="text-emerald-500 font-bold">✓ Approved {decision.feedbackStats.timesApproved}x</span>
                            )}
                            {decision.feedbackStats.timesRejected > 0 && (
                              <span className="text-rose-500 font-bold">✕ Rejected {decision.feedbackStats.timesRejected}x</span>
                            )}
                            {decision.feedbackStats.lastRejectedAt && (
                              <span className="text-slate-500">(Останнє відхилення: {decision.feedbackStats.lastRejectedAt})</span>
                            )}
                          </div>
                        )}

                        {/* List negatives if type matches */}
                        {decision.actionType === 'add_negatives' && decision.payload.negatives && (
                          <div className="mt-2.5 flex flex-wrap gap-1">
                            {decision.payload.negatives.slice(0, 6).map((word, i) => (
                              <span key={i} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-500/5 text-rose-500 border border-rose-500/10">
                                -{word}
                              </span>
                            ))}
                            {decision.payload.negatives.length > 6 && (
                              <span className="text-[9px] text-slate-400 font-mono self-center">
                                + ще {decision.payload.negatives.length - 6}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Fast parameter preview */}
                        {decision.actionType === 'refill_balance' && decision.payload.amountNeeded && (
                          <div className="mt-2 text-xs font-bold text-emerald-500 bg-emerald-500/5 px-2 py-1 rounded inline-block">
                            Планування: поповнити на {decision.payload.amountNeeded.toLocaleString()} UAH
                          </div>
                        )}
                      </div>

                      {/* Interactive Buttons */}
                      <div className="flex flex-col sm:flex-row items-center gap-1.5 flex-shrink-0">
                        <button
                          onClick={() => setSelectedDetails(decision)}
                          className="px-2 py-1 bg-[#3a6fcb] text-white rounded text-[10px] font-mono hover:bg-[#2b59ab] font-medium w-full text-center"
                        >
                          Переглянути
                        </button>
                        <button
                          onClick={() => {
                            if (decision.status !== 'staged') {
                              onStageDecision(decision);
                            }
                          }}
                          disabled={decision.status === 'staged'}
                          className={`p-1 px-2.5 rounded text-xs font-semibold flex items-center justify-center gap-1 w-full transition-all outline-none ${
                            decision.status === 'staged'
                              ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          }`}
                          title={decision.status === 'staged' ? 'Вже в черзі вигрузки' : 'Поставити в чергу'}
                        >
                          <Check size={12} /> <span className="text-[10px] whitespace-nowrap">{decision.status === 'staged' ? 'В черзі ✓' : 'В чергу'}</span>
                        </button>
                        {decision.status !== 'staged' && (
                          <button
                            onClick={() => onPostponeDecision(decision.id)}
                            className="p-1 text-slate-400 hover:text-slate-100 hover:bg-slate-700 rounded text-xs flex items-center justify-center w-full"
                            title="Відкласти"
                          >
                            <Clock size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400 text-xs">
                <Check size={36} className="mx-auto text-emerald-500 mb-2 p-1.5 bg-emerald-500/10 rounded-full" />
                <p className="font-semibold">Всі рекомендовані дії розглянуто!</p>
                <p className="text-[11px] mt-0.5">Черга рішень пуста. Ви випередили графік автоматизацій.</p>
              </div>
            )}
          </div>

          {/* SECTION 4: CLIENT STATUS - TABLE DESIGN (CTA STATE) */}
          <div className={`p-5 rounded-lg border ${
            currentTheme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
          }`}>
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-indigo-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-display">
                  Активний моніторинг клієнтів ({clients.length} акаунтів Google Ads)
                </h3>
              </div>
              <button 
                onClick={() => onSelectClient('c1')} /* fallbacks to card detail */
                className="text-xs text-indigo-500 hover:underline inline-flex items-center gap-1 font-medium font-sans"
              >
                Всі кабінети <ArrowRight size={12} />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-[11px] font-sans text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 pb-2 text-slate-435 font-mono text-[9px] uppercase">
                    <th className="py-2.5 font-semibold">Покупець / Кабінет</th>
                    <th className="py-2.5 font-semibold text-center">Оцінка (Health)</th>
                    <th className="py-2.5 font-semibold text-right">Ліміт Бюджету</th>
                    <th className="py-2.5 font-semibold text-right">Загальні Витрати</th>
                    <th className="py-2.5 font-semibold text-center">CTR %</th>
                    <th className="py-2.5 font-semibold text-right">Cep. CPC</th>
                    <th className="py-2.5 font-semibold text-center">Конверсії</th>
                    <th className="py-2.5 font-semibold text-right">CPA (Вартість)</th>
                    <th className="py-2.5 font-semibold text-center">Статус Ефективності</th>
                    <th className="py-2.5 font-semibold text-center">Ризик</th>
                    <th className="py-2.5 font-semibold text-right text-indigo-400">Майбутній Крок</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
                  {clients.map((client) => {
                    // Determine CTR highlight state
                    let ctrStyle = "text-amber-600 bg-amber-50 dark:bg-amber-950/20";
                    if (client.ctr >= 5.0) {
                      ctrStyle = "text-emerald-700 bg-emerald-50 dark:bg-emerald-950/20 font-bold";
                    } else if (client.ctr < 2.5) {
                      ctrStyle = "text-rose-700 bg-rose-50 dark:bg-rose-950/20 font-bold";
                    }

                    // Determine CPA highlight state
                    let cpaStyle = "text-amber-600 bg-amber-50 dark:bg-amber-950/20";
                    if (client.cpa <= 240) {
                      cpaStyle = "text-emerald-700 bg-emerald-50 dark:bg-emerald-950/20 font-bold";
                    } else if (client.cpa > 380) {
                      cpaStyle = "text-rose-700 bg-rose-50 dark:bg-rose-950/20 font-bold";
                    }

                    // Dynamic Health Score color
                    let healthStyle = "bg-amber-400/10 text-amber-750 border border-amber-500/20";
                    if (client.healthScore >= 85) {
                      healthStyle = "bg-emerald-500/10 text-emerald-705 border border-emerald-500/20 font-bold";
                    } else if (client.healthScore < 75) {
                      healthStyle = "bg-rose-500/10 text-rose-705 border border-rose-500/20 font-bold";
                    }

                    // Dynamic efficiency label
                    let efficiencyLabel = "Задовільна (Стабільно)";
                    let efficiencyClass = "bg-amber-500/10 text-amber-700 border border-amber-500/20";
                    if (client.ctr >= 4.5 && client.healthScore >= 80) {
                      efficiencyLabel = "Висока (Ефективно)";
                      efficiencyClass = "bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 font-bold";
                    } else if (client.healthScore < 75 || client.ctr < 2.3) {
                      efficiencyLabel = "Низька (Потребує уваги)";
                      efficiencyClass = "bg-rose-500/10 text-rose-700 border border-rose-500/20 font-bold";
                    }

                    return (
                      <tr 
                        key={client.id}
                        onClick={() => onSelectClient(client.id)}
                        className="hover:bg-slate-800/10 cursor-pointer transition-colors"
                      >
                        <td className="py-3 pr-2 font-semibold">
                          <p className="text-slate-900 dark:text-slate-100">{client.name}</p>
                          <span className="text-[9px] font-mono text-slate-400">{client.accountId}</span>
                        </td>
                        <td className="py-3 text-center">
                          <span className={`inline-block px-2 py-0.5 rounded font-mono text-[10px] ${healthStyle}`}>
                            {client.healthScore}%
                          </span>
                        </td>
                        <td className="py-3 text-right text-slate-500 font-mono">
                          {client.budgetLimit.toLocaleString()} {client.currency}
                        </td>
                        <td className="py-3 text-right font-semibold font-mono text-slate-905 dark:text-slate-100">
                          {client.budgetSpent.toLocaleString()} {client.currency}
                        </td>
                        <td className="py-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${ctrStyle}`}>
                            {client.ctr}%
                          </span>
                        </td>
                        <td className="py-3 text-right font-mono text-slate-500">
                          {client.cpc} {client.currency}
                        </td>
                        <td className="py-3 text-center font-mono font-semibold text-slate-800 dark:text-white">
                          {client.conversions}
                        </td>
                        <td className="py-3 text-right">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${cpaStyle}`}>
                            {client.cpa} {client.currency}
                          </span>
                        </td>
                        <td className="py-3 text-center">
                          <span className={`inline-block px-2 py-0.5 rounded text-[9px] ${efficiencyClass}`}>
                            {efficiencyLabel}
                          </span>
                        </td>
                        <td className="py-3 text-center">
                          <span className={`inline-block w-2.5 h-2.5 rounded-full ${
                            client.riskLevel === 'high' 
                              ? 'bg-rose-500 animate-pulse' 
                              : client.riskLevel === 'medium'
                              ? 'bg-amber-400'
                              : 'bg-emerald-500'
                          }`} title={`Ризик: ${client.riskLevel}`} />
                        </td>
                        <td className="py-3 text-right text-indigo-500 dark:text-indigo-400 font-mono text-[9px] max-w-44 truncate">
                          {client.nextStep}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Section - AI Agents, Python Scripts, Charts */}
        <div className="space-y-6">
          
          {/* AI AGENTS WIDGET */}
          <div className={`p-5 rounded-lg border ${
            currentTheme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
          }`}>
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Bot size={16} className="text-indigo-505" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-display">
                  Активні AI агенти
                </h3>
              </div>
              <span className="text-[10px] text-emerald-500 font-sans font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block animate-ping" /> Online
              </span>
            </div>

            <div className="space-y-3.5">
              {agents.map((agent) => (
                <div key={agent.id} className="p-3 bg-slate-800/10 dark:bg-slate-950/40 rounded border border-slate-800/20">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Zap size={11} className="text-indigo-400" />
                        {agent.name}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                        {agent.desc}
                      </p>
                    </div>
                    <span className={`px-1 rounded text-[8px] font-mono uppercase ${
                      agent.status === 'active' 
                        ? 'bg-emerald-500/10 text-emerald-400' 
                        : agent.status === 'running'
                        ? 'bg-indigo-500/10 text-indigo-400 animate-pulse'
                        : 'bg-slate-500/10 text-slate-400'
                    }`}>
                      {agent.status}
                    </span>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-805/10 flex justify-between items-center text-[10px]">
                    <span className="text-slate-400 font-mono">{agent.statsLabel}:</span>
                    <span className="font-bold text-slate-800 dark:text-neutral-250 font-mono">{agent.statsValue}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PYTHON SCRIPTS WIDGET */}
          <div className={`p-5 rounded-lg border ${
            currentTheme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
          }`}>
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Sliders size={16} className="text-indigo-505" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-display">
                  Розклад Python Скриптів
                </h3>
              </div>
            </div>

            <div className="space-y-2.5">
              {scripts.slice(0, 4).map((script) => (
                <div key={script.id} className="text-[11px] font-sans flex items-start gap-2 justify-between">
                  <div>
                    <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${scriptStatusColors[script.status]}`} />
                      {script.filename}
                    </span>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                      Last: {script.lastRun} | Next: {script.nextRun}
                    </p>
                  </div>
                  <span className={`px-1 rounded text-[8px] font-mono ${
                    script.status === 'failed' ? 'bg-rose-500/10 text-rose-500' : 'bg-slate-850 text-slate-500'
                  }`}>
                    {script.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* DEREGULATED SPEND GRAPH */}
          <div className={`p-5 rounded-lg border ${
            currentTheme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
          }`}>
            <div className="flex justify-between items-center pb-2 mb-3">
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-indigo-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-display">
                  Витрати за останні 14 днів
                </h3>
              </div>
            </div>

            {/* Render Custom Responsive SVG Chart */}
            <div className="relative pt-4 w-full h-32 border border-slate-200/50 dark:border-slate-800/50 bg-slate-500/5 rounded-md px-2 flex flex-col justify-end">
              
              {/* Legend */}
              <div className="absolute top-1 right-2 flex gap-2 text-[8px] font-mono">
                <span className="flex items-center gap-1 text-slate-400">
                  <span className="w-2 h-0.5 bg-slate-400 block" /> План
                </span>
                <span className="flex items-center gap-1 text-indigo-500">
                  <span className="w-2 h-0.5 bg-indigo-500 block" /> Факт
                </span>
              </div>

              <svg viewBox="0 0 470 100" className="w-full h-24 overflow-visible">
                {/* Horizontal reference lines */}
                <line x1="0" y1="20" x2="470" y2="20" stroke="rgba(148, 163, 184, 0.15)" strokeDasharray="3" />
                <line x1="0" y1="50" x2="470" y2="50" stroke="rgba(148, 163, 184, 0.15)" strokeDasharray="3" />
                <line x1="0" y1="80" x2="470" y2="80" stroke="rgba(148, 163, 184, 0.15)" strokeDasharray="3" />

                {/* Target line (Plan) */}
                <polyline
                  fill="none"
                  stroke="#cbd5e1"
                  strokeWidth="1.5"
                  strokeDasharray="4"
                  points={targetPoints}
                />
                
                {/* Spend line */}
                <polyline
                  fill="none"
                  stroke="#4f46e5"
                  strokeWidth="2"
                  points={svgPoints}
                />

                {/* Dots on nodes */}
                {spendHistory.map((d, i) => {
                  const x = i * widthStep + 10;
                  const y = 90 - (d.spend - minSpend) * heightRatio;
                  return (
                    <circle
                      key={i}
                      cx={x}
                      cy={y}
                      r="2.5"
                      fill="#4f46e5"
                      className="cursor-pointer group hover:r-4 transition"
                      title={`${d.date}: ${d.spend} UAH`}
                    />
                  );
                })}
              </svg>

              {/* Bottom text timeline */}
              <div className="flex justify-between text-[8px] text-slate-405 font-mono pt-1 mb-1 px-1">
                <span>{spendHistory[0].date}</span>
                <span>{spendHistory[Math.floor(spendHistory.length / 2)].date}</span>
                <span>{spendHistory[spendHistory.length - 1].date}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-805/15 flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <div className="flex items-center gap-1">
                <TrendingUp size={12} className="text-emerald-500" />
                <span>Середній CTR: <b>3.08%</b></span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingDown size={12} className="text-indigo-500" />
                <span>Загальний CPA: <b>298.5 UAH</b></span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Decision Detail Slide-over modal */}
      {selectedDetails && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`p-6 rounded-lg max-w-lg w-full border relative ${
            currentTheme === 'light' ? 'bg-white border-slate-205 text-slate-800' : 'bg-slate-905 border-slate-800 text-white'
          }`}>
            <button
              onClick={() => setSelectedDetails(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X size={18} />
            </button>
            <div className="mb-4">
              <span className={`text-[9px] px-2 py-0.5 rounded uppercase font-bold ${
                selectedDetails.priority === 'high' ? 'bg-rose-500/20 text-rose-500' : 'bg-amber-500/20 text-amber-500'
              }`}>
                {selectedDetails.priority} пріоритет
              </span>
              <h3 className="text-base font-bold font-display mt-2">
                {selectedDetails.title}
              </h3>
              <p className="text-[10px] text-slate-400 mt-1 font-mono">
                Клієнт: {selectedDetails.clientName} | Джерело: {selectedDetails.sourceName}
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <h5 className="text-xs font-semibold text-slate-400 uppercase font-mono tracking-wider mb-1">
                  Обрунтування штучного інтелекту:
                </h5>
                <p className="text-xs leading-relaxed bg-slate-900/40 p-3 rounded border border-slate-800/10">
                  {selectedDetails.desc}
                </p>
              </div>

              {selectedDetails.actionType === 'add_negatives' && selectedDetails.payload.negatives && (
                <div>
                  <h5 className="text-xs font-semibold text-slate-400 uppercase font-mono tracking-wider mb-2">
                    Повний список мінус-слів для імпорту ({selectedDetails.payload.negatives.length}):
                  </h5>
                  <div className="max-h-24 overflow-y-auto bg-slate-950/60 p-2.5 rounded font-mono text-[10px] grid grid-cols-2 gap-1 border border-slate-800/30">
                    {selectedDetails.payload.negatives.map((negative, idx) => (
                      <span key={idx} className="text-rose-400">-{negative}</span>
                    ))}
                  </div>
                </div>
              )}

              {selectedDetails.actionType === 'refill_balance' && selectedDetails.payload.amountNeeded && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded">
                  <p className="text-xs text-emerald-500 font-bold">
                    Буде розраховано авто-платіж на суму {selectedDetails.payload.amountNeeded.toLocaleString()} UAH.
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Спланована тривалість: ~5.3 діб при поточному burn-rate.
                  </p>
                </div>
              )}

              {selectedDetails.payload.details && (
                <div>
                  <h5 className="text-xs font-semibold text-slate-400 uppercase font-mono tracking-wider mb-1">
                    Інші супутні деталі:
                  </h5>
                  <p className="text-xs font-mono text-slate-350 bg-slate-900/30 p-2 rounded">
                    {selectedDetails.payload.details}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setRejectingId(selectedDetails.id);
                  setRejectNote('');
                }}
                className="px-4 py-1.5 rounded text-xs hover:bg-rose-500/10 border border-transparent text-rose-500 font-mono"
              >
                Відхилити
              </button>
              {selectedDetails.status !== 'staged' && (
                <button
                  onClick={() => { onPostponeDecision(selectedDetails.id); setSelectedDetails(null); }}
                  className="px-4 py-1.5 rounded text-xs hover:bg-slate-800 border border-slate-700 text-slate-400 font-mono"
                >
                  Відкласти на 24г
                </button>
              )}
              <button
                onClick={() => {
                  if (selectedDetails.status !== 'staged') {
                    onStageDecision(selectedDetails);
                    setSelectedDetails(null);
                  }
                }}
                disabled={selectedDetails.status === 'staged'}
                className={`px-5 py-1.5 rounded text-xs font-bold transition-all ${
                  selectedDetails.status === 'staged'
                    ? 'bg-slate-300 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                    : 'bg-indigo-650 hover:bg-indigo-700 text-white'
                }`}
              >
                {selectedDetails.status === 'staged' ? 'В черзі вигрузки ✓' : 'Додати в чергу'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REJECTION NOTE MODAL */}
      {rejectingId && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className={`p-5 rounded-lg border max-w-sm w-full space-y-4 ${
            currentTheme === 'light' ? 'bg-white border-slate-250 text-slate-800' : 'bg-slate-905 border-slate-800 text-white'
          } animate-scale-up`}>
            <div>
              <h4 className="font-bold text-xs font-mono uppercase text-indigo-400 mb-1">Причина відхилення рекомендації</h4>
              <p className="text-[10px] text-slate-455">Вкажіть причину для навчання алгоритму:</p>
            </div>
            <textarea
              value={rejectNote}
              onChange={(e) => setRejectNote(e.target.value)}
              placeholder="Наприклад: неактуальне ключове слово, завеликий CPA..."
              rows={3}
              className="w-full p-2.5 bg-slate-100/10 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded outline-none text-xs text-white placeholder-slate-500 font-mono"
            />
            <div className="flex justify-end gap-2 text-xs font-mono">
              <button
                onClick={() => {
                  setRejectingId(null);
                  setRejectNote('');
                }}
                className="px-3 py-1.5 hover:bg-slate-800 rounded border border-slate-755 text-slate-400"
              >
                Скасувати
              </button>
              <button
                onClick={() => {
                  onRejectDecision(rejectingId, rejectNote.trim() || undefined);
                  setRejectingId(null);
                  setRejectNote('');
                  setSelectedDetails(null);
                }}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-750 text-white font-bold rounded"
              >
                Відхилити
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
