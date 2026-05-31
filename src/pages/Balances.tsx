import React, { useState } from 'react';
import { 
  Wallet, 
  AlertTriangle, 
  TrendingUp, 
  ArrowUpRight, 
  Coins, 
  Activity, 
  DollarSign, 
  Check, 
  ChevronRight,
  Loader2
} from 'lucide-react';
import { BalanceRecord, Client } from '../types';

interface BalancesProps {
  balances: BalanceRecord[];
  clients: Client[];
  onRefillBalance: (clientId: string, amount: number) => void;
  currentTheme: 'light' | 'dark';
  onAddDecisionLog: (msg: string, level: 'info' | 'success' | 'warning' | 'critical') => void;
}

export default function Balances({
  balances,
  clients,
  onRefillBalance,
  currentTheme,
  onAddDecisionLog
}: BalancesProps) {
  
  // Refill balance simulation states
  const [refillTarget, setRefillTarget] = useState(balances[0]?.clientId || '');
  const [refillAmount, setRefillAmount] = useState<number>(30000);
  const [isProcessingRefill, setIsProcessingRefill] = useState(false);
  const [justRefilledMessage, setJustRefilledMessage] = useState('');

  const handleRefillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refillTarget || refillAmount <= 0) return;
    
    setIsProcessingRefill(true);
    setJustRefilledMessage('');

    setTimeout(() => {
      onRefillBalance(refillTarget, refillAmount);
      const clientName = clients.find(c => c.id === refillTarget)?.name || 'Клієнт';
      
      onAddDecisionLog(
        `Оплата: Баланс по кабінету ${clientName} поповнено на +${refillAmount.toLocaleString()} UAH. Ризик зупинки ліквідовано.`,
        'success'
      );

      setJustRefilledMessage(`Кабінет ${clientName} успішно профінансовано на ${refillAmount.toLocaleString()} UAH!`);
      setIsProcessingRefill(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Alert Header for critical cash burn */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main interactive billing table */}
        <div className={`p-5 rounded-lg border lg:col-span-2 space-y-4 ${
          currentTheme === 'light' ? 'bg-white border-slate-205' : 'bg-slate-900 border-slate-800'
        }`}>
          <div className="pb-3 border-b border-slate-800/10 flex justify-between items-center">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-display">
                Стан фінансування акаунтів (Google Billing API)
              </h4>
              <p className="text-[10px] text-slate-400">Поєднання залишків за ковзним прогнозом денних витрат</p>
            </div>
            <span className="text-[10px] font-mono text-amber-500 font-semibold bg-amber-500/10 px-2 py-0.5 rounded">
              Поріг прогнозу: 3 дні
            </span>
          </div>

          <div className="space-y-3">
            {balances.map((record) => {
              const matchedClient = clients.find(c => c.id === record.clientId);
              return (
                <div 
                  key={record.id}
                  className={`p-3.5 rounded border text-xs flex items-center justify-between gap-4 transition-colors ${
                    record.alertState === 'critical' 
                      ? 'border-l-4 border-l-rose-500 bg-rose-500/5 border-rose-500/15' 
                      : record.alertState === 'warning'
                      ? 'border-l-4 border-l-amber-500 bg-amber-500/5 border-amber-500/15'
                      : 'border-l-4 border-l-emerald-555 bg-slate-950/20 border-slate-800/60'
                  }`}
                >
                  <div className="space-y-1">
                    <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                      {record.clientName}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      ЛІМІТ ПО РОКУ: {record.limit.toLocaleString()} UAH | ДЕННИЙ СПАД (BURN-RATE): ~{record.burnRate.toLocaleString()} UAH
                    </p>
                  </div>

                  {/* Calculations and state values */}
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <span className="text-[9px] text-slate-400 block font-mono">БАЛАНС G-ADS</span>
                      <span className={`font-mono font-bold text-xs ${
                        record.alertState === 'critical' ? 'text-rose-500' : 'text-slate-900 dark:text-slate-200'
                      }`}>
                        {record.currentBalance.toLocaleString()} UAH
                      </span>
                    </div>

                    <div className="text-right min-w-24">
                      {record.currentBalance <= 0 ? (
                        <span className="text-[10px] font-bold text-rose-500 uppercase font-mono bg-rose-500/10 px-2 py-0.5 rounded block text-center">
                          ВИЧЕРПАНО !
                        </span>
                      ) : (
                        <div>
                          <span className="text-[9px] text-slate-400 block font-mono text-center">ВИСТАЧИТЬ НА</span>
                          <span className={`px-2 py-0.5 font-mono font-bold text-xs rounded block text-center ${
                            record.alertState === 'critical' 
                              ? 'bg-rose-500 text-white animate-bounce' 
                              : record.alertState === 'warning'
                              ? 'bg-amber-500/15 text-amber-500'
                              : 'bg-emerald-550/10 text-emerald-500'
                          }`}>
                            {record.daysLeft.toFixed(1)} днів
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right balance trigger workflow */}
        <div className="space-y-6">
          
          <div className={`p-5 rounded-lg border space-y-4 ${
            currentTheme === 'light' ? 'bg-white border-slate-205' : 'bg-slate-905 border-slate-800'
          }`}>
            <div className="pb-3 border-b border-slate-800/10 flex items-center gap-2">
              <Coins size={16} className="text-indigo-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-display">
                Швидкий розрахунок платежу (Billing)
              </h4>
            </div>

            {justRefilledMessage && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded text-xs leading-relaxed font-sans font-medium">
                {justRefilledMessage}
              </div>
            )}

            <form onSubmit={handleRefillSubmit} className="space-y-4 text-xs font-sans">
              <div>
                <label className="text-slate-400 block mb-1 font-semibold uppercase text-[10px]">
                  Оберіть рекламний кабінет:
                </label>
                <select
                  value={refillTarget}
                  onChange={(e) => setRefillTarget(e.target.value)}
                  className={`w-full py-2 px-2.5 rounded border text-xs outline-none ${
                    currentTheme === 'light'
                      ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-indigo-505'
                      : 'bg-slate-900 border-slate-800 text-slate-100 focus:bg-slate-800 focus:border-indigo-400'
                  }`}
                >
                  {balances.map((record) => (
                    <option key={record.clientId} value={record.clientId}>
                      {record.clientName} (Залишок: {record.currentBalance.toLocaleString()} UAH)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-semibold uppercase text-[10px]">
                  Сума поповнення в UAH:
                </label>
                <input
                  type="number"
                  step="5000"
                  min="5000"
                  max="1000000"
                  value={refillAmount}
                  onChange={(e) => setRefillAmount(Number(e.target.value))}
                  className={`w-full py-2 px-2.5 rounded border text-xs outline-none font-mono ${
                    currentTheme === 'light'
                      ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-indigo-505'
                      : 'bg-slate-900 border-slate-800 text-slate-100 focus:bg-slate-800 focus:border-indigo-400'
                  }`}
                />
              </div>

              <div className="p-3.5 bg-slate-950/20 rounded font-mono text-[10.5px] text-slate-400 space-y-1 border border-slate-800/10">
                <div className="flex justify-between">
                  <span>Транзакційна комісія:</span>
                  <span className="text-slate-250">0.0% (Прямий білінг)</span>
                </div>
                <div className="flex justify-between">
                  <span>Очікуване продовження ходу:</span>
                  <span className="text-emerald-500 font-bold">
                    +{(refillAmount / (balances.find(b => b.clientId === refillTarget)?.burnRate || 1)).toFixed(1)} дн.
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessingRefill}
                className={`w-full py-2.5 rounded font-bold transition flex items-center justify-center gap-1.5 ${
                  isProcessingRefill
                    ? 'bg-indigo-600/30 text-indigo-305 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer shadow-md'
                }`}
              >
                {isProcessingRefill ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    <span>Проведення платежу в банк...</span>
                  </>
                ) : (
                  <>
                    <span>Здійснити поповнення</span>
                    <ArrowUpRight size={14} />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className={`p-5 rounded-lg border space-y-3 ${
            currentTheme === 'light' ? 'bg-white border-slate-205' : 'bg-slate-905 border-slate-800'
          }`}>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-display">
              Приписи SOP щодо регуляції фінансів
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Не дозволяйте кампаніям PMax повністю зупинятися через вичерпання коштів. Запуск після зупинки займає в середньому від 48 до 72 годин на навчання за новими векторами акаунта. Рекомендований мінімальний поріг страховки: 3 дні добового burn-rate.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
