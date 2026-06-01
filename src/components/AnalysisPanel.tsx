import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Activity, 
  Check, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp, 
  Info, 
  Plus, 
  ThumbsUp, 
  Clock, 
  ArrowRight,
  TrendingUp,
  X
} from 'lucide-react';
import { Campaign, Client, AgentAnalysisResult, AnalysisChange } from '../types';
import { generateMockAnalysis } from '../mockData';

interface AnalysisPanelProps {
  campaign: Campaign;
  client: Client;
  currentTheme: 'light' | 'dark';
  onAddStagedChanges: (changesToAdd: any[]) => void;
  onClose: () => void;
  onAddDecisionLog: (msg: string, level: 'info' | 'success' | 'warning' | 'critical') => void;
}

const LOADING_STEPS = [
  "Підключення до Google Ads API...",
  "Скануємо структуру кампанії та групи оголошень...",
  "Витягуємо метрики за останні 14 днів...",
  "Порівнюємо поточний CPA з цільовим порогом клієнта...",
  "Аналізуємо коефіцієнт конверсії та CTR у розрізі пристроїв...",
  "Перевіряємо завантажені оголошення та розширення реклами...",
  "Аналізуємо релевантність пошукових запитів через AI ядро...",
  "Фіналізуємо перелік рекомендацій та оцінюємо потенційний ефект..."
];

export default function AnalysisPanel({
  campaign,
  client,
  currentTheme,
  onAddStagedChanges,
  onClose,
  onAddDecisionLog
}: AnalysisPanelProps) {
  const [status, setStatus] = useState<'loading' | 'result'>('loading');
  const [loadingStep, setLoadingStep] = useState(0);
  const [analysis, setAnalysis] = useState<AgentAnalysisResult | null>(null);
  const [expandedReasoning, setExpandedReasoning] = useState<Record<string, boolean>>({});
  const [selectedChanges, setSelectedChanges] = useState<Record<string, boolean>>({});

  // Simulate loading steps sequentially
  useEffect(() => {
    setStatus('loading');
    setLoadingStep(0);
    
    const interval = setInterval(() => {
      setLoadingStep(prev => {
        if (prev < LOADING_STEPS.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          return prev;
        }
      });
    }, 450);

    const timer = setTimeout(() => {
      const gResult = generateMockAnalysis(campaign, client);
      setAnalysis(gResult);
      
      // Initialize default selection: High priority checked, others unchecked
      const initialSelection: Record<string, boolean> = {};
      gResult.changes.forEach(change => {
        initialSelection[change.id] = change.priority === 'high';
      });
      setSelectedChanges(initialSelection);
      
      setStatus('result');
      onAddDecisionLog(
        `AI Agent: Завершено глибокий технічний аудит кампанії "${campaign.name}" компанії ${client.name}. Знайдено ${gResult.changes.length} зон росту.`, 
        gResult.campaign_health === 'critical' ? 'critical' : 'success'
      );
    }, 4000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [campaign.id]);

  const toggleExpand = (id: string) => {
    setExpandedReasoning(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCheckboxToggle = (id: string) => {
    setSelectedChanges(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddSelectedToStaging = () => {
    if (!analysis) return;
    const itemsToStage = analysis.changes.filter(c => selectedChanges[c.id]);
    if (itemsToStage.length === 0) return;

    const changesToSubmit = itemsToStage.map(item => ({
      clientId: client.id,
      clientName: client.name,
      type: item.action_type === 'test_recommendation' ? 'create_asset' : item.action_type,
      description: `Агент: ${item.solution} (${item.priority.toUpperCase()})`,
      payload: { ...item.payload, origin: 'campaign_analysis', campaignName: campaign.name },
      source: 'agent_decision' as const
    }));

    onAddStagedChanges(changesToSubmit);
    onClose();
  };

  const activeChangesCount = Object.values(selectedChanges).filter(Boolean).length;

  if (status === 'loading') {
    return (
      <div className={`p-6 rounded-lg border flex flex-col items-center justify-center min-h-[220px] shadow-sm transition animate-pulse duration-1000 ${
        currentTheme === 'light' 
          ? 'bg-indigo-50/10 border-indigo-150 text-slate-800' 
          : 'bg-indigo-950/5 border-indigo-950/20 text-slate-200'
      }`}>
        <div className="relative mb-4 flex items-center justify-center">
          <div className="absolute w-12 h-12 border-2 border-indigo-550 border-t-transparent rounded-full animate-spin"></div>
          <Sparkles className="text-indigo-500 animate-bounce duration-700" size={24} />
        </div>
        <p className="text-xs font-bold font-mono tracking-wider text-slate-400 uppercase mb-1">
          Запуск інтелектуального аудиту
        </p>
        <span className="text-[11px] text-indigo-500 dark:text-indigo-400 font-mono text-center max-w-sm">
          {LOADING_STEPS[loadingStep]}
        </span>
        <div className="w-48 bg-slate-200 dark:bg-slate-800 h-1 rounded-full overflow-hidden mt-3.5">
          <div 
            className="bg-indigo-600 h-full transition-all duration-300"
            style={{ width: `${((loadingStep + 1) / LOADING_STEPS.length) * 100}%` }}
          ></div>
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  const healthClasses = {
    good: 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-500 border border-amber-500/20',
    critical: 'bg-rose-500/10 text-rose-500 border border-rose-500/20',
    stable: 'bg-slate-500/10 text-slate-500 border border-slate-500/20'
  };

  const healthLabels = {
    good: 'Відмінна стабільність',
    warning: 'Потребує оптимізації',
    critical: 'Критичні відхилення',
    stable: 'Кампанія призупинена'
  };

  return (
    <div className={`p-5 rounded-lg border text-left space-y-4 shadow-inner relative transition-colors ${
      currentTheme === 'light' 
        ? 'bg-slate-50/70 border-slate-205' 
        : 'bg-[#0f172a] border-slate-800/80'
    }`}>
      {/* Header element */}
      <div className="flex flex-wrap justify-between items-start gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1 px-1.5 rounded-md bg-indigo-600 text-white font-bold text-[10px] uppercase font-mono flex items-center gap-1">
              <Sparkles size={10} /> ШІ Співкомпонент
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase ${healthClasses[analysis.campaign_health]}`}>
              {healthLabels[analysis.campaign_health]}
            </span>
          </div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-neutral-100 flex items-center gap-1.5 font-display">
            Технічний аудит: {analysis.campaignName}
          </h4>
        </div>
        <button 
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-neutral-300 p-1 bg-slate-200/40 dark:bg-slate-800/50 rounded cursor-pointer transition"
          title="Закрити аудит"
        >
          <X size={12} />
        </button>
      </div>

      {/* Summary Line */}
      <p className="text-xs text-slate-600 dark:text-slate-300 italic font-medium leading-relaxed max-w-4xl p-2.5 px-3 rounded border bg-indigo-500/[0.02] border-indigo-500/10 dark:border-indigo-500/5">
        &ldquo;{analysis.summary}&rdquo;
      </p>

      {/* Change cards list */}
      <div className="space-y-2.5">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
          Знайдені аномалії та пропозиції впровадження
        </div>
        
        {analysis.changes.map((item) => {
          const priorityStyles = {
            high: 'border-l-3 border-l-rose-500 bg-rose-500/[0.02]',
            medium: 'border-l-3 border-l-amber-500 bg-amber-500/[0.01]',
            low: 'border-l-3 border-l-slate-400 bg-slate-500/[0.01]'
          };

          const isChecked = !!selectedChanges[item.id];

          return (
            <div 
              key={item.id}
              className={`p-3.5 rounded border transition ${priorityStyles[item.priority]} ${
                currentTheme === 'light' 
                  ? 'bg-white border-slate-200 hover:border-slate-300' 
                  : 'bg-slate-900/60 border-slate-800/70 hover:border-slate-750'
              } ${!isChecked ? 'opacity-70 grayscale-[25%]' : ''}`}
            >
              <div className="flex items-start gap-3">
                {/* Checkbox */}
                <div className="pt-0.5">
                  <input 
                    type="checkbox"
                    id={item.id}
                    checked={isChecked}
                    onChange={() => handleCheckboxToggle(item.id)}
                    className="w-3.5 h-3.5 accent-indigo-600 rounded cursor-pointer"
                  />
                </div>

                <div className="flex-1 space-y-1">
                  {/* Priority and description */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[8px] font-mono font-bold px-1 rounded uppercase tracking-wider ${
                      item.priority === 'high' 
                        ? 'bg-rose-500/15 text-rose-500' 
                        : item.priority === 'medium'
                        ? 'bg-amber-500/15 text-amber-550'
                        : 'bg-slate-500/15 text-slate-400'
                    }`}>
                      {item.priority}
                    </span>
                    <span className="text-[10px] text-indigo-550 dark:text-indigo-400 font-medium">
                      {item.action_type}
                    </span>
                  </div>

                  <h5 className="text-[11px] font-bold text-slate-900 dark:text-neutral-100">
                    <span className="text-slate-400">Проблема:</span> {item.problem}
                  </h5>

                  <p className="text-[11px] font-medium text-slate-650 dark:text-slate-300">
                    <span className="text-slate-400 font-normal">Вирішення ШІ:</span> {item.solution}
                  </p>

                  <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold font-mono">
                    <TrendingUp size={11} />
                    <span>Ефект за прогнозом: {item.impact}</span>
                  </div>

                  {/* Expand reasoning section */}
                  {expandedReasoning[item.id] ? (
                    <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-505 dark:text-slate-400 leading-relaxed font-mono space-y-1 pb-1">
                      <div className="text-slate-400 font-bold uppercase tracking-wider text-[8px] flex items-center gap-1">
                        <Info size={10} /> Глибока аналітика та бекграунд:
                      </div>
                      <p>{item.reasoning}</p>
                      
                      {item.payload && (
                        <div className="bg-slate-200/30 dark:bg-slate-950/30 p-1.5 rounded text-[8px] font-mono mt-1 text-slate-500 border border-slate-100 dark:border-slate-850">
                          Payload: {JSON.stringify(item.payload, null, 2)}
                        </div>
                      )}
                    </div>
                  ) : null}

                  {/* Toggle button */}
                  <button
                    onClick={() => toggleExpand(item.id)}
                    className="text-[10px] text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 select-none cursor-pointer flex items-center gap-1 pt-1 underline decoration-dotted decoration-slate-350"
                  >
                    {expandedReasoning[item.id] ? (
                      <>
                        <span>Згорнути аналітику</span>
                        <ChevronUp size={10} />
                      </>
                    ) : (
                      <>
                        <span>Читати детальне обґрунтування</span>
                        <ChevronDown size={10} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {analysis.agent_notes && (
        <div className="p-2.5 px-3 rounded bg-amber-500/[0.02] border border-amber-500/10 text-[10px] text-amber-600 dark:text-amber-400/90 font-mono leading-relaxed space-y-1">
          <span className="font-bold uppercase tracking-wider block text-[8px]">🧠 Додаткова примітка асистента:</span>
          <p>{analysis.agent_notes}</p>
        </div>
      )}

      {/* Control Actions footer */}
      <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between flex-wrap gap-2">
        <span className="text-[11px] text-slate-400 font-mono">
          Обрано рекомендацій до впровадження: <strong className="text-slate-900 dark:text-white">{activeChangesCount}</strong>
        </span>
        
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-[11px] font-mono font-medium rounded hover:bg-slate-800/10 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-300 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 cursor-pointer transition"
          >
            Відмінити
          </button>
          
          <button
            onClick={handleAddSelectedToStaging}
            disabled={activeChangesCount === 0}
            className={`px-3.5 py-1.5 text-[11px] font-bold rounded flex items-center gap-1.5 shadow-sm transition ${
              activeChangesCount === 0 
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed border border-transparent' 
                : 'bg-indigo-600 hover:bg-indigo-750 text-white cursor-pointer shadow-indigo-550/15 hover:shadow'
            }`}
          >
            <Plus size={12} />
            <span>Додати вибрані в staging ({activeChangesCount})</span>
          </button>
        </div>
      </div>
    </div>
  );
}
