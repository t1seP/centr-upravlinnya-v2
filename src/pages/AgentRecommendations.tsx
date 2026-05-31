import React, { useState } from 'react';
import { 
  Cpu, 
  Bot, 
  Check, 
  X, 
  Sliders, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  BrainCircuit
} from 'lucide-react';
import { AIAgent, Decision } from '../types';

interface AgentRecommendationsProps {
  agents: AIAgent[];
  decisions: Decision[];
  onStageDecision: (decision: Decision) => void;
  onRejectDecision: (id: string, note?: string) => void;
  currentTheme: 'light' | 'dark';
  onAddDecisionLog: (msg: string, level: 'info' | 'success' | 'warning' | 'critical') => void;
}

export default function AgentRecommendations({
  agents,
  decisions,
  onStageDecision,
  onRejectDecision,
  currentTheme,
  onAddDecisionLog
}: AgentRecommendationsProps) {
  
  const pendingDecisions = decisions.filter(d => d.status === 'pending' || d.status === 'staged');
  const [activeFilter, setActiveFilter] = useState<'all' | 'agent' | 'script'>('all');

  // Rejection note states
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectNote, setRejectNote] = useState('');

  const filteredDecisions = pendingDecisions.filter(d => {
    if (activeFilter === 'all') return true;
    return d.source === activeFilter;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Top statistics banners */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <div 
            key={agent.id}
            className={`p-4 rounded-lg border flex flex-col justify-between ${
              currentTheme === 'light' ? 'bg-white border-slate-205' : 'bg-slate-900 border-slate-800'
            }`}
          >
            <div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-800/10 mb-3">
                <h4 className="text-xs font-bold font-mono text-indigo-505 dark:text-indigo-400 flex items-center gap-1">
                  <Cpu size={14} />
                  {agent.name}
                </h4>
                <span className={`w-2 h-2 rounded-full ${agent.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'}`} />
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed font-sans">{agent.desc}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/10 space-y-1.5 text-[11px] font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">{agent.statsLabel}:</span>
                <span className="font-bold text-slate-850 dark:text-slate-100">{agent.statsValue}</span>
              </div>
              {agent.memoryStats && (
                <div className="pt-2 border-t border-slate-500/10 space-y-1 text-[10px] text-slate-400">
                  <p className="font-bold text-indigo-400 uppercase tracking-wider text-[9px] mb-1">
                    🧠 Memory (feedback stats):
                  </p>
                  <div className="grid grid-cols-2 gap-y-0.5">
                    <span>Рішень в пам'яті:</span>
                    <span className="text-right font-bold text-slate-205">{agent.memoryStats.totalDecisions}</span>
                    <span>Approval Rate:</span>
                    <span className="text-right font-bold text-indigo-400">{agent.memoryStats.approvalRate}%</span>
                    <span>Learning Status:</span>
                    <span className="text-right font-bold text-emerald-400 capitalize">{agent.learningStatus?.replace('_', ' ')}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Main Decisions Desk */}
      <div className={`p-5 rounded-lg border space-y-4 ${
        currentTheme === 'light' ? 'bg-white border-slate-205' : 'bg-slate-900 border-slate-800'
      }`}>
        <div className="pb-3 border-b border-slate-800/10 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-display flex items-center gap-2">
              <BrainCircuit size={16} className="text-indigo-500" />
              Адміністративна панель погодження рішень асистентів
            </h4>
            <p className="text-[10px] text-slate-400">Тут виступає верифікаційний щит: жодна зміна не піде в Google Ads без кліку "Впровадити"</p>
          </div>

          <div className="flex gap-1.5 font-mono text-[10px]">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-2 py-1 rounded border ${
                activeFilter === 'all'
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-slate-800/20 text-slate-400 border-slate-800'
              }`}
            >
              Всі ({pendingDecisions.length})
            </button>
            <button
              onClick={() => setActiveFilter('agent')}
              className={`px-2 py-1 rounded border ${
                activeFilter === 'agent'
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-slate-800/20 text-slate-400 border-slate-800'
              }`}
            >
              Тільки AI ({pendingDecisions.filter(d => d.source === 'agent').length})
            </button>
            <button
              onClick={() => setActiveFilter('script')}
              className={`px-2 py-1 rounded border ${
                activeFilter === 'script'
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-slate-800/20 text-slate-400 border-slate-800'
              }`}
            >
              Скрипти ({pendingDecisions.filter(d => d.source === 'script').length})
            </button>
          </div>
        </div>

        {/* Content list */}
        {filteredDecisions.length > 0 ? (
          <div className="space-y-4">
            {filteredDecisions.map((decision) => (
              <div 
                key={decision.id}
                className={`p-4 rounded border text-xs space-y-2.5 transition-colors ${
                  decision.priority === 'high' 
                    ? 'border-l-4 border-l-rose-500 bg-rose-500/5 border-rose-500/10' 
                    : 'border-l-4 border-l-amber-500 bg-amber-500/5 border-slate-800'
                }`}
              >
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div>
                    <span className="font-semibold text-indigo-455 text-xs mr-2">{decision.clientName}</span>
                    <span className="text-slate-401 font-mono text-[10px]">({decision.sourceName})</span>
                    <h5 className="font-bold text-slate-905 dark:text-slate-100 text-sm mt-1">{decision.title}</h5>
                  </div>
                  <span className={`px-1.5 rounded text-[9px] font-mono uppercase font-bold ${
                    decision.priority === 'high' ? 'bg-rose-500/20 text-rose-500' : 'bg-amber-500/20 text-amber-500'
                  }`}>
                    {decision.priority} пріоритет
                  </span>
                </div>

                <p className="text-slate-400 text-xs leading-relaxed max-w-4xl">{decision.desc}</p>

                {decision.feedbackStats && (decision.feedbackStats.timesApproved > 0 || decision.feedbackStats.timesRejected > 0) && (
                  <div className="flex flex-wrap items-center gap-2.5 p-2 px-3 rounded bg-indigo-505/[0.04] border border-indigo-500/10 text-[10px] font-mono text-slate-400">
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

                {decision.payload.negatives && (
                  <div className="p-2.5 bg-slate-950/40 rounded border border-slate-800/10 font-mono text-[10px] text-slate-400">
                    <span className="font-bold block text-slate-300 uppercase tracking-widest text-[9px] mb-1">Ключові виключення:</span>
                    {decision.payload.negatives.join(', ')}
                  </div>
                )}

                <div className="pt-2 border-t border-slate-800/10 flex justify-end gap-1.5 font-mono items-center">
                  {decision.status === 'staged' && (
                    <span className="text-[10px] font-mono text-indigo-405 dark:text-indigo-400 font-semibold mr-auto">
                      ● Очікує вигрузки в Google Ads
                    </span>
                  )}
                  {decision.status !== 'staged' && (
                    <button
                      onClick={() => {
                        setRejectingId(decision.id);
                        setRejectNote('');
                      }}
                      className="px-3 py-1 bg-[#3a6fcb] hover:bg-[#2052ab] text-white rounded text-[11px] font-mono"
                    >
                      Відхилити
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (decision.status !== 'staged') {
                        onStageDecision(decision);
                        onAddDecisionLog(`Рекомендація "${decision.title}" додана в чергу вигрузки staging`, 'info');
                      }
                    }}
                    disabled={decision.status === 'staged'}
                    className={`px-3 py-1 rounded text-[11px] font-bold transition-all ${
                      decision.status === 'staged'
                        ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed border-none'
                        : 'bg-emerald-650 hover:bg-emerald-755 text-white'
                    }`}
                  >
                    {decision.status === 'staged' ? 'В черзі ✓' : 'В чергу'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-slate-400">
            <CheckCircle size={32} className="mx-auto text-emerald-500 mb-2 p-1 bg-emerald-500/10 rounded-full" />
            <p className="font-bold">Лист узгодження рішень чистий!</p>
            <p className="text-[10px] mt-0.5">Всі знайдені аномалії оброблені та впроваджені спеціалістом.</p>
          </div>
        )}
      </div>

      {/* REJECTION NOTE MODAL */}
      {rejectingId && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`p-5 rounded-lg border max-w-sm w-full space-y-4 ${
            currentTheme === 'light' ? 'bg-white border-slate-250 text-slate-800' : 'bg-slate-905 border-slate-800 text-white'
          } animate-scale-up`}>
            <div>
              <h4 className="font-bold text-xs font-mono uppercase text-indigo-400 mb-1">Причина відхилення рекомендації</h4>
              <p className="text-[10px] text-slate-450">Вкажіть причину для навчання алгоритму:</p>
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
                  onAddDecisionLog(`Агент: Пропозицію відхилено користувачем ручно.${rejectNote ? ` Причина: ${rejectNote}` : ''}`, 'warning');
                  setRejectingId(null);
                  setRejectNote('');
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
