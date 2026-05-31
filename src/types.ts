export interface Client {
  id: string;
  name: string;
  accountId: string;
  healthScore: number; // 0-100
  budgetLimit: number;
  budgetSpent: number;
  ctr: number; // %
  cpc: number; // $ or UAH
  cpa: number; // $ or UAH
  conversions: number;
  riskLevel: 'low' | 'medium' | 'high';
  lastAction: string;
  nextStep: string;
  currency: string;
  status: 'active' | 'paused' | 'warning';
  industry: string;
  optimizationPriority?: 'cpa' | 'ctr' | 'reach' | 'balanced';
  agentNotes?: string;
}

export interface Campaign {
  id: string;
  clientId: string;
  name: string;
  budget: number;
  spent: number;
  status: 'active' | 'paused' | 'removed';
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  conversions: number;
  cpa: number;
}

export interface Decision {
  id: string;
  clientId: string;
  clientName: string;
  priority: 'high' | 'medium' | 'low';
  title: string;
  desc: string;
  actionType: 'add_negatives' | 'refill_balance' | 'check_drop' | 'pause_keywords' | 'optimize_bids' | 'campaign_create' | 'update_assets';
  source: 'script' | 'agent' | 'ads_api';
  sourceName: string; // e.g. "Search Terms Agent", "balances.py"
  status: 'pending' | 'approved' | 'rejected' | 'deferred' | 'staged';
  payload: {
    negatives?: string[];
    amountNeeded?: number;
    keywordsToPause?: string[];
    details?: string;
  };
  createdAt: string;
  feedbackStats?: {
    timesRejected: number;    // скільки разів такий тип рекомендації відхилявся для цього клієнта
    timesApproved: number;    // скільки разів приймався
    lastRejectedAt?: string;  // дата останнього відхилення
  };
  rejectionNote?: string;     // нотатка Тимофія при відхиленні (опціонально)
}

export interface AIAgent {
  id: string;
  name: string;
  status: 'active' | 'idle' | 'running';
  desc: string;
  statsLabel: string;
  statsValue: string;
  lastRunTime: string;
  resultSummary: string;
  capabilities: string[];
  memoryStats: {
    totalDecisions: number;      // скільки рішень в пам'яті
    approvalRate: number;        // % прийнятих рекомендацій (0-100)
    lastMemoryUpdate: string;    // коли останній раз оновлювався profile
  };
  learningStatus: 'active' | 'insufficient_data' | 'paused';
}

export interface AutomationScript {
  id: string;
  filename: string;
  name: string;
  status: 'active' | 'warning' | 'failed' | 'idle';
  lastRun: string;
  nextRun: string;
  resultMessage: string;
  codePreview: string;
}

export interface BalanceRecord {
  id: string;
  clientId: string;
  clientName: string;
  limit: number;
  currentBalance: number;
  burnRate: number; // daily spend
  daysLeft: number;
  alertState: 'critical' | 'warning' | 'ok' | 'depleted';
}

export interface SearchTermItem {
  id: string;
  clientId: string;
  clientName: string;
  term: string;
  impressions: number;
  clicks: number;
  cost: number;
  ctr: number;
  conversions: number;
  cpa: number;
  relevanceScore: number; // 0-100 (from AI)
  status: 'review' | 'added' | 'dismissed';
}

export interface Document {
  id: string;
  title: string;
  category: 'prompt' | 'sop' | 'script' | 'notes';
  desc: string;
  content: string;
  lastModified: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'success' | 'critical';
  message: string;
  actor: 'User' | 'AI Agent' | 'System' | 'Script';
  category: 'action' | 'automation' | 'sync' | 'system';
}

export interface AgentChatMessage {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: string;
  clientId?: string;   // якого клієнта стосується
  isLoading?: boolean;
}

export interface AdAsset {
  id: string;
  clientId: string;
  campaignId: string;
  adGroupName: string;
  type: 'headline' | 'description' | 'sitelink' | 'callout' | 'structured_snippet' | 'call' | 'image' | 'promotion' | 'price' | 'lead_form';
  text: string;
  performanceLabel: 'BEST' | 'GOOD' | 'LOW' | 'UNRATED' | 'LEARNING';
  impressions: number;
  clicks: number;
  pinned: 1 | 2 | 3 | null;
  aiScore: number; // 0-100
  aiSuggestion: string | null; // підказка якщо LOW або UNRATED
  status: 'active' | 'paused' | 'removed';
}

export interface AdGroup {
  id: string;
  clientId: string;
  campaignId: string;
  name: string;
  status: 'active' | 'paused' | 'removed';
  keywords: string[];
  negativeKeywords: string[];
  assets: AdAsset[];
  healthScore: number;
}

export interface CampaignDraft {
  id: string;
  clientId: string;
  name: string;
  type: 'search' | 'pmax' | 'display' | 'shopping' | 'video' | 'app' | 'demand_gen';
  dailyBudget: number;
  targetCpa: number | null;
  biddingStrategy: 'TARGET_CPA' | 'TARGET_ROAS' | 'MAXIMIZE_CONVERSIONS' | 'MANUAL_CPC';
  geoTargets: string[];
  adGroups: {
    name: string;
    keywords: string[];
    negatives: string[];
    headlines: string[];
    descriptions: string[];
  }[];
  status: 'draft' | 'ready' | 'exported';
  createdAt: string;
  notes: string;
}

export interface StagedChange {
  id: string;
  clientId: string;
  clientName: string;
  type: 'pause_asset' | 'create_asset' | 'pause_keyword' |
        'add_negatives' | 'update_budget' | 'change_bid_strategy' |
        'pause_campaign' | 'create_campaign' | 'update_ad_schedule';
  description: string;        // людський опис: "Призупинити заголовок 'Косметика'"
  payload: Record<string, any>;
  source: 'manual' | 'agent_decision';
  decisionId?: string;        // якщо прийшло з черги рішень агента
  stagedAt: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  errorMessage?: string;
}
