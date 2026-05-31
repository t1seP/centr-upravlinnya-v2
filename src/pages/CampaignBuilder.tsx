import React, { useState } from 'react';
import { 
  Wand2, 
  MapPin, 
  Languages, 
  Tv, 
  Grid, 
  Type, 
  Eye, 
  Check, 
  ArrowLeft, 
  ArrowRight, 
  Plus, 
  Trash2, 
  Sparkles,
  FileCheck,
  AlertTriangle,
  Download
} from 'lucide-react';
import { Client, CampaignDraft } from '../types';

interface CampaignBuilderProps {
  clients: Client[];
  currentTheme: 'light' | 'dark';
  onSaveDraft: (draft: CampaignDraft) => void;
  onSubmitForApproval: (draft: CampaignDraft) => void;
}

export default function CampaignBuilder({
  clients,
  currentTheme,
  onSaveDraft,
  onSubmitForApproval
}: CampaignBuilderProps) {
  const [step, setStep] = useState(1);
  
  // Step 1: Basics
  const [selectedClientId, setSelectedClientId] = useState('c1');
  const [campaignName, setCampaignName] = useState('Cosmetics_UA_Search_SkinCare');
  const [campaignType, setCampaignType] = useState<'search' | 'pmax' | 'display' | 'shopping' | 'video' | 'app' | 'demand_gen'>('search');
  const [bidStrategy, setBidStrategy] = useState<'TARGET_CPA' | 'TARGET_ROAS' | 'MAXIMIZE_CONVERSIONS' | 'MANUAL_CPC'>('TARGET_CPA');
  const [targetValue, setTargetValue] = useState<number>(350); // CPA or ROAS
  const [dailyBudget, setDailyBudget] = useState<number>(1000);

  // Step 2: Targeting
  const [geoTargets, setGeoTargets] = useState<string[]>(['Київ', 'Одеса']);
  const [customGeo, setCustomGeo] = useState('');
  const [languages, setLanguages] = useState<string[]>(['Українська']);
  const [devices, setDevices] = useState<string[]>(['Мобільні', 'Десктоп']);
  const [bidAdjustment, setBidAdjustment] = useState<number>(0);

  // Step 3: Structure
  const [adGroups, setAdGroups] = useState<Array<{ name: string, keywords: string[] }>>([
    { name: 'Креми зволожуючі', keywords: ['купити крем', '[зволожуючий крем київ]', '"косметика догляд"'] }
  ]);
  const [isGeneratingStruct, setIsGeneratingStruct] = useState(false);
  const [nicheDescription, setNicheDescription] = useState('');
  const [campaignNegatives, setCampaignNegatives] = useState('безкоштовно\nсвоїми руками\nютуб\nскачати');

  // Step 4: Ads
  const [headlines, setHeadlines] = useState<Record<string, string[]>>({
    '0': ['Найкращі Креми для Обличчя', 'Купити Корейський Крем', 'Знижка -10% На Перше Замовлення', 'Оригінальна Якість З Кореї', 'Безкоштовна Консультація', '', '', '', '', '', '', '', '', '', '']
  });
  const [descriptions, setDescriptions] = useState<Record<string, string[]>>({
    '0': ['Офіційний дистриб\'ютор корейської косметики в Україні. 100% оригінал, сертифікати.', 'Широкий асортимент засобів догляду за шкірою для будь-якого віку. Замовляйте зараз!', '', '']
  });
  const [isGeneratingAdText, setIsGeneratingAdText] = useState<Record<string, boolean>>({});

  // Feedback notifications
  const [showToast, setShowToast] = useState<string | null>(null);

  const activeClient = clients.find(c => c.id === selectedClientId) || clients[0];

  // Helper to trigger toast
  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 4000);
  };

  // Geo options
  const geoOptions = ['Київ', 'Харків', 'Дніпро', 'Одеса', 'Вся Україна'];
  
  const toggleGeo = (g: string) => {
    setGeoTargets(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]);
  };

  const addCustomGeo = () => {
    if (!customGeo.trim()) return;
    if (!geoTargets.includes(customGeo.trim())) {
      setGeoTargets(prev => [...prev, customGeo.trim()]);
    }
    setCustomGeo('');
  };

  const toggleLanguage = (lang: string) => {
    setLanguages(prev => prev.includes(lang) ? prev.filter(x => x !== lang) : [...prev, lang]);
  };

  const toggleDevice = (dev: string) => {
    setDevices(prev => prev.includes(dev) ? prev.filter(x => x !== dev) : [...prev, dev]);
  };

  // Dynamic ad group administration
  const addAdGroup = () => {
    setAdGroups(prev => [...prev, { name: `Група №${prev.length + 1}`, keywords: [] }]);
    
    // Initialize headlines and descriptions for this group
    const nextIdx = adGroups.length;
    setHeadlines(prev => ({ ...prev, [nextIdx]: Array(15).fill('') }));
    setDescriptions(prev => ({ ...prev, [nextIdx]: Array(4).fill('') }));
  };

  const removeAdGroup = (index: number) => {
    if (adGroups.length <= 1) return;
    setAdGroups(prev => prev.filter((_, idx) => idx !== index));
  };

  const updateAdGroupKeywords = (index: number, text: string) => {
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    setAdGroups(prev => prev.map((g, idx) => idx === index ? { ...g, keywords: lines } : g));
  };

  const updateAdGroupName = (index: number, name: string) => {
    setAdGroups(prev => prev.map((g, idx) => idx === index ? { ...g, name } : g));
  };

  // AI Structure generations
  const handleGenerateStructure = () => {
    if (!nicheDescription.trim()) return;
    setIsGeneratingStruct(true);
    
    setTimeout(() => {
      setIsGeneratingStruct(false);
      // Sample generated ad groups depending on niche
      const cleanNicheStr = nicheDescription.toLowerCase();
      let generated: Array<{ name: string, keywords: string[] }> = [];

      if (cleanNicheStr.includes('авто') || cleanNicheStr.includes('сто') || cleanNicheStr.includes('двигун')) {
        generated = [
          { name: 'Діагностика двигуна', keywords: ['"комп\'ютерна діагностика двигуна"', '[діагностика авто київ]', 'діагностика двигуна ціна'] },
          { name: 'Ремонт підвіски СТО', keywords: ['"ремонт ходової частини ціни"', '[ремонт підвіски авто]', 'сто ремонт амортизаторів'] },
          { name: 'Комплексне ТО машин', keywords: ['"заміна мастила та фільтрів"', '[технічне обслуговування авто]', 'заміна гальмівних колодок'] }
        ];
      } else if (cleanNicheStr.includes('метал') || cleanNicheStr.includes('прокат')) {
        generated = [
          { name: 'Металобаза Опт', keywords: ['"армутура сталева оптом"', '[металопрокат від виробника]', 'купити труби металеві'] },
          { name: 'Лазерна порізка листа', keywords: ['"порізка металу лазером ціна"', '[лазерна різка сталі]', 'порізка листового металу'] }
        ];
      } else {
        generated = [
          { name: 'Органічний догляд за шкірою', keywords: ['"натуральна косметика для лиця"', '[крем з гіалуроновою кислотою]', 'сироватка для зволоження'] },
          { name: 'Корейські бренди купити', keywords: ['"косметика кореї офіційний дистриб\'ютор"', '[купити патчі київ]', 'догляд за обличчям без зморшок'] }
        ];
      }

      setAdGroups(generated);
      
      // Feedheadlines of generated templates
      const nextHeads: Record<string, string[]> = {};
      const nextDescs: Record<string, string[]> = {};
      generated.forEach((g, idx) => {
        nextHeads[idx] = [`Купити ${g.name}`, `Найкращі ціни в Україні`, `Офіційні сертифікати якості`, g.keywords[0].replace(/["'\[\]]/g, ''), 'Доставка за 1 день', '', '', '', '', '', '', '', '', '', ''];
        nextDescs[idx] = [`Шукаєте надійний ${g.name} за кращими цінами? Замовляйте з гарантією та доставкою!`, `Офіційний імпортер. Повний спектр послуг. Дзвоніть нам зараз і отримайте кошторис.`, '', ''];
      });
      setHeadlines(nextHeads);
      setDescriptions(nextDescs);

      triggerToast("AI згенерував оптимальну структуру кампанії успішно!");
    }, 2000);
  };

  // Generate ads texts
  const handleGenerateAdTexts = (groupIdx: number) => {
    setIsGeneratingAdText(prev => ({ ...prev, [groupIdx]: true }));
    
    setTimeout(() => {
      setIsGeneratingAdText(prev => ({ ...prev, [groupIdx]: false }));
      const currentGroupName = adGroups[groupIdx]?.name || 'Спецпропозиція';
      
      const generatedHeads = [
        `Купити ${currentGroupName}`,
        `Найкращий ${currentGroupName} Київ`,
        `Офіційна Гарантія Якості`,
        `Замовити Зі Знижкою -15%`,
        `Швидка Доставка За 1 День`,
        `Працюємо З ПДВ Та Готівкою`,
        `Кращі УТП На Ринку України`,
        'Телефонуйте Для Замовлення',
        '', '', '', '', '', '', ''
      ];

      const generatedDescs = [
        `Професійне рішеня для категорії ${currentGroupName}. Тільки перевірені бренди з ліцензіями.`,
        `Отримуйте миттєву знижку при оформленні на сайті. Консультація профі безкоштовно!`,
        '', ''
      ];

      setHeadlines(prev => ({ ...prev, [groupIdx]: generatedHeads }));
      setDescriptions(prev => ({ ...prev, [groupIdx]: generatedDescs }));
      
      triggerToast(`AI згенерував тексти оголошень для групи "${currentGroupName}"!`);
    }, 1200);
  };

  // RSA Preview calculation: take first three filled headlines and first two filled descriptions of active group index
  const makeRsaPreview = (groupIdx: number) => {
    const heads = (headlines[groupIdx] || []).filter(h => h.trim().length > 0);
    const descs = (descriptions[groupIdx] || []).filter(d => d.trim().length > 0);
    
    return {
      heads: [
        heads[0] || 'Ваш Офіційний Результат',
        heads[1] || 'Краща Пропозиція На Ринку',
        heads[2] || 'Знижки Та Подарунки'
      ],
      descs: [
        descs[0] || 'Офіційний партнер бренду в Україні. Сертифікована лінійка товарів на складі. Телефонуйте!',
        descs[1] || 'Швидка відправка в день замовлення по всій країні. Знижки та акції!'
      ]
    };
  };

  // Finish handlers
  const compileDraftData = (status: 'draft' | 'ready'): CampaignDraft => {
    return {
      id: `draft-${Date.now()}`,
      clientId: selectedClientId,
      name: campaignName,
      type: campaignType,
      dailyBudget,
      targetCpa: bidStrategy === 'TARGET_CPA' ? targetValue : null,
      biddingStrategy: bidStrategy,
      geoTargets,
      adGroups: adGroups.map((g, idx) => ({
        name: g.name,
        keywords: g.keywords,
        negatives: campaignNegatives.split('\n').map(l => l.trim()).filter(l => l.length > 0),
        headlines: (headlines[idx] || []).filter(h => h.trim().length > 0),
        descriptions: (descriptions[idx] || []).filter(d => d.trim().length > 0)
      })),
      status,
      createdAt: new Date().toISOString(),
      notes: nicheDescription
    };
  };

  const handleSaveDraftClick = () => {
    const draft = compileDraftData('draft');
    onSaveDraft(draft);
    triggerToast("Чернетку успішно збережено в 'Campaign Drafts'!");
    setStep(1); // reset or stay
  };

  const handleExportCsvClick = () => {
    triggerToast("CSV для Google Ads Editor успішно сформовано та готовий до завантаження!");
  };

  const handleSubmitForApprovalClick = () => {
    const draft = compileDraftData('ready');
    onSubmitForApproval(draft);
    triggerToast("Кампанія відправлена на підтвердження! Додано в чергу вигрузки (Staging).");
    setStep(1); // reset
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
      
      {/* Toast alert */}
      {showToast && (
        <div className="fixed top-24 right-6 z-50 p-4 bg-emerald-600 text-white rounded shadow-xl flex items-center gap-2 text-xs font-semibold font-mono border border-emerald-500 animate-slide-in">
          <Check size={16} /> {showToast}
        </div>
      )}

      {/* Stepper bar */}
      <div className={`p-4 rounded-lg border ${
        currentTheme === 'light' ? 'bg-white border-slate-205' : 'bg-slate-905 border-slate-800'
      }`}>
        <div className="flex items-center justify-between font-mono text-[11px] max-w-2xl mx-auto">
          {[
            { n: 1, text: 'Основи' },
            { n: 2, text: 'Таргетинг' },
            { n: 3, text: 'Структура' },
            { n: 4, text: 'Оголошення' },
            { n: 5, text: 'Фінал' }
          ].map((s) => (
            <div key={s.n} className="flex items-center gap-1.5">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold font-sans ${
                step === s.n 
                  ? 'bg-indigo-600 text-white' 
                  : step > s.n 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' 
                  : 'bg-slate-800 text-slate-500 border border-slate-750'
              }`}>
                {s.n}
              </span>
              <span className={step === s.n ? 'text-indigo-400 font-bold' : 'text-slate-400'}>{s.text}</span>
              {s.n < 5 && <ChevronStepRight />}
            </div>
          ))}
        </div>
      </div>

      {/* STEP 1: BASICS */}
      {step === 1 && (
        <div className={`p-6 rounded-lg border max-w-3xl mx-auto space-y-5 ${
          currentTheme === 'light' ? 'bg-white border-slate-205' : 'bg-slate-905 border-slate-800'
        }`}>
          <h3 className="font-bold text-sm uppercase tracking-wider text-slate-400 font-display flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-850">
            <Wand2 size={16} className="text-indigo-505" />
            Крок 1: Базові параметри кампанії
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-[10px] font-mono uppercase text-slate-400">Клієнт</label>
              <select
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                className="w-full p-2 bg-slate-100/10 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded outline-none text-xs focus:border-indigo-500"
              >
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-mono uppercase text-slate-400">Назва кампанії</label>
              <input 
                type="text"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                className="w-full p-2 bg-slate-100/10 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded outline-none text-xs focus:border-indigo-500 font-mono"
              />
              <span className="text-[9px] font-mono text-slate-500 block">Формат: {activeClient.name.split(' ')[0]}_UA_Type_Theme</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-mono uppercase text-slate-400">Тип Кампанії Google Ads (Актуальні формати 2024-2025)</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { type: 'search', title: 'Search (Пошукова)', desc: 'Текстові оголошення в результатах пошуку Google. Для прямого гарячого попиту. Доступно в Україні.' },
                { type: 'pmax', title: 'Performance Max', desc: 'Мультиканальна AI-кампанія по всіх ресурсах Google (Пошук, YouTube, Gmail, Карты, Shopping, Display). Доступно в Україні.' },
                { type: 'display', title: 'Display (Медійна)', desc: 'Графічні банери на партнерських сайтах КМС. Для охоплення цільової аудиторії та впізнаваності. Доступно в Україні.' },
                { type: 'shopping', title: 'Shopping (Торгова)', desc: 'Картки товарів з цінами та фото у Пошуку і вкладці "Покупки". Оптимально для інтернет-магазинів. Доступно в Україні.' },
                { type: 'video', title: 'Video (Відео)', desc: 'Відеореклама в YouTube, Shorts та сайтах партнерів для залучення уваги та конверсій. Доступно в Україні.' },
                { type: 'demand_gen', title: 'Demand Gen (Попит)', desc: 'Сучасні AI-кампанії в Shorts, Discover, YouTube та Gmail. На зміну Discovery для стимулювання інтересу. Доступно в Україні.' },
                { type: 'app', title: 'App (Додатки)', desc: 'Автоматизована реклама мобільних додатків у Google Play, YouTube та мережах для залучення інсталяцій. Доступно в Україні.' }
              ].map((t) => (
                <div 
                  key={t.type}
                  onClick={() => setCampaignType(t.type as any)}
                  className={`p-3.5 rounded-lg border cursor-pointer text-xs space-y-1 leading-snug transition-all flex flex-col justify-between ${
                    campaignType === t.type 
                      ? 'border-indigo-500 bg-indigo-500/5 ring-1 ring-indigo-500' 
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-800/10'
                  }`}
                >
                  <div>
                    <p className="font-bold text-slate-900 dark:text-slate-100 flex items-center justify-between">
                      {t.title}
                      {campaignType === t.type && <span className="w-2 h-2 rounded-full bg-indigo-500" />}
                    </p>
                    <p className="text-[10px] text-slate-450 dark:text-slate-400 mt-1 leading-relaxed">{t.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="block text-[10px] font-mono uppercase text-slate-400">Стратегія ставок</label>
              <select
                value={bidStrategy}
                onChange={(e) => setBidStrategy(e.target.value as any)}
                className="w-full p-2 bg-slate-100/10 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded outline-none text-xs"
              >
                <option value="TARGET_CPA">Target CPA (Цільова CPA)</option>
                <option value="TARGET_ROAS">Target ROAS (Рентабельність)</option>
                <option value="MAXIMIZE_CONVERSIONS">Maximize Conversions</option>
                <option value="MANUAL_CPC">Manual CPC (Ручний клік)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-mono uppercase text-slate-400">
                {bidStrategy === 'TARGET_CPA' ? 'Цільовий CPA (UAH)' : bidStrategy === 'TARGET_ROAS' ? 'Цільовий ROAS (%)' : 'Ліміт ставки (UAH)'}
              </label>
              <input 
                type="number"
                disabled={bidStrategy === 'MAXIMIZE_CONVERSIONS'}
                value={targetValue}
                onChange={(e) => setTargetValue(Number(e.target.value))}
                className="w-full p-2 bg-slate-100/10 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded outline-none text-xs focus:border-indigo-500 disabled:opacity-50"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-mono uppercase text-slate-400">Денний Бюджет (UAH)</label>
              <input 
                type="number"
                value={dailyBudget}
                onChange={(e) => setDailyBudget(Number(e.target.value))}
                className="w-full p-2 bg-slate-100/10 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded outline-none text-xs focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-850">
            <button
              onClick={() => setStep(2)}
              className="px-4 py-2 bg-indigo-650 hover:bg-indigo-750 text-white text-xs font-semibold rounded flex items-center gap-1.5 outline-none font-mono"
            >
              Крок 2: Таргетинг <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: TARGETING */}
      {step === 2 && (
        <div className={`p-6 rounded-lg border max-w-3xl mx-auto space-y-5 ${
          currentTheme === 'light' ? 'bg-white border-slate-205' : 'bg-slate-905 border-slate-800'
        }`}>
          <h3 className="font-bold text-sm uppercase tracking-wider text-slate-400 font-display flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-850">
            <MapPin size={16} className="text-indigo-505" />
            Крок 2: Налаштування націлювання (Таргетинг)
          </h3>

          {/* Geo Targets multi-select */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-mono uppercase text-slate-400">Географічні регіони (Мульти-вибір)</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {geoOptions.map((g) => {
                const isSelected = geoTargets.includes(g);
                return (
                  <button
                    key={g}
                    onClick={() => toggleGeo(g)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium border flex items-center gap-1 outline-none transition-all ${
                      isSelected 
                        ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400' 
                        : 'bg-slate-500/5 border-slate-200 dark:border-slate-800 text-slate-400 hover:bg-slate-800/20'
                    }`}
                  >
                    {isSelected && <Check size={12} />} {g}
                  </button>
                );
              })}
            </div>
            
            <div className="flex gap-2 max-w-xs">
              <input
                type="text"
                value={customGeo}
                onChange={(e) => setCustomGeo(e.target.value)}
                placeholder="Службове місто (наприклад: Львів)..."
                className="p-1 px-2.5 bg-slate-100/10 dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded outline-none text-xs flex-1 text-slate-100"
              />
              <button
                onClick={addCustomGeo}
                className="px-3 py-1 bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 text-xs rounded"
              >
                Додати
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Lang Checkboxes */}
            <div className="space-y-2">
              <label className="block text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1">
                <Languages size={13} className="text-slate-400" /> Мови аудиторії
              </label>
              <div className="space-y-1.5 p-3 rounded bg-slate-500/5 border border-slate-205 dark:border-slate-800/40">
                {['Українська', 'Російська', 'Англійська'].map((lang) => (
                  <label key={lang} className="flex items-center gap-2 text-xs text-slate-300 font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={languages.includes(lang)}
                      onChange={() => toggleLanguage(lang)}
                      className="rounded border-slate-700 text-indigo-600 focus:ring-0"
                    />
                    {lang}
                  </label>
                ))}
              </div>
            </div>

            {/* Devices & Slider Adjustments */}
            <div className="space-y-3">
              <label className="block text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1">
                <Tv size={13} className="text-slate-400" /> Пристрої показу
              </label>
              <div className="space-y-1.5 p-3 rounded bg-slate-500/5 border border-slate-205 dark:border-slate-800/40">
                {['Мобільні', 'Десктоп', 'Планшети'].map((dev) => (
                  <label key={dev} className="flex items-center gap-2 text-xs text-slate-300 font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={devices.includes(dev)}
                      onChange={() => toggleDevice(dev)}
                      className="rounded border-slate-700 text-indigo-600 focus:ring-0"
                    />
                    {dev}
                  </label>
                ))}
              </div>

              {/* Slider for adjustments */}
              <div className="space-y-1.5 pt-1.5">
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                  <span>Коригування ставок мобільних:</span>
                  <span className="font-bold text-indigo-400">{bidAdjustment >= 0 ? `+${bidAdjustment}` : bidAdjustment}%</span>
                </div>
                <input
                  type="range"
                  min="-30"
                  max="30"
                  value={bidAdjustment}
                  onChange={(e) => setBidAdjustment(Number(e.target.value))}
                  className="w-full accent-indigo-600 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                />
              </div>

            </div>

          </div>

          <div className="flex justify-between pt-3 border-t border-slate-100 dark:border-slate-850">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 hover:bg-slate-800 text-slate-400 text-xs font-semibold rounded flex items-center gap-1.5 outline-none font-mono border border-slate-800"
            >
              <ArrowLeft size={14} /> Назад
            </button>
            <button
              onClick={() => setStep(3)}
              className="px-4 py-2 bg-indigo-650 hover:bg-indigo-750 text-white text-xs font-semibold rounded flex items-center gap-1.5 outline-none font-mono"
            >
              Крок 3: Структура <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: STRUCTURE */}
      {step === 3 && (
        <div className={`p-6 rounded-lg border max-w-4xl mx-auto space-y-5 ${
          currentTheme === 'light' ? 'bg-white border-slate-205' : 'bg-slate-905 border-slate-800'
        }`}>
          <h3 className="font-bold text-sm uppercase tracking-wider text-slate-400 font-display flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-850">
            <Grid size={16} className="text-indigo-505" />
            Крок 3: Групи оголошень та ключові слова
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Left Generator tools column */}
            <div className="md:col-span-1 space-y-4">
              <div className="p-4 rounded border border-indigo-505/20 bg-indigo-600/5 space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-violet-400 font-display flex items-center gap-1">
                  <Sparkles size={13} /> AI Структуратор
                </h4>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Опишіть нішу клієнта та його ключові переваги. AI згенерує 3 тематичні групи з релевантними ключовими словами.
                </p>
                
                <textarea
                  value={nicheDescription}
                  onChange={(e) => setNicheDescription(e.target.value)}
                  placeholder="Наприклад: автосервіс на Подолі, ремонт підвіски за 1 годину, досвідчені майстри, ціна від 400 UAH..."
                  rows={4}
                  className="w-full p-2 bg-slate-100/10 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded outline-none text-xs leading-relaxed focus:border-indigo-500"
                />

                <button
                  onClick={handleGenerateStructure}
                  disabled={!nicheDescription.trim() || isGeneratingStruct}
                  className="w-full py-1.5 bg-violet-650 hover:bg-violet-755 text-white text-[11px] font-bold rounded flex items-center justify-center gap-1"
                >
                  {isGeneratingStruct ? (
                    <>
                      <div className="border border-indigo-400 border-t-white animate-spin rounded-full w-3 h-3" />
                      Підбираю семантику...
                    </>
                  ) : (
                    'Згенерувати структуру AI'
                  )}
                </button>
              </div>

              {/* Shared account exclusions */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono uppercase text-slate-400">Глобальні мінус-слова на кампанію</label>
                <textarea
                  value={campaignNegatives}
                  onChange={(e) => setCampaignNegatives(e.target.value)}
                  rows={4}
                  className="w-full p-2 bg-slate-100/10 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded outline-none font-mono text-[10px] leading-relaxed"
                />
                <span className="text-[9px] font-mono text-slate-500 block">По одному слову в рядок</span>
              </div>
            </div>

            {/* Groups list editing column */}
            <div className="md:col-span-2 space-y-4 max-h-[500px] overflow-y-auto pr-1">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800/10">
                <span className="text-[10px] font-mono uppercase text-slate-400">Створені групи ({adGroups.length})</span>
                <button
                  onClick={addAdGroup}
                  className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold font-mono rounded flex items-center gap-1.5"
                >
                  <Plus size={12} />+ Група
                </button>
              </div>

              {adGroups.map((group, groupIdx) => (
                <div key={groupIdx} className="p-3.5 rounded border border-slate-200 dark:border-slate-800 bg-slate-500/5 space-y-3 relative">
                  <button
                    onClick={() => removeAdGroup(groupIdx)}
                    disabled={adGroups.length <= 1}
                    className="absolute top-3 right-3 text-slate-500 hover:text-rose-500 disabled:opacity-30"
                    title="Видалити групу"
                  >
                    <Trash2 size={14} />
                  </button>

                  <div className="space-y-1 max-w-xs">
                    <label className="block text-[9px] font-mono uppercase text-slate-450">Назва групи оголошень</label>
                    <input
                      type="text"
                      value={group.name}
                      onChange={(e) => updateAdGroupName(groupIdx, e.target.value)}
                      className="p-1 px-2.5 bg-slate-105/10 dark:bg-slate-955 border border-slate-200 dark:border-slate-750 font-sans font-bold text-xs rounded outline-none w-full text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[9px] font-mono uppercase text-slate-455">
                      Ключові слова (по одному на рядок з синтаксисом)
                    </label>
                    <textarea
                      defaultValue={group.keywords.join('\n')}
                      onBlur={(e) => updateAdGroupKeywords(groupIdx, e.target.value)}
                      rows={3}
                      placeholder="Наприклад: [зволожуючий крем], &quot;купити крем&quot;, косметика доставка..."
                      className="w-full p-2 bg-slate-100/10 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded outline-none text-xs font-mono leading-relaxed"
                    />
                    <span className="text-[8px] font-mono text-slate-500 block">
                      Використовуйте [] для точної та "" для фразової відповідності
                    </span>
                  </div>
                </div>
              ))}
            </div>

          </div>

          <div className="flex justify-between pt-3 border-t border-slate-100 dark:border-slate-850">
            <button
              onClick={() => setStep(2)}
              className="px-4 py-2 hover:bg-slate-800 text-slate-400 text-xs font-semibold rounded flex items-center gap-1.5 outline-none font-mono border border-slate-800"
            >
              <ArrowLeft size={14} /> Назад
            </button>
            <button
              onClick={() => setStep(4)}
              className="px-4 py-2 bg-indigo-650 hover:bg-indigo-750 text-white text-xs font-semibold rounded flex items-center gap-1.5 outline-none font-mono"
            >
              Крок 4: Оголошення <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: ADS & RSA PREVIEW */}
      {step === 4 && (
        <div className={`p-6 rounded-lg border max-w-5xl mx-auto space-y-5 ${
          currentTheme === 'light' ? 'bg-white border-slate-205' : 'bg-slate-905 border-slate-800'
        }`}>
          <h3 className="font-bold text-sm uppercase tracking-wider text-slate-400 font-display flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-850">
            <Type size={16} className="text-indigo-505" />
            Крок 4: Адаптивні пошукові оголошення (RSA)
          </h3>

          {adGroups.map((group, groupIdx) => {
            const preview = makeRsaPreview(groupIdx);
            const activeHeads = headlines[groupIdx] || Array(15).fill('');
            const activeDescs = descriptions[groupIdx] || Array(4).fill('');

            return (
              <div key={groupIdx} className="p-4 border border-slate-200 dark:border-slate-850 rounded bg-slate-500/5 grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
                
                {/* Inputs Columns 2x */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex justify-between items-center pb-1.5 border-b border-slate-100 dark:border-slate-800">
                    <span className="font-bold text-slate-900 dark:text-white text-xs">Тексти оголошень для групи: {group.name}</span>
                    <button
                      onClick={() => handleGenerateAdTexts(groupIdx)}
                      disabled={isGeneratingAdText[groupIdx]}
                      className="px-3 py-1 bg-violet-650 hover:bg-violet-755 disabled:opacity-50 text-white text-[10px] font-bold font-mono rounded flex items-center gap-1 transition"
                    >
                      {isGeneratingAdText[groupIdx] ? (
                        <>
                          <div className="border border-indigo-200 border-t-white animate-spin rounded-full w-3 h-3" />
                          Складаю копірайтинг...
                        </>
                      ) : (
                        <>
                          <Sparkles size={11} /> Заповнити AI
                        </>
                      )}
                    </button>
                  </div>

                  {/* Headlines segment grid */}
                  <div className="space-y-1.5">
                    <label className="block text-[9px] font-mono uppercase text-slate-400">
                      Заголовки оголошень (Рекомендується 5+ варіантів, до 30 симв.)
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {activeHeads.slice(0, 6).map((headlineValue, hIdx) => {
                        const exceeds = headlineValue.length > 30;
                        return (
                          <div key={hIdx} className="space-y-0.5">
                            <input
                              type="text"
                              value={headlineValue}
                              placeholder={`Заголовок ${hIdx + 1}`}
                              maxLength={35}
                              className={`w-full p-1.5 bg-slate-100/5 dark:bg-slate-950 border text-xs rounded outline-none font-sans ${
                                exceeds ? 'border-rose-500 text-rose-500' : 'border-slate-200 dark:border-slate-800 focus:border-indigo-500'
                              }`}
                              onChange={(e) => {
                                const val = e.target.value;
                                setHeadlines(prev => {
                                  const headsCopy = [...(prev[groupIdx] || Array(15).fill(''))];
                                  headsCopy[hIdx] = val;
                                  return { ...prev, [groupIdx]: headsCopy };
                                });
                              }}
                            />
                            <div className="flex justify-between text-[8px] font-mono px-1">
                              <span className="text-slate-500">#{hIdx + 1}</span>
                              <span className={exceeds ? 'text-rose-500 font-bold' : 'text-slate-450'}>{headlineValue.length}/30</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Descriptions segment */}
                  <div className="space-y-1.5">
                    <label className="block text-[9px] font-mono uppercase text-slate-400">
                      Описи оголошень (До 4 варіантів, до 90 симв.)
                    </label>
                    <div className="space-y-2">
                      {activeDescs.slice(0, 2).map((descValue, dIdx) => {
                        const exceeds = descValue.length > 90;
                        return (
                          <div key={dIdx} className="space-y-0.5">
                            <input
                              type="text"
                              value={descValue}
                              placeholder={`Опис оголошення ${dIdx + 1}`}
                              maxLength={100}
                              className={`w-full p-1.5 bg-slate-105/5 dark:bg-slate-950 border text-xs rounded outline-none ${
                                exceeds ? 'border-rose-500 text-rose-500' : 'border-slate-200 dark:border-slate-800 focus:border-indigo-500'
                              }`}
                              onChange={(e) => {
                                const val = e.target.value;
                                setDescriptions(prev => {
                                  const descsCopy = [...(prev[groupIdx] || Array(4).fill(''))];
                                  descsCopy[dIdx] = val;
                                  return { ...prev, [groupIdx]: descsCopy };
                                });
                              }}
                            />
                            <div className="flex justify-between text-[8px] font-mono px-1">
                              <span className="text-slate-500">#{dIdx + 1}</span>
                              <span className={exceeds ? 'text-rose-500 font-bold' : 'text-slate-450'}>{descValue.length}/90</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>

                {/* Preview Column 1x */}
                <div className="space-y-3">
                  <div className="flex items-center gap-1 font-mono text-[10px] uppercase text-slate-400 border-b border-slate-100 dark:border-slate-850 pb-1.5">
                    <Eye size={12} className="text-indigo-400" /> Лайв-прев'ю пошуку Google (RSA)
                  </div>

                  {/* Realistic mock search container */}
                  <div className="p-4 bg-white text-slate-800 rounded border border-slate-200 shadow-sm text-xs font-sans space-y-2 min-h-[160px]">
                    <div className="flex items-center gap-1 text-[10px] text-slate-500">
                      <span className="underline select-none">https://www.google.com</span>
                      <ChevronStepRight />
                      <span className="text-[10px] text-slate-400 select-none">реклама</span>
                    </div>

                    <a href="#" className="text-indigo-600 hover:underline block font-semibold text-sm leading-snug">
                      {preview.heads[0]} | {preview.heads[1]} | {preview.heads[2]}
                    </a>

                    <p className="text-slate-600 leading-normal text-xs">
                      {preview.descs[0]} {preview.descs[1]}
                    </p>

                    <div className="flex gap-2.5 pt-2 text-[10px] text-indigo-500 font-mono select-none">
                      <span className="hover:underline">✓ Купити Онлайн</span>
                      <span className="hover:underline">⚡ Відгуки та Фото</span>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-indigo-500/5 rounded border border-indigo-500/10 text-[10px] text-indigo-400 font-semibold leading-relaxed">
                    💡 Прев'ю відображає ротацію перших впевнених запитів. Google динамічно комбінує ці текстові долі на аукціонах.
                  </div>
                </div>

              </div>
            );
          })}

          <div className="flex justify-between pt-3 border-t border-slate-100 dark:border-slate-850">
            <button
              onClick={() => setStep(3)}
              className="px-4 py-2 hover:bg-slate-800 text-slate-400 text-xs font-semibold rounded flex items-center gap-1.5 outline-none font-mono border border-slate-800"
            >
              <ArrowLeft size={14} /> Назад
            </button>
            <button
              onClick={() => setStep(5)}
              className="px-4 py-2 bg-indigo-650 hover:bg-indigo-750 text-white text-xs font-semibold rounded flex items-center gap-1.5 outline-none font-mono"
            >
              Крок 5: Завершення <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: FINAL SUMMARY */}
      {step === 5 && (
        <div className={`p-6 rounded-lg border max-w-2xl mx-auto space-y-6 text-center ${
          currentTheme === 'light' ? 'bg-white border-slate-205' : 'bg-slate-905 border-slate-800'
        }`}>
          <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 border border-indigo-505/20 rounded-full flex items-center justify-center mx-auto mb-2">
            <FileCheck size={26} />
          </div>

          <div className="space-y-1">
            <h3 className="font-bold text-base font-display">Кампанія готова до збереження</h3>
            <p className="text-xs text-slate-400 leading-normal max-w-md mx-auto">
              Ви завершили заповнення всіх кроків архітектури. Тепер ви можете завантажити CSV для Ads Editor або відправити структуру в чергу підтверджень.
            </p>
          </div>

          <div className="bg-slate-500/5 p-4 rounded border text-left space-y-3 font-mono text-[11px] leading-relaxed max-w-lg mx-auto">
            <h5 className="font-bold text-xs uppercase text-slate-350 tracking-wider">Резюме замовлення:</h5>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 border-b border-white/5 pb-2.5">
              <span className="text-slate-450">Клієнт:</span>
              <span className="font-bold text-slate-100">{activeClient.name} ({activeClient.industry})</span>
              
              <span className="text-slate-450">Тип і Назва:</span>
              <span className="font-bold text-indigo-400">{campaignType.toUpperCase()} | {campaignName}</span>
              
              <span className="text-slate-450">Денний Бюджет:</span>
              <span className="font-bold text-emerald-420">{dailyBudget} UAH/добу</span>

              <span className="text-slate-450">Цільовий CPA:</span>
              <span className="font-bold text-slate-150">{bidStrategy === 'TARGET_CPA' ? `${targetValue} UAH` : 'Не задіяна'}</span>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              <span className="text-slate-450">Кількість груп:</span>
              <span className="font-bold text-slate-150">{adGroups.length} шт.</span>

              <span className="text-slate-450">Згенеровано активів:</span>
              <span className="font-bold text-slate-150">
                {adGroups.reduce((acc, g, idx) => acc + (headlines[idx] || []).filter(h => h.trim().length > 0).length + (descriptions[idx] || []).filter(d => d.trim().length > 0).length, 0)} одиниць
              </span>

              <span className="text-slate-450">Таргетинг Гео:</span>
              <span className="font-bold text-slate-150 truncate" title={geoTargets.join(', ')}>{geoTargets.join(', ')}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4 max-w-md mx-auto">
            <button
              onClick={handleSaveDraftClick}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold rounded flex-1 inline-flex justify-center items-center gap-1.5 transition"
            >
              Зберегти чернетку
            </button>
            <button
              onClick={handleExportCsvClick}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold rounded flex-1 inline-flex justify-center items-center gap-1.5 transition"
            >
              <Download size={13} /> Експортувати CSV
            </button>
            <button
              onClick={handleSubmitForApprovalClick}
              className="px-5 py-2 bg-indigo-650 hover:bg-indigo-750 text-white text-xs font-bold rounded flex-1 inline-flex justify-center items-center gap-1.5 transition shadow"
            >
              <Check size={14} /> Відправити на підтвердження
            </button>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setStep(4)}
              className="text-xs text-slate-500 hover:text-slate-300 font-mono underline outline-none"
            >
              Редагувати останній крок
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

// Compact visual dividers
function ChevronStepRight() {
  return <span className="text-slate-600 font-mono font-bold select-none">&gt;&gt;</span>;
}
