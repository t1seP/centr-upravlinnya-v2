import React, { useState } from 'react';
import { 
  UserSquare2, 
  HelpCircle, 
  Plus, 
  Minus, 
  AlertCircle, 
  CheckCircle, 
  Play, 
  Pause, 
  Bot, 
  History, 
  FileText, 
  Settings, 
  Coins,
  ArrowLeft,
  MoreHorizontal,
  ExternalLink,
  RefreshCw,
  Send,
  Check,
  X,
  ShieldAlert,
  BookOpen,
  Trash2,
  Sliders,
  Sparkles,
  Users,
  Percent,
  Search,
  CheckSquare,
  Workflow,
  Globe,
  CornerDownRight,
  Database,
  ThumbsUp,
  FileSpreadsheet,
  AlertTriangle,
  FolderLock,
  Clock
} from 'lucide-react';
import { Client, Campaign, Decision, AIAgent, AuditLog, SearchTermItem, StagedChange } from '../types';
import AdAssets from './AdAssets';
import { INITIAL_AD_ASSETS, INITIAL_AD_GROUPS } from '../mockData';
import AnalysisPanel from '../components/AnalysisPanel';

interface ClientDetailProps {
  clients: Client[];
  campaigns: Campaign[];
  decisions: Decision[];
  agents: AIAgent[];
  logs: AuditLog[];
  selectedClientId: string;
  onSelectClientId: (id: string) => void;
  onAddDecisionLog: (msg: string, level: 'info' | 'success' | 'warning' | 'critical') => void;
  currentTheme: 'light' | 'dark';
  setCurrentTab: (tab: string) => void;
  onStageChange: (change: any) => void;
  stagedChanges: StagedChange[];
  onAddMultipleStagedChanges?: (changes: any[]) => void;
}

export default function ClientDetail({
  clients,
  campaigns,
  decisions,
  agents,
  logs,
  selectedClientId,
  onSelectClientId,
  onAddDecisionLog,
  currentTheme,
  setCurrentTab,
  onStageChange,
  stagedChanges,
  onAddMultipleStagedChanges
}: ClientDetailProps) {
  
  // Pick active client
  const activeClient = clients.find(c => c.id === selectedClientId) || clients[0];

  // Specific Specialist Mapping for realistic UI
  const specialistMap: Record<string, { name: string; email: string }> = {
    'c1': { name: 'Ольга Смирнова', email: 'olya@beta.ua' },
    'c2': { name: 'Дмитро Рибаченко', email: 'dima@delta.ua' },
    'c3': { name: 'Олег Кравченко', email: 'oleg@alfametal.ua' }, // exactly as in Screenshot 4!
    'c4': { name: 'Анна Шевченко', email: 'ania@gamma.ua' }
  };
  const specialist = specialistMap[activeClient.id] || { name: 'Олег Кравченко', email: 'oleg@alfametal.ua' };

  // All 15 tabs from Screenshot 4!
  const tabs = [
    "Огляд", 
    "Налаштування", 
    "Супровід", 
    "Метрики і кампанії", 
    "Пошукові терміни", 
    "Ключі і структура", 
    "Оголошення і активи", 
    "Аудиторії", 
    "Аукціон", 
    "Конверсії і бюджет", 
    "Документи", 
    "Дані", 
    "Лог змін", 
    "Рішення", 
    "Нотатки"
  ];

  // Start with 'Метрики і кампанії' or 'Огляд' as selected
  const [activeTab, setActiveTab] = useState<string>("Метрики і кампанії");

  // Local Campaign State
  const [localCampaigns, setLocalCampaigns] = useState<Campaign[]>(campaigns);

  // Sync state with parent props updates (e.g. on successful upload)
  React.useEffect(() => {
    setLocalCampaigns(campaigns);
  }, [campaigns]);

  // AI technical audit state tracking
  const [analyzedCampaignId, setAnalyzedCampaignId] = useState<string | null>(null);

  // Local AdAssets and AdGroups state inside ClientDetail from mockData
  const [adAssets, setAdAssets] = useState<any[]>(INITIAL_AD_ASSETS);
  const [adGroups, setAdGroups] = useState<any[]>(INITIAL_AD_GROUPS);

  const handleAddAssets = (newAssets: any[]) => {
    const created = newAssets.map((asset: any) => ({
      ...asset,
      id: `asset-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }));
    setAdAssets(prev => [...prev, ...created]);
    onAddDecisionLog(`Активи реклами (RSA): Додано ${newAssets.length} нових рекламних активів для акаунту ${activeClient.name}`, 'success');
  };

  const handleUpdateAsset = (id: string, update: Partial<any>) => {
    setAdAssets(prev => prev.map(a => a.id === id ? { ...a, ...update } : a));
    const asset = adAssets.find(a => a.id === id);
    if (asset) {
      onAddDecisionLog(`Активи реклами (RSA): Оновлено статус "status" для "${asset.text}" на "${update.status}"`, 'info');
    }
  };

  // Local Search Terms State (Screenshot 1 & 5)
  const [searchTerms, setSearchTerms] = useState<SearchTermItem[]>([
    {
      id: 'st-c1-1',
      clientId: 'c1',
      clientName: 'Бета Косметика',
      term: 'безкоштовно скачати рецепт косметики',
      impressions: 450,
      clicks: 42,
      cost: 380,
      ctr: 9.33,
      conversions: 0,
      cpa: 0,
      relevanceScore: 12,
      status: 'review'
    },
    {
      id: 'st-c1-2',
      clientId: 'c1',
      term: 'крем для обличчя ютуб вебінар',
      clientName: 'Бета Косметика',
      impressions: 120,
      clicks: 18,
      cost: 154,
      ctr: 15.0,
      conversions: 0,
      cpa: 0,
      relevanceScore: 8,
      status: 'review'
    },
    {
      id: 'st-c1-3',
      clientId: 'c1',
      clientName: 'Бета Косметика',
      term: 'купити корейські креми київ',
      impressions: 1500,
      clicks: 230,
      cost: 1955,
      ctr: 15.3,
      conversions: 35,
      cpa: 55.8,
      relevanceScore: 98,
      status: 'review'
    },
    {
      id: 'st-c2-1',
      clientId: 'c2',
      clientName: 'Дельта Авто',
      term: 'безкоштовна діагностика авто своїми руками',
      impressions: 890,
      clicks: 95,
      cost: 2100,
      ctr: 10.6,
      conversions: 0,
      cpa: 0,
      relevanceScore: 15,
      status: 'review'
    },
    {
      id: 'st-c3-1',
      clientId: 'c3',
      clientName: 'Альфа Метал',
      term: 'металопрокат замовити прайс гост 42',
      impressions: 340,
      clicks: 52,
      cost: 950,
      ctr: 15.2,
      conversions: 12,
      cpa: 79.1,
      relevanceScore: 92,
      status: 'review'
    },
    {
      id: 'st-c3-2',
      clientId: 'c3',
      clientName: 'Альфа Метал',
      term: 'дешева арматура купити бу будівельна',
      impressions: 1230,
      clicks: 145,
      cost: 4100,
      ctr: 11.79,
      conversions: 1,
      cpa: 4100.0,
      relevanceScore: 24,
      status: 'review'
    },
    {
      id: 'st-c3-3',
      clientId: 'c3',
      clientName: 'Альфа Метал',
      term: 'порізка металу лазером київ ціна b2b',
      impressions: 8500,
      clicks: 980,
      cost: 12450,
      ctr: 11.53,
      conversions: 78,
      cpa: 159.6,
      relevanceScore: 99,
      status: 'review'
    },
    {
      id: 'st-c4-1',
      clientId: 'c4',
      clientName: 'Гамма Хелс',
      term: 'курси програмування безкоштовно злив торрент',
      impressions: 720,
      clicks: 85,
      cost: 450,
      ctr: 11.8,
      conversions: 0,
      cpa: 0,
      relevanceScore: 5,
      status: 'review'
    }
  ]);

  // Specific keywords mappings matching Screenshot 3
  const clientKeywordsMap: Record<string, Array<{
    term: string;
    sub: string;
    type: string;
    qs: number;
    impressions: number;
    clicks: number;
    ctr: number;
    cpc: number;
    cost: number;
    conversions: number;
    cpa: number;
    status: string;
  }>> = {
    'c3': [ // Альфа Метал
      { term: 'альфа метал', sub: 'Альфа Метал • Brand Search — UA', type: 'Точна', qs: 9, impressions: 18200, clicks: 1640, ctr: 9.01, cpc: 8, cost: 13448, conversions: 164, cpa: 82, status: 'Активне' },
      { term: 'металопрокат купити', sub: 'Альфа Метал • Brand Search — UA', type: 'Фразова', qs: 7, impressions: 42100, clicks: 2870, ctr: 6.82, cpc: 6, cost: 17507, conversions: 287, cpa: 61, status: 'Активне' },
      { term: 'листовий метал ціна', sub: 'Альфа Метал • Brand Search — UA', type: 'Точна', qs: 8, impressions: 31100, clicks: 2210, ctr: 7.04, cpc: 8, cost: 16575, conversions: 110, cpa: 151, status: 'Активне' },
      { term: 'метал оптом', sub: 'Альфа Метал • Brand Search — UA', type: 'Широка', qs: 5, impressions: 28600, clicks: 1220, ctr: 4.27, cpc: 5, cost: 5856, conversions: 48, cpa: 122, status: 'Активне' },
      { term: 'металобаза київ', sub: 'Альфа Метал • Brand Search — UA', type: 'Фразова', qs: 6, impressions: 22000, clicks: 480, ctr: 2.18, cpc: 9, cost: 4416, conversions: 32, cpa: 138, status: 'Активне' }
    ],
    'c1': [ // Бета Косметика
      { term: 'крем для обличчя купити', sub: 'Бета Косметика • Search — Догляд за обличчям', type: 'Точна', qs: 9, impressions: 19800, clicks: 1420, ctr: 7.17, cpc: 5, cost: 7384, conversions: 142, cpa: 52, status: 'Активне' },
      { term: 'догляд за шкірою обличчя', sub: 'Бета Косметика • Search — Догляд за обличчям', type: 'Фразова', qs: 8, impressions: 24300, clicks: 1380, ctr: 5.68, cpc: 6, cost: 8004, conversions: 92, cpa: 87, status: 'Активне' },
      { term: 'сироватка гіалуронова', sub: 'Бета Косметика • Search — Догляд за обличчям', type: 'Фразова', qs: 7, impressions: 14200, clicks: 820, ctr: 5.77, cpc: 6, cost: 5248, conversions: 68, cpa: 77, status: 'Активне' },
      { term: 'антивікова косметика', sub: 'Бета Косметика • Search — Догляд за обличчям', type: 'Широка', qs: 5, impressions: 18400, clicks: 530, ctr: 2.88, cpc: 4, cost: 2067, conversions: 23, cpa: 90, status: 'Активне' }
    ],
    'c2': [ // Дельта Авто
      { term: 'комп\'ютерна діагностика авто', sub: 'Дельта Авто • Search — Діагностика СТО', type: 'Точна', qs: 8, impressions: 5400, clicks: 680, ctr: 12.59, cpc: 22, cost: 14960, conversions: 55, cpa: 272, status: 'Активне' },
      { term: 'ремонт двигуна київ ціна', sub: 'Дельта Авто • Search — Капітальний Двигун', type: 'Фразова', qs: 9, impressions: 12000, clicks: 1420, ctr: 11.83, cpc: 35, cost: 49700, conversions: 80, cpa: 621, status: 'Активне' },
      { term: 'діагностика ходової частини', sub: 'Дельта Авто • Search — Ходова СТО', type: 'Широка', qs: 4, impressions: 9800, clicks: 420, ctr: 4.28, cpc: 18, cost: 7560, conversions: 12, cpa: 630, status: 'Активне' }
    ],
    'c4': [ // Гамма Хелс
      { term: 'курси програмування київ', sub: 'Гамма Освіта • Search — Курси програмування', type: 'Точна', qs: 9, impressions: 12400, clicks: 840, ctr: 6.77, cpc: 19, cost: 15540, conversions: 57, cpa: 273, status: 'Активне' },
      { term: 'python онлайн навчання', sub: 'Гамма Освіта • Search — Курси програмування', type: 'Фразова', qs: 8, impressions: 18200, clicks: 1240, ctr: 6.81, cpc: 15, cost: 18848, conversions: 84, cpa: 224, status: 'Активне' },
      { term: 'навчитися програмувати', sub: 'Гамма Освіта • Search — Курси програмування', type: 'Широка', qs: 5, impressions: 10800, clicks: 520, ctr: 4.81, cpc: 12, cost: 6292, conversions: 28, cpa: 225, status: 'Активне' }
    ]
  };

  const clientKeywords = clientKeywordsMap[activeClient.id] || clientKeywordsMap['c3'];

  // Client Tasks Simulation State
  const [tasks, setTasks] = useState<Record<string, Array<{ id: string; text: string; done: boolean }>>>({
    'c1': [
      { id: 't-c1-1', text: 'Погодити перерозподіл лімітів із бюджету КМС на PMax', done: false },
      { id: 't-c1-2', text: 'Перевірити коректність відслідковування події "purchase" через GTM', done: true },
      { id: 't-c1-3', text: 'Затвердити текстові креативи для літньої акції', done: false }
    ],
    'c2': [
      { id: 't-c2-1', text: 'Погодити екстрене поповнення балансу з власником', done: false },
      { id: 't-c2-2', text: 'Знизити ставки tCPA на 20% для економії бюджету', done: true }
    ],
    'c3': [
      { id: 't-c3-1', text: 'Підтвердити аналіз нових категорій металопрокату', done: false },
      { id: 't-c3-2', text: 'Усунути зупинку лід-форми при переході з мобільних', done: true },
      { id: 't-c3-3', text: 'Запустити тест нових RSA оголошень з B2B будівельними офферами', done: false }
    ],
    'c4': [
      { id: 't-c4-1', text: 'Замінити акційні банери у КМС на літню тему', done: true },
      { id: 't-c4-2', text: 'Скласти звіт перед маркетологом про вартість телефонних дзвінків', done: false }
    ]
  });

  const [newTaskText, setNewTaskText] = useState('');

  // Active Client Settings Form Target States
  const [targetCpa, setTargetCpa] = useState<number>(activeClient.id === 'c2' ? 620 : activeClient.id === 'c3' ? 410 : 145);
  const [targetCtr, setTargetCtr] = useState<number>(activeClient.id === 'c2' ? 1.8 : activeClient.id === 'c3' ? 4.1 : 3.4);
  const [budgetLimInput, setBudgetLimInput] = useState<number>(activeClient.budgetLimit);
  const [industryText, setIndustryText] = useState<string>(activeClient.industry);
  const [autoPilot, setAutoPilot] = useState<boolean>(activeClient.healthScore > 85);
  const [pacing, setPacing] = useState<string>("Standard");
  const [optimizationPriority, setOptimizationPriority] = useState<string>("conversions");
  const [agentNotesText, setAgentNotesText] = useState<string>("");
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Sync settings when client changes
  React.useEffect(() => {
    setTargetCpa(activeClient.id === 'c2' ? 620 : activeClient.id === 'c3' ? 410 : 145);
    setTargetCtr(activeClient.id === 'c2' ? 1.8 : activeClient.id === 'c3' ? 4.1 : 3.4);
    setBudgetLimInput(activeClient.budgetLimit);
    setIndustryText(activeClient.industry);
    setAutoPilot(activeClient.healthScore > 85);
    setPacing(activeClient.id === 'c2' ? 'Accelerated' : activeClient.id === 'c3' ? 'Conservative' : 'Standard');
    setOptimizationPriority(activeClient.id === 'c2' ? 'cpa' : activeClient.id === 'c3' ? 'impressions' : 'conversions');
    setAgentNotesText(
      activeClient.id === 'c1' 
        ? 'Пріоритет на дорогі брендові кліки, ігноруючи низький CTR.' 
        : activeClient.id === 'c2' 
        ? 'Слідкувати за бюджетом в реальному часі, вчасно гасити кампанію по вихідних.' 
        : activeClient.id === 'c3'
        ? 'Особливу увагу на B2B ключі. Економний розхід бюджету.'
        : 'Утримувати tCPA в межах встановлених норм та не виходити за рамки ліміту.'
    );
  }, [activeClient.id]);

  // Client Custom notes scratchpad
  const [clientNotes, setClientNotes] = useState<Record<string, string>>({
    'c1': 'Звертати увагу на дорогі кліки в категорії "Елітна парфумерія". Не відключати кампанію бренд-пошуку навіть при низькому CTR.',
    'c2': 'УВАГА: баланс тане дуже швидко! Тримати бюджет під контролем. На вихідних відключати ремонт двигунів B2B.',
    'c3': 'Не відключати ключові слова з брендовими запитами Альфа Метал навіть при низькому CTR. Пріоритет - B2B металобази.',
    'c4': 'Тримати tCPA в межах 200 UAH. Конверсії з веб-форм оптимізовано за допомогою аналітика.'
  });

  const [noteSuccess, setNoteSuccess] = useState<boolean>(false);

  // Filter lists by Active Client
  const activeCampaigns = localCampaigns.filter(c => c.clientId === activeClient.id);
  const clientDecisions = decisions.filter(d => d.clientId === activeClient.id);
  const clientLogs = logs.filter(l => l.message.includes(activeClient.name) || l.message.toLowerCase().includes(activeClient.name.toLowerCase()));

  // Toggle Campaign status handler
  const handleToggleCampaignStatus = (id: string, currentStatus: 'active' | 'paused' | 'removed') => {
    const campaign = localCampaigns.find(c => c.id === id);
    if (!campaign) return;

    const action = currentStatus === 'active' ? 'Призупинити' : 'Запустити';
    const nextStatus = currentStatus === 'active' ? 'paused' : 'active';
    
    onStageChange({
      clientId: activeClient.id,
      clientName: activeClient.name,
      type: 'pause_campaign',
      description: `Запит: ${action} кампанію "${campaign.name}"`,
      payload: { campaignId: id, campaignName: campaign.name, status: nextStatus },
      source: 'manual'
    });
  };

  // Skip / Approve search terms queue
  const handleSkipSearchTerm = (id: string, term: string) => {
    setSearchTerms(prev => prev.filter(t => t.id !== id));
    onAddDecisionLog(`Семантика: Фразу "${term}" повністю акцептовано (пропущено без додавання до мінусів)`, 'info');
  };

  const handleApproveNegativeWord = (id: string, term: string) => {
    setSearchTerms(prev => prev.filter(t => t.id !== id));
    onAddDecisionLog(`Семантика: Фразу "${term}" додано як МІНУС-СЛОВО для ${activeClient.name}. Налаштування синхронізовані.`, 'success');
  };

  // Save Settings handler
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
    onAddDecisionLog(
      `Каб. ${activeClient.name}: Збережено нові налаштування: Target CPA - ${targetCpa} UAH, Ліміт бюджету - ${budgetLimInput} UAH, tCTR - ${targetCtr}%, Пріоритет - ${optimizationPriority}, Інструкції для агента: "${agentNotesText}"`, 
      'success'
    );
  };

  // Add tasks
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    const newTask = {
      id: `task-${Date.now()}`,
      text: newTaskText,
      done: false
    };
    setTasks(prev => ({
      ...prev,
      [activeClient.id]: [...(prev[activeClient.id] || []), newTask]
    }));
    setNewTaskText('');
    onAddDecisionLog(`Каб. ${activeClient.name}: Додано завдання: "${newTask.text}"`, 'info');
  };

  const handleToggleTask = (taskId: string) => {
    setTasks(prev => ({
      ...prev,
      [activeClient.id]: (prev[activeClient.id] || []).map(t => {
        if (t.id === taskId) {
          const nextDone = !t.done;
          onAddDecisionLog(`Каб. ${activeClient.name}: Задача "${t.text}" переведена в стан [${nextDone ? 'ВИКОНАНО' : 'В РОБОТІ'}]`, 'success');
          return { ...t, done: nextDone };
        }
        return t;
      })
    }));
  };

  return (
    <div className="space-y-5 animate-fade-in text-xs font-sans">
      
      {/* Dynamic Breadcrumbs Nav & Timestamps as in Screenshot 4 */}
      <div className="flex justify-between items-center text-[10px] text-slate-400 uppercase font-mono tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">
        <div className="flex items-center gap-1.5 font-bold">
          <span className="text-slate-300 dark:text-slate-700">Центр Управління</span>
          <span className="text-slate-300 dark:text-slate-600">/</span>
          <span className="text-slate-900 dark:text-slate-100">Картка клієнта</span>
        </div>
        <div className="flex items-center gap-2">
          <span>31.05, 20:45</span>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
          <span className="text-emerald-500 font-bold uppercase text-[9px] tracking-widest">● Live</span>
        </div>
      </div>

      {/* Back button & Main Title Section (Screenshot 4 layout) */}
      <div className="flex flex-col gap-1">
        <button 
          onClick={() => setCurrentTab('clients')}
          className="self-start text-[11px] font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 inline-flex items-center gap-1.5 cursor-pointer pb-2"
        >
          <ArrowLeft size={12} className="stroke-[2.5px]" /> Клієнти
        </button>

        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-xl font-bold font-display text-slate-900 dark:text-white">
            {activeClient.name}
          </h1>
          <span className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono tracking-widest uppercase border ${
            activeClient.status === 'active'
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
              : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
          }`}>
            {activeClient.status === 'active' ? 'Активний' : 'Увага'}
          </span>
          <span className="text-slate-400 dark:text-slate-500 text-xs font-mono font-medium">
            {specialist.name} • {specialist.email}
          </span>
        </div>
      </div>

      {/* Scrolling horizontal tabs list matching Screen 4 exactly */}
      <div className="relative border-b border-slate-200 dark:border-slate-800">
        <div className="flex overflow-x-auto whitespace-nowrap scrollbar-thin pb-0.5 gap-x-6 pr-4">
          {tabs.map((tab) => {
            const isSelected = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-0.5 text-xs font-medium border-b-[2.5px] transition-all relative cursor-pointer ${
                  isSelected
                    ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 font-bold'
                    : 'border-transparent text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-350'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tabs View Content */}
      <div className="mt-4">
        
        {/* TАВ 1: ОГЛЯД (OVERVIEW GRAPHICS) */}
        {activeTab === "Огляд" && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {[
                { title: "Покази", val: (activeCampaigns.reduce((a, b) => a + b.impressions, 0)).toLocaleString(), desc: "Рекламна видимість" },
                { title: "Кліки", val: (activeCampaigns.reduce((a, b) => a + b.clicks, 0)).toLocaleString(), desc: "Трафік переходів" },
                { title: "CTR % (Середній)", val: `${activeClient.ctr}%`, desc: "Залученість" },
                { title: "Сер. CPC", val: `${activeClient.cpc} UAH`, desc: "Вартість кліку" },
                { title: "Конверсії", val: activeClient.conversions, desc: "Цільові дії" },
                { title: "Вартість/Конв (CPA)", val: `${activeClient.cpa} UAH`, desc: "Ціна результату" },
                { title: "Витрачено бюджету", val: `${activeClient.budgetSpent.toLocaleString()} ${activeClient.currency}`, desc: `З ліміту ${activeClient.budgetLimit.toLocaleString()}` }
              ].map((k, idx) => (
                <div 
                  key={idx} 
                  className={`p-3.5 rounded-lg border transition duration-150 ${
                    currentTheme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
                  }`}
                >
                  <span className="text-slate-400 text-[10px] uppercase font-mono block tracking-wider">{k.title}</span>
                  <span className="text-base font-extrabold font-mono text-slate-850 dark:text-white mt-1.5 block leading-none">{k.val}</span>
                  <p className="text-[10px] text-slate-450 dark:text-slate-550 font-medium mt-1 leading-none">{k.desc}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              
              <div className={`p-5 rounded-lg border lg:col-span-2 space-y-3.5 ${
                currentTheme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
              }`}>
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 font-display">
                  Динаміка та виділення річного PPC Бюджету
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <span className="font-semibold text-slate-500">Використання коштів за поточний місяць</span>
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                        {((activeClient.budgetSpent / activeClient.budgetLimit) * 100).toFixed(1)}% | {activeClient.budgetSpent.toLocaleString()} / {activeClient.budgetLimit.toLocaleString()} {activeClient.currency}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-indigo-600 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${(activeClient.budgetSpent / activeClient.budgetLimit) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-indigo-50 dark:bg-indigo-950/20 rounded border border-indigo-100 dark:border-indigo-900/30 text-indigo-700 dark:text-indigo-350 leading-relaxed text-[11px]">
                    <p className="font-bold mb-0.5">💡 Автоматичний розрахунок темпу (Pacing):</p>
                    <p>Активний темп витрачання бюджету стабільний. Поточний добовий спад залишку коштів становить {(activeClient.budgetSpent / 14).toFixed(0)} UAH/день. За прогнозами системи, виділеного залишку вистачить на весь передбачений флайт.</p>
                  </div>
                </div>
              </div>

              <div className={`p-5 rounded-lg border space-y-4 ${
                currentTheme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
              }`}>
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 font-display">
                  Параметри кабінету
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-1.5">
                    <span className="text-slate-400">Ніша:</span>
                    <span className="font-semibold">{activeClient.industry}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-1.5">
                    <span className="text-slate-400">Номер акаунту:</span>
                    <span className="font-mono font-bold select-all text-indigo-500">{activeClient.accountId}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-1.5">
                    <span className="text-slate-400">Валюта клієнта:</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-white">{activeClient.currency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Статус підключення API:</span>
                    <span className="text-emerald-500 font-bold uppercase text-[9px] tracking-wider">● Connected Live</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ТАВ 2: НАЛАШТУВАННЯ (SETTINGS FORM EDITOR) */}
        {activeTab === "Налаштування" && (
          <div className={`p-6 rounded-lg border max-w-3xl ${
            currentTheme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
          }`}>
            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-400 font-display border-b border-slate-100 dark:border-slate-800 pb-2 mb-4">
              Редагування цілей та обмежень акаунту
            </h3>

            <div className="p-3 mb-5 bg-indigo-505/[0.04] border border-indigo-500/10 rounded">
              <p className="text-xs text-indigo-400 leading-relaxed font-sans">
                Налаштуйте стратегії та персональні правила для AI-агента, який автоматично оптимізує цей обліковий запис у Google Ads.
              </p>
            </div>

            {saveSuccess && (
              <div className="p-3 mb-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded font-semibold font-mono flex items-center gap-2">
                <CheckCircle size={14} /> Налаштування успішно збережено в Google Ads API!
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div>
                  <label className="block text-[10px] uppercase font-mono text-slate-400 mb-1">Цільовий CPA за лід (UAH)</label>
                  <input 
                    type="number"
                    value={targetCpa}
                    onChange={(e) => setTargetCpa(Number(e.target.value))}
                    className="w-full p-2 bg-slate-100/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-mono text-slate-400 mb-1">Очікуваний мінімальний CTR (%)</label>
                  <input 
                    type="number"
                    step="0.01"
                    value={targetCtr}
                    onChange={(e) => setTargetCtr(Number(e.target.value))}
                    className="w-full p-2 bg-slate-100/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-mono text-slate-400 mb-1">Щомісячний ліміт бюджету ({activeClient.currency})</label>
                  <input 
                    type="number"
                    value={budgetLimInput}
                    onChange={(e) => setBudgetLimInput(Number(e.target.value))}
                    className="w-full p-2 bg-slate-100/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-mono text-slate-400 mb-1">Ніша бізнесу (Документальна)</label>
                  <input 
                    type="text"
                    value={industryText}
                    onChange={(e) => setIndustryText(e.target.value)}
                    className="w-full p-2 bg-slate-100/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-mono text-slate-400 mb-1">Тип розсіювання бюджету (Pacing)</label>
                  <select 
                    value={pacing}
                    onChange={(e) => setPacing(e.target.value)}
                    className="w-full p-2 bg-slate-100/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded outline-none focus:border-indigo-500"
                  >
                    <option value="Standard">Рівномірний (Standard Pacing)</option>
                    <option value="Accelerated">Прискорений (Accelerated ROI)</option>
                    <option value="Conservative">Консервативний (Save budget weekend)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-100/10 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded mt-4">
                  <div>
                    <p className="font-bold text-[11px] text-slate-900 dark:text-slate-100">AI Автопілот Агента</p>
                    <p className="text-[9px] text-slate-400">Дозволити агенту погоджувати алерти за 2 години мовчання</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={autoPilot}
                    onChange={(e) => setAutoPilot(e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-0 w-4 h-4 cursor-pointer"
                  />
                </div>

              </div>

              {/* Optimization Priority Radio Group */}
              <div className="p-4 rounded border dark:border-slate-800 bg-slate-100/10 dark:bg-slate-950 space-y-3">
                <label className="block text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold">
                  Пріоритет Оптимізації (Optimization Priority)
                </label>
                <div className="space-y-2.5">
                  <label className="flex items-start gap-2.5 cursor-pointer group">
                    <input 
                      type="radio"
                      name="optimizationPriority"
                      value="conversions"
                      checked={optimizationPriority === 'conversions'}
                      onChange={() => setOptimizationPriority('conversions')}
                      className="mt-0.5 text-indigo-650 focus:ring-0 cursor-pointer"
                    />
                    <div>
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 group-hover:text-indigo-400 transition-colors">
                        Максимальна кількість конверсій (Max ROI)
                      </p>
                      <p className="text-[10px] text-slate-450 leading-normal">
                        Агент буде сфокусований на отриманні найбільшої кількості лідів у рамках щомісячного ліміту бюджету.
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 cursor-pointer group">
                    <input 
                      type="radio"
                      name="optimizationPriority"
                      value="cpa"
                      checked={optimizationPriority === 'cpa'}
                      onChange={() => setOptimizationPriority('cpa')}
                      className="mt-0.5 text-indigo-650 focus:ring-0 cursor-pointer"
                    />
                    <div>
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 group-hover:text-indigo-400 transition-colors">
                        Цільова вартість за дію (Target CPA control)
                      </p>
                      <p className="text-[10px] text-slate-455 leading-normal">
                        Агент контролюватиме та відсікатиме дорогі ключові слова, щоб втримати плановий CPA нижче ліміту.
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 cursor-pointer group">
                    <input 
                      type="radio"
                      name="optimizationPriority"
                      value="impressions"
                      checked={optimizationPriority === 'impressions'}
                      onChange={() => setOptimizationPriority('impressions')}
                      className="mt-0.5 text-indigo-650 focus:ring-0 cursor-pointer"
                    />
                    <div>
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 group-hover:text-indigo-400 transition-colors">
                        Оптимальна відсоткова частка показів (Visibility share)
                      </p>
                      <p className="text-[10px] text-slate-455 leading-normal">
                        Агент фокусуватиметься на виграші аукціонів та перших позиціях у пошуку для найкращого охоплення бренду.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Agent Notes Textarea */}
              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold">
                  Нотатки для AI-агента (Agent Notes)
                </label>
                <p className="text-[10px] text-slate-400 mb-2 leading-relaxed">
                  Будь-які спеціальні застереження, обмеження брендбуку чи вказівки щодо тональності комунікації, які агент врахує при генерації рішень.
                </p>
                <textarea
                  value={agentNotesText}
                  onChange={(e) => setAgentNotesText(e.target.value)}
                  placeholder="Вкажіть кастомні інструкції (наприклад, утримувати CPA суворо у межах 150 грн)..."
                  rows={4}
                  className="w-full p-2.5 bg-slate-100/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded outline-none focus:border-indigo-505 text-xs leading-relaxed font-sans placeholder-slate-500"
                />
              </div>

              <div className="pt-2">
                <button 
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded cursor-pointer transition"
                >
                  Зберегти зміни в кабінеті
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ТАВ 3: СУПРОВІД (TASKS + LOGS COMPACT WORKSPACE) */}
        {activeTab === "Супровід" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-fade-in">
            
            {/* Playbooks & Checklist Tasks */}
            <div className={`p-5 rounded-lg border space-y-3.5 ${
              currentTheme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
            }`}>
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 font-display">
                Внутрішні плани & Завдання спеціаліста
              </h3>

              <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                {(tasks[activeClient.id] || []).map((task) => (
                  <div 
                    key={task.id} 
                    onClick={() => handleToggleTask(task.id)}
                    className="flex items-center gap-2.5 p-2 rounded cursor-pointer hover:bg-slate-800/5 text-xs transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={task.done}
                      onChange={() => {}} // simulated in click handler
                      className="rounded border-slate-700 text-indigo-600 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                    />
                    <span className={`flex-1 leading-normal ${task.done ? 'line-through text-slate-405' : 'text-slate-850 dark:text-slate-200'}`}>
                      {task.text}
                    </span>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddTask} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Нове завдання по супроводу..."
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  className="flex-1 py-1.5 px-2 bg-slate-900/10 border border-slate-205 focus:border-indigo-500 rounded text-xs text-slate-950 dark:text-slate-100 outline-none"
                />
                <button
                  type="submit"
                  className="px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs rounded"
                >
                  Додати
                </button>
              </form>
            </div>

            {/* Audit Logs Specific for this Client */}
            <div className={`p-5 rounded-lg border space-y-3 ${
              currentTheme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
            }`}>
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 font-display">
                Лог подій фіксування аномалій ({activeClient.name})
              </h3>

              <div className="space-y-3 max-h-64 overflow-y-auto font-mono text-[10px] pr-1">
                {clientLogs.length > 0 ? (
                  clientLogs.map((log) => (
                    <div key={log.id} className="border-b border-slate-100 dark:border-slate-800/80 pb-2">
                      <div className="flex justify-between text-slate-450 mb-0.5">
                        <span className="font-bold">[{log.level.toUpperCase()}] {log.actor}</span>
                        <span>{log.timestamp}</span>
                      </div>
                      <p className="text-slate-800 dark:text-slate-305">{log.message}</p>
                    </div>
                  ))
                ) : (
                  <div className="py-4 text-center text-slate-500">
                    Активностей за поточну сесію немає.
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

        {/* ТАВ 4: МЕТРИКИ І КАМПАНІЇ (HIGHLY POLISHED ADS CAMPAIGN GRID) */}
        {activeTab === "Метрики і кампанії" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-1">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-display">
                  Активні рекламні кампанії у супроводі ({activeCampaigns.length})
                </h4>
                <p className="text-[10px] text-slate-400">Швидке керування статусом та тарифікація лімітів у реальному часі</p>
              </div>
              <button
                onClick={() => {
                  onAddDecisionLog(`Каб. ${activeClient.name}: Надіслано запит на створення нової кампанії`, 'info');
                  alert('Створення нової кампанії вимагає підключеного акаунту Google Ads.');
                }}
                className="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-[10px] font-mono inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Plus size={11} /> Додати кампанію
              </button>
            </div>

            <div className={`overflow-x-auto border rounded-lg ${
              currentTheme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
            }`}>
              <table className="w-full text-left text-xs font-sans border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800/80 text-slate-400 font-mono text-[9px] uppercase">
                    <th className="py-3 px-4">НАЗВА КАМПАНІЇ</th>
                    <th className="py-3 text-center">СТАТУС</th>
                    <th className="py-3 text-right">БЮДЖЕТ / ДЕНЬ</th>
                    <th className="py-3 text-right text-slate-500">ВИВТРАЧЕНО</th>
                    <th className="py-3 text-right">ПОКАЗИ</th>
                    <th className="py-3 text-right">КЛІКИ</th>
                    <th className="py-3 text-center">CTR %</th>
                    <th className="py-3 text-right">СЕР. CPC</th>
                    <th className="py-3 text-center">КОНВЕРСІЇ</th>
                    <th className="py-3 text-right">CPA (ВАРТІСТЬ)</th>
                    <th className="py-3 text-center">ЕФЕКТИВНІСТЬ ШІ</th>
                    <th className="py-3 text-right px-4">ДІЯ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                  {activeCampaigns.map((camp) => {
                    // Score badges according to Google Ads simplicity (Screenshot 2)
                    let ctrStyle = "text-amber-600 bg-amber-50 dark:bg-amber-950/20";
                    if (camp.ctr >= 5.0) {
                      ctrStyle = "text-emerald-700 bg-emerald-50 dark:bg-emerald-950/20 font-bold";
                    } else if (camp.ctr < 2.5) {
                      ctrStyle = "text-rose-700 bg-rose-50 dark:bg-rose-950/20 font-bold";
                    }

                    let cpaStyle = "text-amber-600 bg-amber-50 dark:bg-amber-950/20";
                    if (camp.cpa <= 240) {
                      cpaStyle = "text-emerald-700 bg-emerald-50 dark:bg-emerald-950/20 font-bold";
                    } else if (camp.cpa > 380) {
                      cpaStyle = "text-rose-700 bg-rose-50 dark:bg-rose-950/20 font-bold";
                    }

                    let efficiencyLabel = "Середня (Оптимально)";
                    let efficiencyClass = "bg-amber-500/10 text-amber-700 border border-amber-500/20";
                    if (camp.ctr >= 5.0 && camp.cpa <= 320) {
                      efficiencyLabel = "Висока (Ефективно)";
                      efficiencyClass = "bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 font-bold font-mono text-[9px]";
                    } else if (camp.ctr < 2.5 || camp.cpa > 380) {
                      efficiencyLabel = "Низька (Потребує уваги)";
                      efficiencyClass = "bg-rose-500/10 text-rose-700 border border-rose-500/20 font-bold font-mono text-[9px]";
                    }

                    const isAnalyzed = analyzedCampaignId === camp.id;
                    const stagedCampaignChange = stagedChanges.find(
                      sc => sc.type === 'pause_campaign' && sc.payload?.campaignId === camp.id && sc.status === 'pending'
                    );

                    return (
                      <React.Fragment key={camp.id}>
                        <tr className="hover:bg-slate-800/5 transition-colors">
                          <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100 select-all max-w-xs truncate">
                            {camp.name}
                          </td>
                          <td className="py-3 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-bold uppercase ${
                                camp.status === 'active' 
                                  ? 'bg-emerald-550/10 text-emerald-550 border border-emerald-555/20' 
                                  : 'bg-amber-550/10 text-amber-550 border border-amber-555/20'
                              }`}>
                                {camp.status}
                              </span>
                              {stagedCampaignChange && (
                                <span className="inline-flex items-center gap-0.5 px-1 py-0.5 rounded text-[7.5px] font-mono font-bold uppercase bg-amber-500/10 text-amber-500 border border-amber-500/20" title="В черзі на вивантаження">
                                  <Clock size={8} /> Staged
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 text-right font-mono text-slate-800 dark:text-neutral-200">{camp.budget} {activeClient.currency}</td>
                          <td className="py-3 text-right font-mono text-slate-450">{camp.spent} {activeClient.currency}</td>
                          <td className="py-3 text-right font-mono text-slate-500">{camp.impressions.toLocaleString()}</td>
                          <td className="py-3 text-right font-mono text-slate-500">{camp.clicks.toLocaleString()}</td>
                          <td className="py-3 text-center">
                            <span className={`px-1.5 py-0.5 rounded font-mono text-[10px] ${ctrStyle}`}>
                              {camp.ctr}%
                            </span>
                          </td>
                          <td className="py-3 text-right font-mono text-slate-550">{camp.cpc} UAH</td>
                          <td className="py-3 text-center font-mono font-bold text-slate-800 dark:text-white">
                            {camp.conversions}
                          </td>
                          <td className="py-3 text-right">
                            <span className={`px-1.5 py-0.5 rounded font-mono text-[10px] ${cpaStyle}`}>
                              {camp.cpa} UAH
                            </span>
                          </td>
                          <td className="py-3 text-center">
                            <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] ${efficiencyClass}`}>
                              {efficiencyLabel}
                            </span>
                          </td>
                          <td className="py-3 text-right px-4">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setAnalyzedCampaignId(isAnalyzed ? null : camp.id)}
                                className={`p-1 rounded cursor-pointer transition ${
                                  isAnalyzed
                                    ? 'bg-indigo-650 text-white shadow-sm'
                                    : 'text-indigo-500 hover:bg-indigo-500/10'
                                }`}
                                title="Запустити ШІ-аналіз кампанії"
                              >
                                <Sparkles size={12} className="stroke-[2.5px]" />
                              </button>
                              
                              <button
                                onClick={() => handleToggleCampaignStatus(camp.id, camp.status)}
                                className={`p-1 rounded cursor-pointer transition ${
                                  camp.status === 'active' 
                                    ? 'text-amber-500 hover:bg-amber-500/10' 
                                    : 'text-emerald-500 hover:bg-emerald-500/10'
                                }`}
                                title={camp.status === 'active' ? 'Зупинити на паузу' : 'Запустити кампанію'}
                              >
                                {camp.status === 'active' ? <Pause size={12} className="stroke-[2.5px]" /> : <Play size={12} className="stroke-[2.5px]" />}
                              </button>
                            </div>
                          </td>
                        </tr>
                        {isAnalyzed && (
                          <tr className="bg-slate-500/[0.015]">
                            <td colSpan={12} className="p-4 px-5">
                              <AnalysisPanel
                                campaign={camp}
                                client={activeClient}
                                currentTheme={currentTheme}
                                onAddStagedChanges={(items) => {
                                  if (onAddMultipleStagedChanges) {
                                    onAddMultipleStagedChanges(items);
                                  } else {
                                    items.forEach(i => onStageChange(i));
                                  }
                                }}
                                onClose={() => setAnalyzedCampaignId(null)}
                                onAddDecisionLog={onAddDecisionLog}
                              />
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ТАВ 5: ПОШУКОВІ ТЕРМІНІ (VERIFY SEARCH TERMS DIRECTLY IN CARD - Screenshot 1 Style) */}
        {activeTab === "Пошукові терміни" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-1">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-display">
                  Черга верифікації пошукових запитів ({searchTerms.filter(t => t.clientId === activeClient.id).length})
                </h4>
                <p className="text-[10px] text-slate-400">Аналіз нецільового сміттєвого трафіку із Google Ads API за останні 7 днів</p>
              </div>
              <span className="px-2.5 py-1 rounded bg-indigo-500/10 text-indigo-500 font-mono text-[10px] font-bold border border-indigo-500/20">
                Search Terms Agent active
              </span>
            </div>

            {searchTerms.filter(t => t.clientId === activeClient.id).length > 0 ? (
              <div className={`p-5 rounded-lg border space-y-4 ${
                currentTheme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
              }`}>
                {/* Custom list layout corresponding precisely with Screenshot 1! */}
                <div className="flex text-slate-400 font-mono text-[9px] uppercase pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="w-2/5">ЗАПИТ (SEARCH TERM)</div>
                  <div className="w-[15%] text-center">ШІ ОЦІНКА (RELEVANCE)</div>
                  <div className="w-[12%] text-right pr-2">ПОКАЗИ</div>
                  <div className="w-[10%] text-right pr-2">КЛІКИ</div>
                  <div className="w-[10%] text-center">CTR %</div>
                  <div className="w-[12%] text-right pr-2">ВАРТІСТЬ (COST)</div>
                  <div className="w-[8%] text-center">CONV.</div>
                  <div className="w-[15%] text-right">ДІЇ</div>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {searchTerms.filter(t => t.clientId === activeClient.id).map((term) => {
                    const lowRelevance = term.relevanceScore < 30;
                    
                    return (
                      <div key={term.id} className="py-4 flex items-center text-xs">
                        {/* Word string */}
                        <div className="w-2/5 font-mono font-bold text-slate-900 dark:text-slate-150 select-all pr-4 truncate">
                          {term.term}
                        </div>

                        {/* Relevance badge */}
                        <div className="w-[15%] text-center">
                          <span className={`inline-block px-1.5 py-0.5 rounded font-mono font-bold text-[10px] border ${
                            lowRelevance 
                              ? 'bg-rose-500/5 border-rose-500/20 text-rose-500' 
                              : 'bg-emerald-500/5 border-emerald-500/20 text-emerald-500'
                          }`}>
                            {term.relevanceScore}%
                          </span>
                        </div>

                        {/* Impressions */}
                        <div className="w-[12%] text-right pr-2 font-mono text-slate-500">
                          {term.impressions}
                        </div>

                        {/* Clicks */}
                        <div className="w-[10%] text-right pr-2 font-mono text-slate-500">
                          {term.clicks}
                        </div>

                        {/* CTR */}
                        <div className="w-[10%] text-center">
                          <span className="px-1.5 py-0.5 rounded font-mono text-[10px] text-amber-700 bg-amber-50 dark:bg-amber-950/20">
                            {term.ctr}%
                          </span>
                        </div>

                        {/* Cost */}
                        <div className="w-[12%] text-right pr-2 font-mono text-slate-900 dark:text-neutral-200">
                          {term.cost} UAH
                        </div>

                        {/* Conversions */}
                        <div className="w-[8%] text-center font-mono font-bold text-indigo-500">
                          {term.conversions}
                        </div>

                        {/* Action buttons matching Screen 1 exactly */}
                        <div className="w-[15%] text-right flex justify-end gap-1.5">
                          <button
                            onClick={() => handleSkipSearchTerm(term.id, term.term)}
                            className="px-2.5 py-1 border border-slate-205 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded font-mono text-[10px]"
                            title="Пропустити"
                          >
                            Скіп
                          </button>
                          <button
                            onClick={() => handleApproveNegativeWord(term.id, term.term)}
                            className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-mono font-bold text-[10px]"
                            title="Додати в мінус-списки"
                          >
                            - Мінус СЛОВО
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-100/10 dark:bg-slate-900/40 rounded-lg border border-dashed border-slate-700/30">
                <CheckCircle size={28} className="mx-auto text-emerald-500 mb-2 opacity-80" />
                <p className="font-bold text-slate-850 dark:text-slate-200">Кураторська черга порожня</p>
                <p className="text-[10px] text-slate-400 mt-1">Невідомих штормових фраз з Google Ads поточно не зафіксовано.</p>
              </div>
            )}
          </div>
        )}

        {/* ТАВ 6: КЛЮЧІ І СТРУКТУРА (KEYWORD MANAGEMENT - Screenshot 3 Style) */}
        {activeTab === "Ключі і структура" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-1">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-display">
                  Активні ключові слова кампаній клієнта ({clientKeywords.length})
                </h4>
                <p className="text-[10px] text-slate-400">Тип відповідності, показник якості (QS), та історична конверсійність</p>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">
                Ключів в базі: <strong className="text-slate-900 dark:text-white">{clientKeywords.length * 3}</strong> | Середній QS: <strong className="text-emerald-550">7.6</strong>
              </span>
            </div>

            {/* Polish Table corresponding EXACTLY with User's target Screenshot 3! */}
            <div className={`overflow-x-auto border rounded-lg ${
              currentTheme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
            }`}>
              <table className="w-full text-left text-xs font-sans border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-mono text-[9px] uppercase">
                    <th className="py-2.5 px-4">КЛЮЧОВЕ СЛОВО</th>
                    <th className="py-2.5">ТИП</th>
                    <th className="py-2.5 text-center">QS</th>
                    <th className="py-2.5 text-right">ПОКАЗИ</th>
                    <th className="py-2.5 text-right">КЛІКИ</th>
                    <th className="py-2.5 text-center">CTR</th>
                    <th className="py-2.5 text-right">CPC</th>
                    <th className="py-2.5 text-right">ВИТРАТИ</th>
                    <th className="py-2.5 text-center">КОНВ.</th>
                    <th className="py-2.5 text-right">CPA</th>
                    <th className="py-2.5 text-center px-4">СТАТУС</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 font-medium text-slate-800 dark:text-slate-200">
                  {clientKeywords.map((kw, idx) => {
                    const isHighQS = kw.qs >= 8;
                    const isLowQS = kw.qs <= 5;
                    
                    return (
                      <tr key={idx} className="hover:bg-slate-800/10 transition-colors">
                        <td className="py-3 px-4">
                          <p className="font-mono font-semibold text-slate-900 dark:text-slate-100 select-all">{kw.term}</p>
                          <span className="text-[8.5px] font-medium text-slate-400 font-mono mt-0.5 block">{kw.sub}</span>
                        </td>
                        <td className="py-3 text-slate-500 font-mono">{kw.type}</td>
                        <td className="py-3 text-center">
                          <span className={`inline-block px-1.5 py-0.2 rounded font-mono font-bold text-[10px] ${
                            isHighQS 
                              ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/30' 
                              : isLowQS 
                              ? 'text-rose-700 bg-rose-50 dark:bg-rose-955/30' 
                              : 'text-amber-700 bg-amber-50 dark:bg-amber-955/30'
                          }`}>
                            {kw.qs}
                          </span>
                        </td>
                        <td className="py-3 text-right font-mono text-slate-500">{kw.impressions.toLocaleString()}</td>
                        <td className="py-3 text-right font-mono text-slate-500">{kw.clicks.toLocaleString()}</td>
                        <td className="py-3 text-center font-mono">{(kw.ctr).toFixed(2)}%</td>
                        <td className="py-3 text-right font-mono text-slate-550">{kw.cpc} грн</td>
                        <td className="py-3 text-right font-mono text-slate-900 dark:text-slate-300">{kw.cost.toLocaleString()} грн</td>
                        <td className="py-3 text-center font-mono font-bold text-slate-900 dark:text-white">{kw.conversions}</td>
                        <td className="py-3 text-right font-mono text-slate-550">{kw.cpa} грн</td>
                        <td className="py-3 text-center px-4">
                          <span className="inline-block px-1.5 py-0.5 rounded text-[8px] font-mono border border-emerald-500/20 text-emerald-500 bg-emerald-550/5">
                            {kw.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ТАВ 7: ОГОЛОШЕННЯ І АКТИВИ (ADS & HEADLINES) */}
        {activeTab === "Оголошення і активи" && (
          <div className="space-y-4 animate-fade-in">
            <AdAssets
              clients={clients}
              campaigns={campaigns}
              adAssets={adAssets}
              adGroups={adGroups}
              currentTheme={currentTheme}
              onAddAssets={handleAddAssets}
              onUpdateAsset={handleUpdateAsset}
              initialClientId={activeClient.id}
              onStageChange={onStageChange}
              stagedChanges={stagedChanges}
            />
          </div>
        )}

        {/* ТАВ 8: АУДИТОРІЇ (TARGET SEGMENTS) */}
        {activeTab === "Аудиторії" && (
          <div className="space-y-4">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 font-display">
              Зв\'язані рекламні сегменти аудиторій
            </h3>
            <div className={`overflow-x-auto border rounded-lg ${
              currentTheme === 'light' ? 'bg-white border-slate-205' : 'bg-slate-905 border-slate-800'
            }`}>
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-450 font-mono text-[9px] uppercase">
                    <th className="py-2.5 px-4">НАЗВА СЕГМЕНТУ АУДИТОРІЇ</th>
                    <th className="py-2.5">ТИП AUDIENCE UNIT</th>
                    <th className="py-2.5 text-right">ОБСЯГ ЮЗЕРІВ</th>
                    <th className="py-2.5 text-center">РІВЕНЬ ВІДГУКУ (CONV. RATE)</th>
                    <th className="py-2.5 text-right px-4">МОДИФІКАТОР СТАВКИ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                  {[
                    { name: `Зацікавлені покупці: B2B і ринкова ніша ${activeClient.industry}`, type: 'In-market / Interests', size: '150k користувачів', rate: '2.84%', bid: '+15.2%' },
                    { name: `Ремаркетинг покупців (Кошики 30 днів)`, type: 'Remarketing List', size: '12k користувачів', rate: '5.92%', bid: '+25.0%' },
                    { name: `Схожі відвідувачі на конвертовані контакти`, type: 'Similar Segment', size: '480k користувачів', rate: '1.45%', bid: 'За замовчуванням (0%)' }
                  ].map((aud, index) => (
                    <tr key={index} className="hover:bg-slate-800/10">
                      <td className="py-2.5 px-4 font-bold text-slate-850 dark:text-slate-150">{aud.name}</td>
                      <td className="py-2.5 font-mono text-slate-400">{aud.type}</td>
                      <td className="py-2.5 text-right font-mono text-slate-500">{aud.size}</td>
                      <td className="py-2.5 text-center font-mono text-indigo-400 font-bold">{aud.rate}</td>
                      <td className="py-2.5 text-right font-mono font-bold px-4 text-emerald-500">{aud.bid}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ТАВ 9: АУКЦІОН (AUCTION INSIGHTS) */}
        {activeTab === "Аукціон" && (
          <div className="space-y-4">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 font-display">
              Аналітика конкурентів у видачі пошуку (Auction insights)
            </h3>
            <div className={`overflow-x-auto border rounded-lg ${
              currentTheme === 'light' ? 'bg-white border-slate-205' : 'bg-slate-905 border-slate-800'
            }`}>
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-450 font-mono text-[9px] uppercase">
                    <th className="py-2.5 px-4">ВЕБ-РЕСУРС СУПЕРНИКА (DOMAIN)</th>
                    <th className="py-2.5 text-right">ЧАСТКА ПОКАЗІВ ИМПРЕСІЙ</th>
                    <th className="py-2.5 text-right font-semibold">ОБСЯГ ПЕРЕКРИТТЯ (OVERLAP)</th>
                    <th className="py-2.5 text-right">POSITION ABOVE RATE</th>
                    <th className="py-2.5 text-right px-4">TOP-PAGE RATE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
                  {[
                    { domain: 'ua-market-rivals.com.ua', share: '32.42%', overlap: '45.10%', above: '28.5%', top: '88.5%' },
                    { domain: 'opt-b2b-distributors.com', share: '21.05%', overlap: '22.40%', above: '15.2%', top: '74.2%' },
                    { domain: 'lviv-kiev-prom-supply.net', share: '18.90%', overlap: '14.80%', above: '11.0%', top: '69.0%' }
                  ].map((item, index) => (
                    <tr key={index} className="hover:bg-slate-800/10 font-medium">
                      <td className="py-2.5 px-4 font-bold text-indigo-500 font-sans">{item.domain}</td>
                      <td className="py-2.5 text-right font-mono text-slate-800 dark:text-white">{item.share}</td>
                      <td className="py-2.5 text-right text-indigo-400 font-bold">{item.overlap}</td>
                      <td className="py-2.5 text-right text-slate-500">{item.above}</td>
                      <td className="py-2.5 text-right px-4 text-emerald-500 font-bold">{item.top}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ТАВ 10: КОНВЕРСІЇ І БЮДЖЕТ (GOALS) */}
        {activeTab === "Конверсії і бюджет" && (
          <div className="space-y-4">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 font-display">
              Оптимізація конверсійних цілей та GTM тегів
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: "Purchase GTM Event", rate: "2.94%", val: "4,500 UAH spent", status: "Active Tracker", tracking: "Google Ads Tag Google Tag Manager" },
                { name: "Submit Lead Form", rate: "1.82%", val: "2,200 UAH spent", status: "Active Tracker", tracking: "Form redirect page analytics v4" },
                { name: "Phone Click URL", rate: "0.95%", val: "380 UAH spent", status: "Active Tracker", tracking: "Phone click on interactive mobile menu" }
              ].map((goal, index) => (
                <div key={index} className={`p-4 rounded-lg border text-xs space-y-2 ${
                  currentTheme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
                }`}>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900 dark:text-neutral-100">{goal.name}</span>
                    <span className="px-1 py-0.2 rounded text-[8px] font-mono bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">{goal.status}</span>
                  </div>
                  <p className="text-[10px] text-slate-400">{goal.tracking}</p>
                  <div className="flex justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 font-mono text-[10px]">
                    <span>Коефіцієнт: <strong className="text-indigo-400">{goal.rate}</strong></span>
                    <span>Витрачено: {goal.val}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ТАВ 11: ДОКУМЕНТИ (DOCUMENTS VIEW COMPACT - Screenshot 4 Style) */}
        {activeTab === "Документи" && (
          <div className="space-y-4">
            {/* The exactly notice referencing Screenshot 4 metadata! */}
            <div className="p-12 text-center bg-slate-100/10 dark:bg-slate-905 border border-dashed border-slate-700/30 rounded-lg flex flex-col justify-center items-center">
              <FolderLock size={32} className="text-amber-500 mb-2 animate-bounce" />
              <h4 className="font-bold text-sm text-slate-850 dark:text-slate-150 uppercase tracking-widest font-display">
                Документи
              </h4>
              <p className="text-xs text-slate-500 font-semibold mt-2">
                Цей розділ з\'явиться у наступній фазі.
              </p>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                Джерело даних: <code className="bg-slate-800 px-1 py-0.5 rounded text-indigo-400">Obsidian документи, семантика/</code>
              </p>

              {/* Sub-cards */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3 max-w-lg w-full text-left">
                <div className="p-3 bg-slate-800/30 border border-slate-800 rounded">
                  <p className="font-bold text-[11px] text-slate-350 flex items-center gap-1.5">
                    <FileText size={12} className="text-slate-400" />
                    Брифінг {activeClient.name}
                  </p>
                  <span className="text-[9px] text-slate-500 font-mono">Файл: brief_standard.md</span>
                </div>
                <div className="p-3 bg-slate-800/30 border border-slate-800 rounded">
                  <p className="font-bold text-[11px] text-slate-350 flex items-center gap-1.5">
                    <FileText size={12} className="text-slate-400" />
                    SOP узгодження алерів
                  </p>
                  <span className="text-[9px] text-slate-500 font-mono">Файл: sop_alert_triggers.md</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ТАВ 12: ДАНІ (INTEGRATION WEBHOOKS & TESTING) */}
        {activeTab === "Дані" && (
          <div className={`p-5 rounded-lg border space-y-4 ${
            currentTheme === 'light' ? 'bg-white border-slate-205' : 'bg-slate-900 border-slate-800'
          }`}>
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 font-display">
              Специфікація потоків синхронізації (Data feeds)
            </h3>
            <div className="space-y-3 max-w-xl">
              <div className="p-3.5 bg-slate-950/40 rounded border border-slate-800 space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-200">Google Sheets Sync Webhook</span>
                  <span className="text-[9px] font-mono text-emerald-500 font-bold uppercase">● Active</span>
                </div>
                <p className="text-[10px] text-slate-400 select-all">https://api.aistudio.build/webhooks/google-sheets-sync?client={activeClient.id}</p>
                <div className="pt-2 flex justify-end">
                  <button 
                    onClick={() => {
                      onAddDecisionLog(`Каб. ${activeClient.name}: Ручний тест синхронізації з Google Sheets успішно відправлено!`, 'success');
                      alert('Тестовий HTTP пакет 200 OK відправлено.');
                    }}
                    className="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] rounded font-mono font-bold cursor-pointer"
                  >
                    Тестувати Вебхук
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ТАВ 13: ЛОГ ЗМІН (PERSONAL ACTION REGISTRIES) */}
        {activeTab === "Лог змін" && (
          <div className="space-y-4">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 font-display">
              Scoping Audit-Trail of Actions on {activeClient.name}
            </h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {clientLogs.length > 0 ? (
                clientLogs.map((log) => (
                  <div key={log.id} className={`p-3 rounded-lg border text-xs flex justify-between items-start ${
                    currentTheme === 'light' ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
                  }`}>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-slate-100">{log.message}</p>
                      <span className="text-[9px] text-slate-400 mt-1 block font-mono">Виконавець: {log.actor}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 whitespace-nowrap">{log.timestamp}</span>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-slate-500 bg-slate-800/10 rounded">
                  Операційні логи для цього кабінету за поточну добу відсутні.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ТАВ 14: РІШЕННЯ (PENDING AI DECREES) */}
        {activeTab === "Рішення" && (
          <div className="space-y-4">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 font-display">
              Рекомендаційні картки рішень від ШІ Агентів
            </h3>
            {clientDecisions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {clientDecisions.map((decision) => (
                  <div 
                    key={decision.id} 
                    className={`p-4 rounded-lg border text-xs space-y-2 relative ${
                      decision.status === 'approved' 
                        ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-555' 
                        : decision.status === 'rejected'
                        ? 'bg-rose-500/5 border-rose-500/20 text-rose-600'
                        : 'bg-slate-900 border-slate-800'
                    }`}
                  >
                    <div className="flex justify-between items-start border-b border-indigo-900/10 pb-1.5">
                      <span className="font-bold font-mono text-[10px] text-indigo-400">{decision.sourceName}</span>
                      <span className={`px-1.5 py-0.2 rounded text-[8px] font-mono uppercase font-bold ${
                        decision.priority === 'high' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/10' : 'bg-amber-500/10 text-amber-500 border border-amber-500/11'
                      }`}>{decision.priority} PRIORITY</span>
                    </div>
                    <h5 className="font-bold text-slate-905 dark:text-neutral-100 text-sm">{decision.title}</h5>
                    <p className="text-slate-400 leading-relaxed text-[11px]">{decision.desc}</p>
                    
                    {decision.status === 'pending' ? (
                      <div className="pt-3 border-t border-slate-800/30 flex justify-end gap-1.5">
                        <button 
                          onClick={() => {
                            onAddDecisionLog(`Каб. ${activeClient.name}: Рекомендацію "${decision.title}" відхилено.`, 'warning');
                            decision.status = 'rejected';
                            setActiveTab("Огляд"); // reset view
                          }}
                          className="px-2 py-1 text-rose-550 border border-transparent rounded text-[10px] hover:bg-rose-500/5 cursor-pointer"
                        >
                          Відхилити
                        </button>
                        <button 
                          onClick={() => {
                            onAddDecisionLog(`Каб. ${activeClient.name}: Рекомендацію "${decision.title}" успішно узгоджено! Зміна внесена в Google Ads API.`, 'success');
                            decision.status = 'approved';
                            setActiveTab("Огляд"); // refresh state
                          }}
                          className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-bold text-[10px] cursor-pointer"
                        >
                          Підтвердити
                        </button>
                      </div>
                    ) : (
                      <div className="pt-2 text-right text-[10px] font-mono text-slate-400 font-bold uppercase">
                        Стан: {decision.status}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-100/10 rounded-lg">
                <CheckCircle size={24} className="mx-auto text-emerald-500 mb-1" />
                <p className="font-bold">Аномалій немає</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Всі асистентські рекомендації для кабінету ухвалено.</p>
              </div>
            )}
          </div>
        )}

        {/* ТАВ 15: НОТАТКИ (EDITABLE AI-AGENTS ADVISOR GUIDE) */}
        {activeTab === "Нотатки" && (
          <div className={`p-5 rounded-lg border max-w-2xl space-y-4 ${
            currentTheme === 'light' ? 'bg-white border-slate-205' : 'bg-slate-900 border-slate-800'
          }`}>
            <div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 font-display">
                Пін-нотатки & Інструкції для AI Агента супроводу
              </h3>
              <p className="text-[10px] text-slate-400 mt-1">
                Напишіть специфічні правила для LLM. Наші агенти (Search Term Watcher, Budget Doctor) зчитують це перед прийняттям рекомендацій.
              </p>
            </div>

            {noteSuccess && (
              <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded font-semibold font-mono text-[10.5px]">
                ✓ Нотатки та правила синхронізовано з контекстним вікном LLM!
              </div>
            )}

            <div className="space-y-3">
              <textarea 
                className="w-full h-40 p-3 bg-slate-950/40 dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded font-sans text-xs leading-relaxed outline-none focus:border-indigo-500 text-slate-950 dark:text-slate-100"
                value={clientNotes[activeClient.id] || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setClientNotes(prev => ({ ...prev, [activeClient.id]: val }));
                }}
                placeholder="Напишіть інструкції..."
              />
              <button
                onClick={() => {
                  setNoteSuccess(true);
                  setTimeout(() => setNoteSuccess(false), 3000);
                  onAddDecisionLog(`Каб. ${activeClient.name}: Оновлено контекстні інструкції для AI Агента.`, 'info');
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded cursor-pointer leading-none transition"
              >
                Оновити контекст LLM
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
