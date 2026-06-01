import { 
  Client, 
  Campaign, 
  Decision, 
  AIAgent, 
  AutomationScript, 
  BalanceRecord, 
  SearchTermItem, 
  Document, 
  AuditLog,
  AgentChatMessage,
  AdAsset,
  AdGroup,
  CampaignDraft,
  StagedChange,
  AnalysisChange,
  AgentAnalysisResult
} from './types';

export const INITIAL_CLIENTS: Client[] = [
  {
    id: 'c1',
    name: 'Бета Косметика',
    accountId: '840-391-2094',
    healthScore: 82,
    budgetLimit: 45000,
    budgetSpent: 38200,
    ctr: 3.42,
    cpc: 8.50,
    cpa: 145.00,
    conversions: 263,
    riskLevel: 'medium',
    lastAction: 'Додано мінус-слова за рекомендацією AI',
    nextStep: 'Верифікація пошукових запитів в уїкенд-кампаніях',
    currency: 'UAH',
    status: 'warning',
    industry: 'E-commerce, Краса & Догляд',
    optimizationPriority: 'balanced',
    agentNotes: ''
  },
  {
    id: 'c2',
    name: 'Дельта Авто',
    accountId: '517-900-2411',
    healthScore: 45,
    budgetLimit: 120000,
    budgetSpent: 118400,
    ctr: 1.84,
    cpc: 24.50,
    cpa: 620.00,
    conversions: 191,
    riskLevel: 'high',
    lastAction: 'Автоматичне попередження про вичерпання балансу',
    nextStep: 'Поповнити баланс аккаунта Google Ads',
    currency: 'UAH',
    status: 'warning',
    industry: 'Автосервіс, Запчастини',
    optimizationPriority: 'balanced',
    agentNotes: ''
  },
  {
    id: 'c3',
    name: 'Альфа Метал',
    accountId: '392-411-9034',
    healthScore: 94,
    budgetLimit: 85000,
    budgetSpent: 42100,
    ctr: 4.12,
    cpc: 18.20,
    cpa: 410.00,
    conversions: 102,
    riskLevel: 'low',
    lastAction: 'Адаптація биндингу для пошуку B2B',
    nextStep: 'Контроль за новими категоріями металопрокату',
    currency: 'UAH',
    status: 'active',
    industry: 'B2B Виробництво, Важка промисловість',
    optimizationPriority: 'balanced',
    agentNotes: ''
  },
  {
    id: 'c4',
    name: 'Гамма Хелс',
    accountId: '211-505-8843',
    healthScore: 89,
    budgetLimit: 60000,
    budgetSpent: 51200,
    ctr: 2.95,
    cpc: 12.80,
    cpa: 220.00,
    conversions: 232,
    riskLevel: 'low',
    lastAction: 'Заміна офферу на банерах в КМС',
    nextStep: 'Аналіз результативності за гео-модифікаторами',
    currency: 'UAH',
    status: 'active',
    industry: 'Медичні послуги, Клініки',
    optimizationPriority: 'balanced',
    agentNotes: ''
  }
];

export const INITIAL_CAMPAIGNS: Campaign[] = [
  // Client 1
  {
    id: 'g1_1',
    clientId: 'c1',
    name: 'Beta_UA_Search_Brand_Ecomm',
    budget: 800,
    spent: 720,
    status: 'active',
    impressions: 12500,
    clicks: 850,
    ctr: 6.8,
    cpc: 4.20,
    conversions: 92,
    cpa: 7.82,
  },
  {
    id: 'g1_2',
    clientId: 'c1',
    name: 'Beta_UA_PerformanceMax_AllProducts',
    budget: 2500,
    spent: 2480,
    status: 'active',
    impressions: 89000,
    clicks: 1420,
    ctr: 1.6,
    cpc: 10.50,
    conversions: 140,
    cpa: 17.71,
  },
  {
    id: 'g1_3',
    clientId: 'c1',
    name: 'Beta_UA_Search_Cosmetics_Category_Generic',
    budget: 1200,
    spent: 980,
    status: 'active',
    impressions: 24500,
    clicks: 490,
    ctr: 2.0,
    cpc: 15.30,
    conversions: 31,
    cpa: 31.61,
  },
  // Client 2
  {
    id: 'g2_1',
    clientId: 'c2',
    name: 'Delta_UA_Search_Parts_B2C',
    budget: 5000,
    spent: 4950,
    status: 'active',
    impressions: 45000,
    clicks: 1800,
    ctr: 4.0,
    cpc: 22.10,
    conversions: 110,
    cpa: 45.00,
  },
  {
    id: 'g2_2',
    clientId: 'c2',
    name: 'Delta_UA_PerformanceMax_Remont_Dvyhuna',
    budget: 3500,
    spent: 3410,
    status: 'active',
    impressions: 127000,
    clicks: 2210,
    ctr: 1.74,
    cpc: 25.50,
    conversions: 81,
    cpa: 42.10,
  },
  {
    id: 'g2_3',
    clientId: 'c2',
    name: 'Delta_UA_Display_Remarketing',
    budget: 1500,
    spent: 1490,
    status: 'paused',
    impressions: 340000,
    clicks: 1020,
    ctr: 0.3,
    cpc: 4.80,
    conversions: 0,
    cpa: 0,
  },
  // Client 3
  {
    id: 'g3_1',
    clientId: 'c3',
    name: 'Alpha_UA_Search_B2B_Prokat_Metal_Kyiv',
    budget: 3000,
    spent: 1250,
    status: 'active',
    impressions: 11200,
    clicks: 480,
    ctr: 4.28,
    cpc: 16.50,
    conversions: 62,
    cpa: 20.16,
  },
  {
    id: 'g3_2',
    clientId: 'c3',
    name: 'Alpha_UA_Search_B2B_Truby_Shveler',
    budget: 2000,
    spent: 1820,
    status: 'active',
    impressions: 9800,
    clicks: 390,
    ctr: 3.97,
    cpc: 21.00,
    conversions: 40,
    cpa: 45.50,
  },
  // Client 4
  {
    id: 'g4_1',
    clientId: 'c4',
    name: 'Gamma_UA_Search_All_Services_Brand',
    budget: 1500,
    spent: 1440,
    status: 'active',
    impressions: 4800,
    clicks: 720,
    ctr: 15.0,
    cpc: 5.20,
    conversions: 180,
    cpa: 8.00,
  }
];

export const INITIAL_DECISIONS: Decision[] = [
  {
    id: 'dec-1',
    clientId: 'c1',
    clientName: 'Бета Косметика',
    priority: 'high',
    title: 'Додати 14 мінус-слів в брендову кампанію',
    desc: 'Агент знайшов сміттєві запити на кшталт "безкоштовно скачати рецепт косметики", які зливали бюджет за останні 7 днів.',
    actionType: 'add_negatives',
    source: 'agent',
    sourceName: 'Search Terms Agent',
    status: 'pending',
    payload: {
      negatives: ['безкоштовно', 'рецепт', 'завантажити', 'книга', 'своїми руками', 'ютуб', 'вебінар', 'курси', 'історія', 'виробництво', 'хімія', 'як зробити', 'англійською', 'вакансії']
    },
    createdAt: '2026-05-31T12:30:11Z',
    feedbackStats: { timesRejected: 0, timesApproved: 4 }
  },
  {
    id: 'dec-2',
    clientId: 'c2',
    clientName: 'Дельта Авто',
    priority: 'high',
    title: 'Критичне поповнення гаманця (Залишилось < 0.5 днів)',
    desc: 'Поточний добовий спад становить 4,500 UAH, баланс складає 1,600 UAH. Кампанії зупиняться приблизно о 23:00.',
    actionType: 'refill_balance',
    source: 'script',
    sourceName: 'balances.py',
    status: 'pending',
    payload: {
      amountNeeded: 25000,
      details: 'Рекомендоване поповнення на 5 днів життєдіяльності аккаунту: 25,000 UAH.'
    },
    createdAt: '2026-05-31T15:45:00Z',
    feedbackStats: { timesRejected: 0, timesApproved: 8 }
  },
  {
    id: 'dec-3',
    clientId: 'c3',
    clientName: 'Альфа Метал',
    priority: 'medium',
    title: 'Падіння конверсій на 35% в B2B прокатній групі',
    desc: 'Google Ads API сповістив про падіння тижневих конверсій, хоча бюджет витрачається стабільно. Потрібна перевірка лід-форм на сайті.',
    actionType: 'check_drop',
    source: 'ads_api',
    sourceName: 'Google Ads Live Tracer',
    status: 'pending',
    payload: {
      details: 'Рекомендуємо перевірити чи працює кнопка відправки на лендингу https://alpha-metal.com.ua/order та суміжні редіректи.'
    },
    createdAt: '2026-05-31T09:10:22Z',
    feedbackStats: { timesRejected: 0, timesApproved: 1 }
  },
  {
    id: 'dec-4',
    clientId: 'c1',
    clientName: 'Бета Косметика',
    priority: 'medium',
    title: 'Зупинити 2 неефективні ключові слова з високим CPA',
    desc: 'Агент виявив ключі "купити креми елітні" та "косметика львів ціна", які витратили 4,300 UAH без жодної конверсії за 14 днів.',
    actionType: 'pause_keywords',
    source: 'agent',
    sourceName: 'Campaign Doctor',
    status: 'pending',
    payload: {
      keywordsToPause: ['[купити креми елітні]', '"косметика львів ціна"'],
      details: 'Заощадження: ~8,600 UAH на місяць після павзи.'
    },
    createdAt: '2026-05-31T11:05:00Z',
    feedbackStats: { timesRejected: 2, timesApproved: 1, lastRejectedAt: '2026-05-20' }
  },
  {
    id: 'dec-5',
    clientId: 'c4',
    clientName: 'Гамма Хелс',
    priority: 'low',
    title: 'Оптимізувати tCPA ставки на вихідні дні',
    desc: 'Аналітик помітив, що у суботу та неділю CPA падає на 40%. Можна агресивніше підняти ставки на 15% у планувальнику.',
    actionType: 'optimize_bids',
    source: 'agent',
    sourceName: 'Metrics Analyst',
    status: 'pending',
    payload: {
      details: 'Зміна модифікатора часу (+15% на СБ-НД) підвищить обсяг конверсій при стабільному рівні рентабельності.'
    },
    createdAt: '2026-05-30T18:00:00Z',
    feedbackStats: { timesRejected: 1, timesApproved: 2 }
  }
];

export const INITIAL_AGENTS: AIAgent[] = [
  {
    id: 'agent_search_terms',
    name: 'Search Terms Agent',
    desc: 'Сканує пошукові запити у реальному часі, виявляє нецільовий трафік, формує списки мінус-слів за допомогою LLM аналізу контексту.',
    status: 'idle',
    statsLabel: 'Знайдено нецільових',
    statsValue: '14 слів цього тижня',
    lastRunTime: '31.05.2026, 16:15',
    resultSummary: 'Нещодавній аналіз виявив 14 сміттєвих фраз у клієнта "Бета Косметика", сформовано high-priority екшн.',
    capabilities: ['Авто-класифікація намірів', 'Виявлення бренд-канібалізації', 'Обчислення маржинальних втрат'],
    memoryStats: { totalDecisions: 23, approvalRate: 91, lastMemoryUpdate: '31.05.2026, 10:00' },
    learningStatus: 'active'
  },
  {
    id: 'agent_metrics_analyst',
    name: 'Metrics Analyst',
    desc: 'Агрегує денні метрики з API, порівнює з ретроспективним вектором, сповіщає про різкі падіння CTR, обвал конверсій або аномальний ріст CPC.',
    status: 'idle',
    statsLabel: 'Рівень аномалій',
    statsValue: '1 виявлено (Альфа)',
    lastRunTime: '31.05.2026, 15:30',
    resultSummary: 'Тренди стабільні, крім тимчасового падіння відгуку по B2B формах Alpha Metal.',
    capabilities: ['Аналіз часових рядів', 'Статистичний Z-score аномалій', 'Ковзне середнє для трендів'],
    memoryStats: { totalDecisions: 8, approvalRate: 75, lastMemoryUpdate: '28.05.2026, 08:00' },
    learningStatus: 'active'
  },
  {
    id: 'agent_budget_watcher',
    name: 'Budget Watcher',
    desc: 'Контролює добове вичерпання коштів, темпи "вигорання" бюджету, залишки на білінг-акаунтах Google і надсилає алерти для запобігання зупинці.',
    status: 'active',
    statsLabel: 'Клієнти под загрозою',
    statsValue: '1 критичний (Дельта)',
    lastRunTime: '31.05.2026, 16:35',
    resultSummary: 'Сформовано критичний алерт по Дельта Авто (залишилось менше ніж 0.5 днів роботи). Гамма і Альфа мають стабільні баланси.',
    capabilities: ['Екстраполяція вичерпання коштів', 'Планування бюджетних залишків', 'Моніторинг лімітів оплат'],
    memoryStats: { totalDecisions: 15, approvalRate: 100, lastMemoryUpdate: '31.05.2026, 14:00' },
    learningStatus: 'active'
  },
  {
    id: 'agent_campaign_doctor',
    name: 'Campaign Doctor',
    desc: 'Аналізує внутрішні фактори акаунта: налаштування таргетингу, показники якості (Quality Score), помилкові редіректи, деструктивні пересікання.',
    status: 'idle',
    statsLabel: 'Health Score середній',
    statsValue: '77.5%',
    lastRunTime: '31.05.2026, 12:00',
    resultSummary: 'Рекомендує зупинити 2 неефективні ключові слова у Бета Косметика. Потребує підтвердження.',
    capabilities: ['Аналіз Quality Score', 'Діагностика битих URL', 'Розрахунок перекриття аукціонів'],
    memoryStats: { totalDecisions: 5, approvalRate: 60, lastMemoryUpdate: '25.05.2026, 12:00' },
    learningStatus: 'insufficient_data'
  }
];

export const INITIAL_SCRIPTS: AutomationScript[] = [
  {
    id: 'scr-1',
    filename: 'search_terms.py',
    name: 'Вивантаження штормових термінів',
    status: 'active',
    lastRun: '31.05.2026, 16:00',
    nextRun: '31.05.2026, 20:00',
    resultMessage: 'Успішно імпортовано 342 нових унікальних термінів з Google Ads API.',
    codePreview: `import os\nfrom google.ads.googleads.client import GoogleAdsClient\n\ndef fetch_search_terms():\n    client = GoogleAdsClient.load_from_storage()\n    query = """\n        SELECT search_term_view.search_term,\n               metrics.impressions, metrics.clicks, metrics.cost_micros\n        FROM search_term_view\n        WHERE segments.date DURING LAST_7_DAYS\n    """\n    # API request pipeline logic`
  },
  {
    id: 'scr-2',
    filename: 'metrics.py',
    name: 'Парсинг денної аналітики',
    status: 'active',
    lastRun: '31.05.2026, 16:30',
    nextRun: '31.05.2026, 17:30',
    resultMessage: 'Завантажено метрики за 30.05. Розраховано CTR і СРС для всіх 4 клієнтів.',
    codePreview: `import pandas as pd\nimport requests\n\ndef update_sheets():\n    url = f"https://docs.google.com/spreadsheets/d/{SHEET_ID}/gviz/tq"\n    raw_data = requests.get(url)\n    # Pandas calculation logic for PPC dashboard`
  },
  {
    id: 'scr-3',
    filename: 'balances.py',
    name: 'Перевірка балансів та лімітів',
    status: 'warning',
    lastRun: '31.05.2026, 16:35',
    nextRun: '31.05.2026, 16:55',
    resultMessage: 'Клиєнт [Дельта Авто] критично близький до касового розриву! Баланс 1,600 UAH.',
    codePreview: `import telebot\n\ndef check_billing():\n    accounts = get_all_billing_info()\n    for acc in accounts:\n        if acc['days_left'] < 1:\n            send_telegram_alert(f"[ALERT] {acc['name']} runs dry!")`
  },
  {
    id: 'scr-4',
    filename: 'diagnose_campaign.py',
    name: 'Діагностика лід-форм і посилань',
    status: 'idle',
    lastRun: '31.05.2026, 08:00',
    nextRun: '01.06.2026, 08:00',
    resultMessage: 'Скрипт перевірив 12 активних URL-адрес. Всі повернули статус 200 OK.',
    codePreview: `import grequests\n\ndef link_checker():\n    urls = get_active_campaign_urls()\n    rs = (grequests.get(u) for u in urls)\n    responses = grequests.map(rs)\n    # Diagnostic HTTP pipeline`
  },
  {
    id: 'scr-5',
    filename: 'fetch_audit_data.py',
    name: 'Логування змін Google Ads SDK',
    status: 'failed',
    lastRun: '30.05.2026, 18:00',
    nextRun: 'Зупинено',
    resultMessage: 'OAuth Token Expired. Потрібно оновити токен доступу в налаштуваннях.',
    codePreview: `def refresh_oauth():\n    # Attempt refresh\n    raise RefreshError("Expired token or invalid secrets config")`
  }
];

export const INITIAL_BALANCES: BalanceRecord[] = [
  {
    id: 'b1',
    clientId: 'c1',
    clientName: 'Бета Косметика',
    limit: 45000,
    currentBalance: 6800,
    burnRate: 1450,
    daysLeft: 4.6,
    alertState: 'warning'
  },
  {
    id: 'b2',
    clientId: 'c2',
    clientName: 'Дельта Авто',
    limit: 120000,
    currentBalance: 1600,
    burnRate: 4500,
    daysLeft: 0.35,
    alertState: 'critical'
  },
  {
    id: 'b3',
    clientId: 'c3',
    clientName: 'Альфа Метал',
    limit: 85000,
    currentBalance: 42900,
    burnRate: 2100,
    daysLeft: 20.4,
    alertState: 'ok'
  },
  {
    id: 'b4',
    clientId: 'c4',
    clientName: 'Гамма Хелс',
    limit: 60000,
    currentBalance: 8800,
    burnRate: 1800,
    daysLeft: 4.8,
    alertState: 'warning'
  }
];

export const INITIAL_SEARCH_TERMS: SearchTermItem[] = [
  {
    id: 'st-1',
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
    id: 'st-2',
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
    id: 'st-3',
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
    id: 'st-4',
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
    id: 'st-5',
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
  }
];

export const INITIAL_DOCUMENTS: Document[] = [
  {
    id: 'doc-1',
    title: 'Звіти про мінус-слова: Стандарти та Промти',
    category: 'prompt',
    desc: 'Затверджений системний промт для аналізу пошукових запитів та розстановки релевантності за допомогою LLM.',
    content: `You are an expert Google Ads Specialist. Analyze the following table of search terms that triggered campaigns. Look specifically for terms with high cost-per-click and low conversions, or terms containing words representing research, educational, free, or DIY intent (e.g. "free", "pdf", "wiki", "diy", "how to"). Respond with a list of negative keywords that must be excluded, structured as a JSON array.`,
    lastModified: '30.05.2026, 12:00'
  },
  {
    id: 'doc-2',
    title: 'Регламент критичного реагування на злив бюджету (SOP)',
    category: 'sop',
    desc: 'Стандартна процедура дій, коли добові витрати перевищують спланований ліміт на 30%+',
    content: `1. Отримати сповіщення від Budget Watcher.\n2. Перевірити налаштування кампанії на наявність авто-застосування рекомендацій Google (Auto-applied recommendations).\n3. Переконатися, що у кампаніях Performance Max не підключено розширення URL-адрес без мінус-виключень.\n4. Якщо CPA зріс у 2+ рази, негайно знизити денний ліміт на 50% і передати акаунт на ручну діагностику лідогенерації.`,
    lastModified: '25.04.2026, 09:44'
  },
  {
    id: 'doc-3',
    title: 'Python скрипт швидкої синхронізації з Google Sheets',
    category: 'script',
    desc: 'Код для інтеграції, який можна скопіювати напряму в Google Apps Script або запустити на локальному сервері.',
    content: `#!/usr/bin/env python\nimport gspread\nfrom oauth2client.service_account import ServiceAccountCredentials\n\ndef upload_metrics_to_sheet(data):\n    scope = ["https://spreadsheets.google.com/feeds", "https://www.googleapis.com/auth/drive"]\n    creds = ServiceAccountCredentials.from_json_keyfile_name("service-account.json", scope)\n    client = gspread.authorize(creds)\n    sheet = client.open("Google Ads - PPC Dashboard").sheet1\n    sheet.update([data.columns.values.tolist()] + data.values.tolist())\n    print("Data synchronized.")`,
    lastModified: '12.05.2026, 17:15'
  }
];

export const INITIAL_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    timestamp: '31.05.2026, 16:35:12',
    level: 'critical',
    message: 'Дельта Авто: Балансу лишилось критично мало (1600 UAH). Відправлено екстрений пуш PPC-спеціалісту.',
    actor: 'AI Agent',
    category: 'automation'
  },
  {
    id: 'log-2',
    timestamp: '31.05.2026, 16:15:00',
    level: 'info',
    message: 'Скрипт search_terms.py завершив аналіз. Знайдено 4 нових запити низької релевантності.',
    actor: 'Script',
    category: 'automation'
  },
  {
    id: 'log-3',
    timestamp: '31.05.2026, 15:42:19',
    level: 'success',
    message: 'Оновлено Google Sheet "PPC Dashboard Data" - 4 акаунти, статус ACTIVE',
    actor: 'System',
    category: 'sync'
  },
  {
    id: 'log-4',
    timestamp: '31.05.2026, 14:10:02',
    level: 'warning',
    message: 'Користувач відклав рішення щодо tCPA ставки для Гамма Хелс на 24 години.',
    actor: 'User',
    category: 'action'
  },
  {
    id: 'log-5',
    timestamp: '30.05.2026, 22:15:33',
    level: 'critical',
    message: 'Скрипт fetch_audit_data.py припинив роботу через помилку: INVALID_CREDENTIALS. Необхідне ручне оновлення API або OAuth.',
    actor: 'Script',
    category: 'system'
  }
];

export const FOURTEEN_DAYS_SPEND_DATA = [
  { date: '18/05', spend: 8100, target: 8500, conversions: 24 },
  { date: '19/05', spend: 8400, target: 8500, conversions: 28 },
  { date: '20/05', spend: 7900, target: 8500, conversions: 22 },
  { date: '21/05', spend: 9300, target: 8500, conversions: 31 },
  { date: '22/05', spend: 8550, target: 8500, conversions: 29 },
  { date: '23/05', spend: 6100, target: 6000, conversions: 18 }, // Weekend dips
  { date: '24/05', spend: 5900, target: 6000, conversions: 19 },
  { date: '25/05', spend: 8200, target: 8500, conversions: 26 },
  { date: '26/05', spend: 8900, target: 8500, conversions: 30 },
  { date: '27/05', spend: 11200, target: 8500, conversions: 35 }, // Spillover/bid adjustments
  { date: '28/05', spend: 8700, target: 8500, conversions: 27 },
  { date: '29/05', spend: 9100, target: 8500, conversions: 28 },
  { date: '30/05', spend: 6800, target: 6000, conversions: 21 },
  { date: '31/05', spend: 6920, target: 6000, conversions: 22 }
];

export const INITIAL_CHAT_MESSAGES: AgentChatMessage[] = [
  {
    id: 'msg-1',
    role: 'agent',
    content: 'Привіт. Я готовий до роботи. Поточний фокус: Дельта Авто потребує термінового поповнення балансу. Є питання по будь-якому клієнту?',
    timestamp: '31.05.2026, 16:35',
    isLoading: false
  }
];

export const INITIAL_AD_ASSETS: AdAsset[] = [
  {
    id: 'asset-1',
    clientId: 'c1',
    campaignId: 'g1_1',
    adGroupName: 'Креми для обличчя',
    type: 'headline',
    text: 'Корейська косметика в Україні',
    performanceLabel: 'BEST',
    impressions: 8900,
    clicks: 720,
    pinned: 1,
    aiScore: 95,
    aiSuggestion: null,
    status: 'active'
  },
  {
    id: 'asset-2',
    clientId: 'c1',
    campaignId: 'g1_1',
    adGroupName: 'Креми для обличчя',
    type: 'headline',
    text: 'Купити крем для обличчя',
    performanceLabel: 'GOOD',
    impressions: 4200,
    clicks: 340,
    pinned: null,
    aiScore: 78,
    aiSuggestion: null,
    status: 'active'
  },
  {
    id: 'asset-3',
    clientId: 'c1',
    campaignId: 'g1_1',
    adGroupName: 'Креми для обличчя',
    type: 'headline',
    text: 'Косметика',
    performanceLabel: 'LOW',
    impressions: 1200,
    clicks: 50,
    pinned: null,
    aiScore: 22,
    aiSuggestion: "Занадто загальний. Додайте УТП або гео: 'Корейська косметика Київ — доставка за день'",
    status: 'active'
  },
  {
    id: 'asset-4',
    clientId: 'c1',
    campaignId: 'g1_1',
    adGroupName: 'Креми для обличчя',
    type: 'headline',
    text: 'Офіційний магазин',
    performanceLabel: 'UNRATED',
    impressions: 200,
    clicks: 15,
    pinned: null,
    aiScore: 45,
    aiSuggestion: "Не містить ключового слова. Уточніть що саме офіційний",
    status: 'active'
  },
  {
    id: 'asset-5',
    clientId: 'c1',
    campaignId: 'g1_1',
    adGroupName: 'Креми для обличчя',
    type: 'headline',
    text: 'Знижки до 30% на догляд',
    performanceLabel: 'GOOD',
    impressions: 3100,
    clicks: 250,
    pinned: null,
    aiScore: 81,
    aiSuggestion: null,
    status: 'active'
  },
  {
    id: 'asset-6',
    clientId: 'c1',
    campaignId: 'g1_1',
    adGroupName: 'Креми для обличчя',
    type: 'headline',
    text: 'Професійний догляд за шкірою',
    performanceLabel: 'BEST',
    impressions: 6500,
    clicks: 512,
    pinned: 2,
    aiScore: 92,
    aiSuggestion: null,
    status: 'active'
  },
  {
    id: 'asset-7',
    clientId: 'c1',
    campaignId: 'g1_1',
    adGroupName: 'Креми для обличчя',
    type: 'headline',
    text: 'Замовити натуральні креми',
    performanceLabel: 'GOOD',
    impressions: 1800,
    clicks: 120,
    pinned: null,
    aiScore: 74,
    aiSuggestion: null,
    status: 'active'
  },
  {
    id: 'asset-8',
    clientId: 'c1',
    campaignId: 'g1_1',
    adGroupName: 'Креми для обличчя',
    type: 'headline',
    text: 'Дешевий крем',
    performanceLabel: 'LOW',
    impressions: 950,
    clicks: 38,
    pinned: null,
    aiScore: 31,
    aiSuggestion: "Слово 'дешевий' знижує цінність бренду косметики. Використовуйте 'Доступна якість' або 'Привабливі ціни'.",
    status: 'active'
  },
  {
    id: 'asset-9',
    clientId: 'c1',
    campaignId: 'g1_1',
    adGroupName: 'Креми для обличчя',
    type: 'headline',
    text: 'Оригінал Корея оптом й уроздріб',
    performanceLabel: 'GOOD',
    impressions: 2400,
    clicks: 198,
    pinned: 3,
    aiScore: 86,
    aiSuggestion: null,
    status: 'active'
  },
  {
    id: 'asset-10',
    clientId: 'c1',
    campaignId: 'g1_1',
    adGroupName: 'Креми для обличчя',
    type: 'headline',
    text: 'Купити косметику недорого',
    performanceLabel: 'LOW',
    impressions: 1100,
    clicks: 44,
    pinned: null,
    aiScore: 38,
    aiSuggestion: "Замініть 'недорого' на конкретну вигоду, наприклад 'Знижка -10% на перше замовлення'",
    status: 'active'
  },
  // Descriptions (four)
  {
    id: 'asset-11',
    clientId: 'c1',
    campaignId: 'g1_1',
    adGroupName: 'Креми для обличчя',
    type: 'description',
    text: "Офіційний дистриб'ютор корейських брендів. Оригінальна косметика, сертифікати якості.",
    performanceLabel: 'BEST',
    impressions: 15400,
    clicks: 1250,
    pinned: 1,
    aiScore: 94,
    aiSuggestion: null,
    status: 'active'
  },
  {
    id: 'asset-12',
    clientId: 'c1',
    campaignId: 'g1_1',
    adGroupName: 'Креми для обличчя',
    type: 'description',
    text: "Широкий вибір засобів для догляду за обличчям та тілом. Швидка доставка по всій Україні.",
    performanceLabel: 'GOOD',
    impressions: 9800,
    clicks: 740,
    pinned: null,
    aiScore: 82,
    aiSuggestion: null,
    status: 'active'
  },
  {
    id: 'asset-13',
    clientId: 'c1',
    campaignId: 'g1_1',
    adGroupName: 'Креми для обличчя',
    type: 'description',
    text: "Купити корейські креми недорого тут в нашому магазині відмінної якості за низькими цінами.",
    performanceLabel: 'LOW',
    impressions: 1400,
    clicks: 65,
    pinned: null,
    aiScore: 25,
    aiSuggestion: "У заклику до дії бракує унікальності. Спробуйте: 'Замовляйте сертифіковану косметику зі знижкою 10% на першу покупку'",
    status: 'active'
  },
  {
    id: 'asset-14',
    clientId: 'c1',
    campaignId: 'g1_1',
    adGroupName: 'Креми для обличчя',
    type: 'description',
    text: "Консультація косметолога безкоштовно. Підберемо індивідуальну програму догляду для вашої шкіри.",
    performanceLabel: 'GOOD',
    impressions: 11200,
    clicks: 890,
    pinned: 2,
    aiScore: 89,
    aiSuggestion: null,
    status: 'active'
  },
  {
    id: 'asset-sitelink-1',
    clientId: 'c1',
    campaignId: 'g1_1',
    adGroupName: 'Креми для обличчя',
    type: 'sitelink',
    text: "Контакти та Карта – Про магазин Бета Косметика",
    performanceLabel: 'BEST',
    impressions: 4500,
    clicks: 390,
    pinned: null,
    aiScore: 90,
    aiSuggestion: null,
    status: 'active'
  },
  {
    id: 'asset-callout-1',
    clientId: 'c1',
    campaignId: 'g1_1',
    adGroupName: 'Креми для обличчя',
    type: 'callout',
    text: "100% Оригінальна косметика",
    performanceLabel: 'BEST',
    impressions: 12000,
    clicks: 920,
    pinned: null,
    aiScore: 92,
    aiSuggestion: null,
    status: 'active'
  },
  {
    id: 'asset-callout-2',
    clientId: 'c1',
    campaignId: 'g1_1',
    adGroupName: 'Креми для обличчя',
    type: 'callout',
    text: "Доставка за 24 години",
    performanceLabel: 'GOOD',
    impressions: 6500,
    clicks: 440,
    pinned: null,
    aiScore: 85,
    aiSuggestion: null,
    status: 'active'
  },
  {
    id: 'asset-snippet-1',
    clientId: 'c1',
    campaignId: 'g1_1',
    adGroupName: 'Креми для обличчя',
    type: 'structured_snippet',
    text: "Бренди: Laneige, Cosrx, Dr.Jart+, Innisfree, Some By Mi",
    performanceLabel: 'GOOD',
    impressions: 5400,
    clicks: 310,
    pinned: null,
    aiScore: 88,
    aiSuggestion: null,
    status: 'active'
  },
  {
    id: 'asset-call-1',
    clientId: 'c1',
    campaignId: 'g1_1',
    adGroupName: 'Креми для обличчя',
    type: 'call',
    text: "+38 (067) 123-4567",
    performanceLabel: 'BEST',
    impressions: 2900,
    clicks: 180,
    pinned: null,
    aiScore: 95,
    aiSuggestion: null,
    status: 'active'
  },
  {
    id: 'asset-image-1',
    clientId: 'c1',
    campaignId: 'g1_1',
    adGroupName: 'Креми для обличчя',
    type: 'image',
    text: "https://images.unsplash.com/photo-1608248597481-496100c80836?w=200",
    performanceLabel: 'BEST',
    impressions: 15100,
    clicks: 1420,
    pinned: null,
    aiScore: 96,
    aiSuggestion: null,
    status: 'active'
  },
  {
    id: 'asset-promo-1',
    clientId: 'c1',
    campaignId: 'g1_1',
    adGroupName: 'Креми для обличчя',
    type: 'promotion',
    text: "Знижка 15% до Дня Матері на всі набори",
    performanceLabel: 'GOOD',
    impressions: 4800,
    clicks: 530,
    pinned: null,
    aiScore: 87,
    aiSuggestion: null,
    status: 'active'
  },
  {
    id: 'asset-price-1',
    clientId: 'c1',
    campaignId: 'g1_1',
    adGroupName: 'Креми для обличчя',
    type: 'price',
    text: "Зволожуючий крем – від 450 UAH; Антивіковий крем – від 750 UAH",
    performanceLabel: 'LOW',
    impressions: 3200,
    clicks: 110,
    pinned: null,
    aiScore: 40,
    aiSuggestion: "Ціни дещо завищені порівняно з конкурентами в регіоні Київ. Можна додати інфо про безкоштовну доставку при купівлі від 1000 грн.",
    status: 'active'
  },
  {
    id: 'asset-lead-1',
    clientId: 'c1',
    campaignId: 'g1_1',
    adGroupName: 'Креми для обличчя',
    type: 'lead_form',
    text: "Запишіться на безкоштовний аудит типу шкіри",
    performanceLabel: 'UNRATED',
    impressions: 350,
    clicks: 22,
    pinned: null,
    aiScore: 78,
    aiSuggestion: "Підвищіть помітність лід-форми: розіграйте міні-набір за проходження тесту.",
    status: 'active'
  }
];

export const INITIAL_AD_GROUPS: AdGroup[] = [
  {
    id: 'ag-1',
    clientId: 'c1',
    campaignId: 'g1_1',
    name: 'Креми для обличчя',
    status: 'active',
    keywords: ['[корейські креми]', '"крем для обличчя купити"', 'зволожуючий крем'],
    negativeKeywords: ['безкоштовно', 'рецепт', 'своїми руками'],
    assets: [], // Done in code by filtering assets list
    healthScore: 78
  },
  {
    id: 'ag-2',
    clientId: 'c1',
    campaignId: 'g1_1',
    name: 'Сироватки та догляд',
    status: 'active',
    keywords: ['"сироватка з гіалуроновою кислотою"', '[купити сироватку київ]', 'догляд за шкірою'],
    negativeKeywords: ['дешево', 'форум', 'скачати'],
    assets: [],
    healthScore: 85
  }
];

export const INITIAL_CAMPAIGN_DRAFTS: CampaignDraft[] = [
  {
    id: 'draft-1',
    clientId: 'c2',
    name: 'Delta_UA_Search_Diagnostics_New',
    type: 'search',
    dailyBudget: 1500,
    targetCpa: 550,
    biddingStrategy: 'TARGET_CPA',
    geoTargets: ['Київ', 'Харків', 'Дніпро'],
    adGroups: [{
      name: 'Діагностика двигуна',
      keywords: ['[діагностика двигуна київ]', '"діагностика авто"'],
      negatives: ['безкоштовно', 'своїми руками'],
      headlines: ['Діагностика двигуна Київ', 'Перевірка авто за 1 годину', 'Професійні автомайстри'],
      descriptions: ['Повна комп\'ютерна діагностика. Досвідчені майстри.', 'Сучасне обладнання для надійного сканування вашого авто. Телефонуйте пишіть!']
    }],
    status: 'draft',
    createdAt: '2026-05-31T10:00:00Z',
    notes: 'Нова кампанія замість Display Remarketing'
  }
];

export const INITIAL_STAGED_CHANGES: StagedChange[] = [
  {
    id: 'stg-1',
    clientId: 'c1',
    clientName: 'Бета Косметика',
    type: 'add_negatives',
    description: 'Додати 14 мінус-слів в брендову кампанію',
    payload: { negatives: ['безкоштовно', 'рецепт', 'завантажити'], campaignId: 'g1_1' },
    source: 'agent_decision',
    decisionId: 'dec-1',
    stagedAt: '2026-05-31T12:30:00Z',
    status: 'pending'
  },
  {
    id: 'stg-2',
    clientId: 'c1',
    clientName: 'Бета Косметика',
    type: 'pause_asset',
    description: "Призупинити заголовок 'Косметика' (LOW, 18 днів)",
    payload: { assetId: 'a-3', text: 'Косметика' },
    source: 'manual',
    stagedAt: '2026-05-31T14:00:00Z',
    status: 'pending'
  },
  {
    id: 'stg-3',
    clientId: 'c2',
    clientName: 'Дельта Авто',
    type: 'pause_keyword',
    description: "Призупинити ключ 'безкоштовна діагностика авто' (0 конверсій, 2100 UAH)",
    payload: { keywordId: 'kw-5', text: 'безкоштовна діагностика авто' },
    source: 'agent_decision',
    decisionId: 'dec-4',
    stagedAt: '2026-05-31T14:10:00Z',
    status: 'pending'
  }
];

export function generateMockAnalysis(campaign: Campaign, client: Client): AgentAnalysisResult {
  const isCpaTooHigh = campaign.cpa > 600 || (campaign.cpa > 0 && campaign.cpa > client.cpc * 15);
  const isCtrTooLow = campaign.ctr < 3.5;
  const currency = client.currency || 'UAH';

  const changes: AnalysisChange[] = [];

  if (isCpaTooHigh) {
    changes.push({
      id: `an-${campaign.id}-1`,
      priority: 'high',
      problem: `Висока вартість конверсії (CPA: ${campaign.cpa} ${currency}) в порівнянні з цільовою.`,
      solution: `Знизити tCPA ліміт або переключити стратегію на максимізацію цінності з обмеженням рентабельності.`,
      impact: 'Зменшення CPA на ~22% та збереження бюджету',
      reasoning: `Кампанія "${campaign.name}" витрачає значну частину бюджету на дорогі кліки, які не приносять конверсій відповідно до очікуваного ROI. Регулювання стратегії призначення ставок дозволить стабілізувати ціну за дію.`,
      action_type: 'change_bid_strategy',
      payload: { campaignId: campaign.id, newStrategy: 'TARGET_CPA', targetCpa: Math.round(campaign.cpa * 0.8) },
      selected: true
    });
  } else {
    changes.push({
      id: `an-${campaign.id}-1`,
      priority: 'medium',
      problem: `Невикористаний потенціал бюджету при низькому CPA (${campaign.cpa} ${currency}).`,
      solution: `Збільшити добовий бюджет на 30% для масштабування успішних конверсій.`,
      impact: 'Збільшення кількості конверсій на ~15-20%',
      reasoning: `Кампанія демонструє чудові показники ціни за конверсію. Проте вона обмежена поточним бюджетом і втрачає частину показів у пошуковій мережі через обмеження фінансування.`,
      action_type: 'update_budget',
      payload: { campaignId: campaign.id, newBudget: Math.round(campaign.budget * 1.3) },
      selected: true
    });
  }

  if (isCtrTooLow) {
    changes.push({
      id: `an-${campaign.id}-2`,
      priority: 'high',
      problem: `Низька клікабельність оголошень (CTR: ${campaign.ctr}%).`,
      solution: `Призупинити неефективні заголовки з низьким показником та додати 3 нові варіанти з фокусом на УТП.`,
      impact: 'Підвищення CTR на ~1.5% та зниження середнього CPC',
      reasoning: `Поточні активні оголошення мають низьку релевантність для користувачів. Google знижує рейтинг оголошення через низький CTR, що призводить до підвищення вартості кліку.`,
      action_type: 'pause_asset',
      payload: { campaignId: campaign.id, assetId: 'asset-low-ctr-1', text: 'Купити дешево у нас' },
      selected: true
    });
  } else {
    changes.push({
      id: `an-${campaign.id}-2`,
      priority: 'low',
      problem: `CTR має хороші показники (${campaign.ctr}%), проте є можливість оптимізувати розклад показів.`,
      solution: `Скоригувати розклад показів оголошень: знизити ставки на -15% у нічні години (00:00 - 06:00).`,
      impact: 'Збереження ~5% неефективних витрат',
      reasoning: `Статистика показує, що хоча користувачі активно клікають вночі, конверсійність у цей час падає на 65%. Зменшення ставок у нічний час вивільнить бюджет для більш конверсійного періоду дня.`,
      action_type: 'update_ad_schedule',
      payload: { campaignId: campaign.id, schedule: 'reduce_night_bids_15' },
      selected: false
    });
  }

  // Always add one more medium or low action to have a diverse cards selection
  changes.push({
    id: `an-${campaign.id}-3`,
    priority: 'medium',
    problem: `Виявлено нецільовий трафік за пошуковими запитами типу "безкоштовно", "форум", "відгуки".`,
    solution: `Додати 5 нових мінус-слів на рівні кампанії.`,
    impact: 'Очищення трафіку та підвищення коефіцієнта конверсії',
    reasoning: `За останні 14 днів зафіксовано 32 кліки за запитами пошуку з інформаційним інтентом без наміру покупки. Додавання мінус-слів запобіжить цим нецільовим витратам.`,
    action_type: 'add_negatives',
    payload: { campaignId: campaign.id, negatives: ['безкоштовно', 'форум', 'відгуки', 'бв', 'секонд хенд'] },
    selected: true
  });

  changes.push({
    id: `an-${campaign.id}-4`,
    priority: 'low',
    problem: `Рекомендація щодо тестування нових розширень структурованих описових фрагментів (Snippets).`,
    solution: `Протестувати додавання списку брендів або послуг у розширеннях.`,
    impact: 'Розширення площі оголошення в пошуковій видачі на 10%',
    reasoning: `Додавання структурованих фрагментів підвищує візуальний об'єм оголошення та дає користувачеві більше інформації ще до кліку, що покращує показник якості.`,
    action_type: 'test_recommendation',
    payload: { campaignId: campaign.id, snippetText: 'Послуги, Бренди' },
    selected: false
  });

  const campaign_health = campaign.status === 'paused' ? 'stable' : isCpaTooHigh ? 'critical' : isCtrTooLow ? 'warning' : 'good';

  const healthLabels = {
    good: 'Відмінний стан',
    warning: 'Потребує оптимізації',
    critical: 'Критичні показники',
    stable: 'Кампанія на паузі'
  };

  return {
    id: `an-res-${campaign.id}-${Date.now()}`,
    clientId: campaign.clientId,
    campaignId: campaign.id,
    campaignName: campaign.name,
    analyzedAt: new Date().toISOString(),
    summary: `Кампанія "${campaign.name}" у стані "${healthLabels[campaign_health]}". Виявлено ${changes.length} зон оптимізації, з яких ${changes.filter(c => c.priority === 'high').length} мають критичний пріоритет.`,
    campaign_health,
    changes,
    agent_notes: `Рекомендовано регулярно перевіряти пошукові терміни кожні 3 дні. Коефіцієнт конверсії стабільний, проте є тренд до подорожчання аукціону.`
  };
}
