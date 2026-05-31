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
  actionType: 'add_negatives' | 'refill_balance' | 'check_drop' | 'pause_keywords' | 'optimize_bids';
  source: 'script' | 'agent' | 'ads_api';
  sourceName: string; // e.g. "Search Terms Agent", "balances.py"
  status: 'pending' | 'approved' | 'rejected' | 'deferred';
  payload: {
    negatives?: string[];
    amountNeeded?: number;
    keywordsToPause?: string[];
    details?: string;
  };
  createdAt: string;
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
