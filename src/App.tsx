import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

// Pages import
import CommandCenter from './pages/CommandCenter';
import ClientsList from './pages/ClientsList';
import ClientDetail from './pages/ClientDetail';
import Balances from './pages/Balances';
import Semantics from './pages/Semantics';
import AgentRecommendations from './pages/AgentRecommendations';
import Automations from './pages/Automations';
import ManualTrigger from './pages/ManualTrigger';
import DocLibrary from './pages/DocLibrary';
import AuditLogs from './pages/AuditLogs';
import AgentChatWidget from './components/AgentChatWidget';
import { MessageSquare } from 'lucide-react';
import CampaignBuilder from './pages/CampaignBuilder';
import AdAssets from './pages/AdAssets';

// Mock datasets
import {
  INITIAL_CLIENTS,
  INITIAL_CAMPAIGNS,
  INITIAL_DECISIONS,
  INITIAL_AGENTS,
  INITIAL_SCRIPTS,
  INITIAL_BALANCES,
  INITIAL_SEARCH_TERMS,
  INITIAL_DOCUMENTS,
  INITIAL_LOGS,
  INITIAL_CHAT_MESSAGES,
  INITIAL_AD_ASSETS,
  INITIAL_AD_GROUPS,
  INITIAL_CAMPAIGN_DRAFTS,
  FOURTEEN_DAYS_SPEND_DATA,
  INITIAL_STAGED_CHANGES
} from './mockData';

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
  StagedChange
} from './types';

export default function App() {
  
  // Persistent States
  const [currentTab, setCurrentTab] = useState<string>('command-center');
  const [selectedClientId, setSelectedClientId] = useState<string>('c1');
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  // Searching
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Core Data States
  const [clients, setClients] = useState<Client[]>(INITIAL_CLIENTS);
  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS);
  const [decisions, setDecisions] = useState<Decision[]>(INITIAL_DECISIONS);
  const [agents, setAgents] = useState<AIAgent[]>(INITIAL_AGENTS);
  const [scripts, setScripts] = useState<AutomationScript[]>(INITIAL_SCRIPTS);
  const [balances, setBalances] = useState<BalanceRecord[]>(INITIAL_BALANCES);
  const [searchTerms, setSearchTerms] = useState<SearchTermItem[]>(INITIAL_SEARCH_TERMS);
  const [documents, setDocuments] = useState<Document[]>(INITIAL_DOCUMENTS);
  const [logs, setLogs] = useState<AuditLog[]>(INITIAL_LOGS);

  // New States for AI integration features
  const [chatMessages, setChatMessages] = useState<AgentChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [adAssets, setAdAssets] = useState<AdAsset[]>(INITIAL_AD_ASSETS);
  const [adGroups, setAdGroups] = useState<AdGroup[]>(INITIAL_AD_GROUPS);
  const [campaignDrafts, setCampaignDrafts] = useState<CampaignDraft[]>(INITIAL_CAMPAIGN_DRAFTS);

  // Sync / Audit states
  const [isAuditing, setIsAuditing] = useState(false);
  const [syncTime, setSyncTime] = useState('16:35');
  const [isRunningScriptId, setIsRunningScriptId] = useState<string | null>(null);

  // Dynamic log adder helper
  const handleAddNewLog = (message: string, level: 'info' | 'success' | 'warning' | 'critical' = 'info') => {
    const timestamp = new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const logItem: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: `31.05.2026, ${timestamp}`,
      level,
      message,
      actor: 'User',
      category: 'action'
    };
    setLogs(prev => [logItem, ...prev]);
  };

  // Decision Approvers
  const handleApproveDecision = (id: string) => {
    const matchedDecision = decisions.find(d => d.id === id);
    if (!matchedDecision) return;

    // Approve locally
    setDecisions(prev => prev.map(d => {
      if (d.id === id) {
        const stats = d.feedbackStats || { timesRejected: 0, timesApproved: 0 };
        return { 
          ...d, 
          status: 'approved',
          feedbackStats: {
            ...stats,
            timesApproved: stats.timesApproved + 1
          }
        };
      }
      return d;
    }));

    // Improve health score dynamically
    setClients(prev => prev.map(c => {
      if (c.id === matchedDecision.clientId) {
        const nextScore = Math.min(100, c.healthScore + 8);
        return {
          ...c,
          healthScore: nextScore,
          lastAction: matchedDecision.title,
          status: nextScore > 80 ? 'active' : c.status
        };
      }
      return c;
    }));

    // If it was negatives, we simulate appending to notes
    if (matchedDecision.actionType === 'add_negatives' && matchedDecision.payload.negatives) {
      setSearchTerms(prev => prev.map(t => 
        t.clientId === matchedDecision.clientId && matchedDecision.payload.negatives?.includes(t.term)
          ? { ...t, status: 'added' } 
          : t
      ));
    }

    // Add log
    handleAddNewLog(
      `Рішення затверджено: "${matchedDecision.title}" для клієнта "${matchedDecision.clientName}" успішно впроваджено.`,
      'success'
    );
  };

  const handleRejectDecision = (id: string, note?: string) => {
    const matchedDecision = decisions.find(d => d.id === id);
    if (!matchedDecision) return;

    setDecisions(prev => prev.map(d => {
      if (d.id === id) {
        const stats = d.feedbackStats || { timesRejected: 0, timesApproved: 0 };
        return { 
          ...d, 
          status: 'rejected',
          rejectionNote: note,
          feedbackStats: {
            ...stats,
            timesRejected: stats.timesRejected + 1,
            lastRejectedAt: new Date().toLocaleDateString('uk-UA')
          }
        };
      }
      return d;
    }));
    handleAddNewLog(
      `Рішення відхилено: "${matchedDecision.title}" відмінено спеціалістом.${note ? ` Причина: ${note}` : ''}`, 
      'warning'
    );
  };

  const handlePostponeDecision = (id: string) => {
    const matchedDecision = decisions.find(d => d.id === id);
    if (!matchedDecision) return;

    setDecisions(prev => prev.map(d => d.id === id ? { ...d, status: 'deferred' } : d));
    handleAddNewLog(`Рішення відкладено: "${matchedDecision.title}" перенесено на наступний цикл аудиту.`, 'info');
  };

  // Billing refills
  const handleRefillBalance = (clientId: string, amount: number) => {
    // Increment balance record
    setBalances(prev => prev.map(b => {
      if (b.clientId === clientId) {
        const nextBal = b.currentBalance + amount;
        return {
          ...b,
          currentBalance: nextBal,
          daysLeft: nextBal / (b.burnRate || 1),
          alertState: 'ok'
        };
      }
      return b;
    }));

    // Update risk on client
    setClients(prev => prev.map(c => {
      if (c.id === clientId) {
        return {
          ...c,
          riskLevel: 'low',
          status: 'active',
          lastAction: `Поповнено баланс гаманця на +${amount.toLocaleString()} UAH`
        };
      }
      return c;
    }));

    // Clear refill trigger if matched in pending decision queue
    setDecisions(prev => prev.map(d => 
      d.clientId === clientId && d.actionType === 'refill_balance' 
        ? { ...d, status: 'approved' } 
        : d
    ));
  };

  // Add negative word directly from semantics page
  const handleAddNegativeKeyword = (clientId: string, word: string) => {
    // Simulate updating active word states
    // Add logic logging
    handleAddNewLog(`Семантика: Слово "${word}" додано до списку виключень в акаунті.`, 'success');
  };

  const handleDismissSearchTerm = (id: string) => {
    setSearchTerms(prev => prev.map(t => t.id === id ? { ...t, status: 'dismissed' } : t));
  };

  // Chat messaging
  const handleSendChatMessage = (text: string) => {
    // Add User message
    const userMsg: AgentChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })
    };
    
    setChatMessages(prev => [...prev, userMsg]);
    
    // Auto simulate Agent response after 1 second
    const agentMsgId = `msg-${Date.now() + 1}`;
    const botLoadingMsg: AgentChatMessage = {
      id: agentMsgId,
      role: 'agent',
      content: '',
      timestamp: new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' }),
      isLoading: true
    };
    
    setTimeout(() => {
      setChatMessages(prev => [...prev, botLoadingMsg]);
    }, 400);

    setTimeout(() => {
      setChatMessages(prev => prev.map(m => m.id === agentMsgId ? {
        ...m,
        content: `Я опрацював ваш запит у контексті кабінету реклами "${clients.find(c => c.id === selectedClientId)?.name || 'всіх акаунтів'}". Платформа готова завантажити релевантні пошукові запити, оптимізувати ключі чи згенерувати рекламні оголошення для вас! Відомо, що tCPA тримається в рамках норми.`,
        isLoading: false
      } : m));
    }, 1500);
  };

  // Ad Asset Handlers
  const handleAddAssets = (newAssets: Omit<AdAsset, 'id'>[]) => {
    const created = newAssets.map(asset => ({
      ...asset,
      id: `asset-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }));
    setAdAssets(prev => [...prev, ...created]);
    handleAddNewLog(`Активи реклами: Додано ${newAssets.length} нових рекламних активів (заголовків/описів) для автоматичного тестування RSA.`, 'success');
  };

  const handleUpdateAsset = (id: string, update: Partial<AdAsset>) => {
    setAdAssets(prev => prev.map(a => a.id === id ? { ...a, ...update } : a));
    const asset = adAssets.find(a => a.id === id);
    if (asset) {
      handleAddNewLog(`Активи реклами: Оновлено статус для "${asset.text}" на "${update.status}"`, 'info');
    }
  };

  // Campaign Builder Handlers
  const handleSaveCampaignDraft = (draft: CampaignDraft) => {
    setCampaignDrafts(prev => [...prev, draft]);
    handleAddNewLog(`Кампанії з Агентом: Збережено нову чорнетку кампанії "${draft.name}"`, 'info');
  };

  const handleSubmitCampaignForApproval = (draft: CampaignDraft) => {
    const newDecisionId = `dec-builder-${Date.now()}`;
    const newDecision: Decision = {
      id: newDecisionId,
      clientId: draft.clientId,
      clientName: clients.find(c => c.id === draft.clientId)?.name || 'Клієнт',
      title: `Затвердити розгортання структури кампанії "${draft.name}" через API`,
      desc: `Рекомендовано AI-агентом на базі заповненої форми: щоденний бюджет - ${draft.dailyBudget} UAH, tCPA - ${draft.targetCpa || 350} UAH. Створено з 2 групами оголошень та підготовленими RSA креативами.`,
      priority: 'high',
      status: 'pending',
      actionType: 'campaign_create',
      source: 'agent',
      sourceName: 'Smart Campaign Builder',
      payload: { details: `Щоденний бюджет - ${draft.dailyBudget} UAH, Стратегія ставок - ${draft.biddingStrategy}` },
      createdAt: new Date().toLocaleDateString('uk-UA'),
      feedbackStats: { timesRejected: 0, timesApproved: 0 }
    };
    
    setDecisions(prev => [newDecision, ...prev]);
    setCampaignDrafts(prev => [...prev, { ...draft, status: 'sent_to_ads' }]);
    handleAddNewLog(`Кампанії з Агентом: Кампанію "${draft.name}" надіслано на узгодження директору. Створено нову AI рекомендацію.`, 'success');
  };

  // Manual code triggers
  const handleTriggerScript = (id: string) => {
    setIsRunningScriptId(id);
    setScripts(prev => prev.map(s => s.id === id ? { ...s, status: 'active' } : s));
    
    setTimeout(() => {
      setIsRunningScriptId(null);
      // Change status to active if failed
      setScripts(prev => prev.map(s => {
        if (s.id === id) {
          return {
            ...s,
            status: 'active',
            lastRun: new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' }) + ' (Manual)',
            resultMessage: 'Успішний ручний запуск. Всі вхідні пакети API верифіковані.'
          };
        }
        return s;
      }));
    }, 2000);
  };

  // Full check trigger in header (Швидка дія: "Запустити перевірку")
  const handleRunFullAudit = () => {
    setIsAuditing(true);
    handleAddNewLog('Глобальний аудит: Ініційовано термінове сканування всіх 4 акаунтів Google Ads.', 'info');

    // Simulate active scanning
    setAgents(prev => prev.map(a => ({ ...a, status: 'running' })));
    setScripts(prev => prev.map(s => s.status === 'idle' ? { ...s, status: 'active' } : s));

    setTimeout(() => {
      setIsAuditing(false);
      
      const currentTime = new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
      setSyncTime(currentTime);

      // Reset agents status & refresh last run
      setAgents(prev => prev.map(a => ({ 
        ...a, 
        status: 'active', 
        lastRunTime: `31.05.2026, ${currentTime}` 
      })));

      handleAddNewLog(`Глобальний аудит: Сканування завершено успішно о ${currentTime}. 0 нових аномалій виявлено.`, 'success');
    }, 3000);
  };

  // Helper redirect triggers
  const handleSelectClient = (id: string) => {
    setSelectedClientId(id);
    setCurrentTab('client-detail');
  };

  // Page Routing
  const renderActiveTab = () => {
    switch (currentTab) {
      case 'command-center':
        return (
          <CommandCenter
            clients={clients}
            decisions={decisions}
            agents={agents}
            scripts={scripts}
            onApproveDecision={handleApproveDecision}
            onRejectDecision={handleRejectDecision}
            onPostponeDecision={handlePostponeDecision}
            onSelectClient={handleSelectClient}
            spendHistory={FOURTEEN_DAYS_SPEND_DATA}
            currentTheme={currentTheme}
            searchQuery={searchQuery}
          />
        );
      case 'clients':
        return (
          <ClientsList
            clients={clients}
            onSelectClient={handleSelectClient}
            currentTheme={currentTheme}
            searchQuery={searchQuery}
          />
        );
      case 'client-detail':
        return (
          <ClientDetail
            clients={clients}
            campaigns={campaigns}
            decisions={decisions}
            agents={agents}
            logs={logs}
            selectedClientId={selectedClientId}
            onSelectClientId={setSelectedClientId}
            onAddDecisionLog={handleAddNewLog}
            currentTheme={currentTheme}
            setCurrentTab={setCurrentTab}
          />
        );
      case 'balances':
        return (
          <Balances
            balances={balances}
            clients={clients}
            onRefillBalance={handleRefillBalance}
            currentTheme={currentTheme}
            onAddDecisionLog={handleAddNewLog}
          />
        );
      case 'semantics':
        return (
          <Semantics
            searchTerms={searchTerms}
            clients={clients}
            onAddNegativeKeyword={handleAddNegativeKeyword}
            onDismissSearchTerm={handleDismissSearchTerm}
            currentTheme={currentTheme}
            onAddDecisionLog={handleAddNewLog}
            searchQuery={searchQuery}
          />
        );
      case 'recommendations':
        return (
          <AgentRecommendations
            agents={agents}
            decisions={decisions}
            onApproveDecision={handleApproveDecision}
            onRejectDecision={handleRejectDecision}
            currentTheme={currentTheme}
            onAddDecisionLog={handleAddNewLog}
          />
        );
      case 'automations':
        return (
          <Automations
            scripts={scripts}
            onTriggerScript={handleTriggerScript}
            isRunningScriptId={isRunningScriptId}
            currentTheme={currentTheme}
            onAddDecisionLog={handleAddNewLog}
          />
        );
      case 'manual-init':
        return (
          <ManualTrigger
            scripts={scripts}
            onTriggerScript={handleTriggerScript}
            isRunningScriptId={isRunningScriptId}
            currentTheme={currentTheme}
            onAddDecisionLog={handleAddNewLog}
          />
        );
      case 'documents':
        return (
          <DocLibrary
            documents={documents}
            currentTheme={currentTheme}
            searchQuery={searchQuery}
          />
        );
      case 'audit-trail':
        return (
          <AuditLogs
            logs={logs}
            currentTheme={currentTheme}
            searchQuery={searchQuery}
          />
        );

      case 'campaign-builder':
        return (
          <CampaignBuilder
            clients={clients}
            currentTheme={currentTheme}
            onSaveDraft={handleSaveCampaignDraft}
            onSubmitForApproval={handleSubmitCampaignForApproval}
          />
        );
      case 'ad-assets':
        return (
          <AdAssets
            clients={clients}
            campaigns={campaigns}
            adAssets={adAssets}
            adGroups={adGroups}
            currentTheme={currentTheme}
            onAddAssets={handleAddAssets}
            onUpdateAsset={handleUpdateAsset}
            initialClientId={selectedClientId}
          />
        );
      default:
        return <div className="text-center py-12 text-slate-400">Сторінка в процесі розробки...</div>;
    }
  };

  return (
    <div className={`min-h-screen flex text-sm overflow-hidden select-none transition-colors duration-150 theme-${currentTheme} ${
      currentTheme === 'dark' 
        ? 'bg-slate-950 text-slate-100' 
        : 'bg-slate-50 text-slate-800'
    }`}>
      
      {/* Sidebar navigation */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        selectedClientId={selectedClientId}
        clientsCount={clients.length}
        criticalAlertsCount={balances.filter(b => b.alertState === 'critical').length}
        pendingDecisionsCount={decisions.filter(d => d.status === 'pending').length}
        currentTheme={currentTheme}
        setCurrentTheme={setCurrentTheme}
        onToggleChatWidget={() => setIsChatOpen(prev => !prev)}
      />

      {/* Main viewport area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* Top Header info bar */}
        <Header
          currentTab={currentTab}
          onRunAudit={handleRunFullAudit}
          isAuditing={isAuditing}
          syncTime={syncTime}
          logs={logs}
          currentTheme={currentTheme}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Dynamic page contents pane */}
        <main className={`flex-1 overflow-y-auto p-6 scrollbar-thin ${
          currentTheme === 'dark'
            ? 'bg-slate-950/20'
            : 'bg-slate-50'
        }`}>
          {renderActiveTab()}
        </main>
      </div>

      {/* Floating Chat Button (56px, violet BG, MessageSquare icon) */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-violet-650 hover:bg-violet-755 text-white shadow-2xl flex items-center justify-center transition-transform hover:scale-105 active:scale-95 duration-150 outline-none"
        title="Чат з Агентом"
      >
        <MessageSquare size={24} />
      </button>

      {/* Floating Chat Panel widget */}
      <AgentChatWidget
        clients={clients}
        chatMessages={chatMessages}
        onSendMessage={handleSendChatMessage}
        currentTheme={currentTheme}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />

    </div>
  );
}
