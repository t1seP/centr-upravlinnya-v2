import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  HelpCircle, 
  Check, 
  X, 
  AlertCircle, 
  Bot, 
  ShieldAlert, 
  ThumbsUp, 
  Filter
} from 'lucide-react';
import { SearchTermItem, Client } from '../types';

interface SemanticsProps {
  searchTerms: SearchTermItem[];
  clients: Client[];
  onAddNegativeKeyword: (clientId: string, word: string) => void;
  onDismissSearchTerm: (id: string) => void;
  currentTheme: 'light' | 'dark';
  onAddDecisionLog: (msg: string, level: 'info' | 'success' | 'warning' | 'critical') => void;
  searchQuery: string;
}

export default function Semantics({
  searchTerms,
  clients,
  onAddNegativeKeyword,
  onDismissSearchTerm,
  currentTheme,
  onAddDecisionLog,
  searchQuery
}: SemanticsProps) {
  
  // Active selected client search terms tab
  const [selectedClientId, setSelectedClientId] = useState<string>(clients[0]?.id || 'c1');
  const activeClientName = clients.find(c => c.id === selectedClientId)?.name || 'Клієнт';

  // State management for individual feedback messages
  const [successMsg, setSuccessMsg] = useState('');

  // Filtering terms based on selected client AND header search string
  const filteredTerms = searchTerms.filter(t => 
    t.clientId === selectedClientId &&
    (t.term.toLowerCase().includes(searchQuery.toLowerCase()) || 
     t.clientName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleApproveNegative = (term: SearchTermItem) => {
    // Treat the search term as a negative keyword triggers
    onAddNegativeKeyword(term.clientId, term.term);
    onDismissSearchTerm(term.id);
    
    onAddDecisionLog(
      `Семантика: Фразу "${term.term}" додано як МІНУС-СЛОВО для ${term.clientName}. Зміни перенесено до Кампаній.`,
      'success'
    );
    
    setSuccessMsg(`Додано мінус-слово: -"${term.term}"`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleDismissTerm = (term: SearchTermItem) => {
    onDismissSearchTerm(term.id);
    onAddDecisionLog(
      `Семантика: Фразу "${term.term}" відкинуто з черги перевірки клієнта ${term.clientName}.`,
      'info'
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Horizontal Client Navigator */}
      <div className={`p-4 rounded-lg border ${
        currentTheme === 'light' ? 'bg-white border-slate-205' : 'bg-slate-905 border-slate-800'
      }`}>
        <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-1">
          Фільтрація пошукових термінів по клієнту
        </label>
        <div className="flex flex-wrap gap-2">
          {clients.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedClientId(c.id)}
              className={`px-3 py-1.5 rounded text-xs font-semibold transition ${
                selectedClientId === c.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-800/20 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {successMsg && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs rounded font-medium font-mono leading-none">
          🚨 {successMsg}
        </div>
      )}

      {/* Main Grid: Search Terms Queue vs Explanations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main interactive queue list */}
        <div className={`p-5 rounded-lg border lg:col-span-2 space-y-4 ${
          currentTheme === 'light' ? 'bg-white border-slate-205' : 'bg-slate-900 border-slate-800'
        }`}>
          <div className="pb-3 border-b border-slate-800/10 flex justify-between items-center">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-display">
                Черга верифікації пошукових запитів ({filteredTerms.length})
              </h4>
              <p className="text-[10px] text-slate-400">Аналіз нецільового трафіку із Google Ads API за останні 7 днів</p>
            </div>
            <span className="text-[10px] font-mono text-indigo-505 font-bold bg-indigo-500/10 px-2 py-0.5 rounded">
              Search Terms Agent active
            </span>
          </div>

          {filteredTerms.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px] font-sans border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-mono text-[9px] uppercase">
                    <th className="py-2.5">Запит (Search Term)</th>
                    <th className="py-2.5 text-center">ШІ Оцінка (Relevance)</th>
                    <th className="py-2.5 text-right">Покази</th>
                    <th className="py-2.5 text-right">Кліки</th>
                    <th className="py-2.5 text-center">CTR %</th>
                    <th className="py-2.5 text-right font-semibold">Вартість (Cost)</th>
                    <th className="py-2.5 text-center text-indigo-400">Conv.</th>
                    <th className="py-2.5 text-right">Дії</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
                  {filteredTerms.map((term) => {
                    // Determine CTR pill style
                    let ctrStyle = "text-amber-600 bg-amber-50 dark:bg-amber-950/20";
                    if (term.ctr >= 5.0) {
                      ctrStyle = "text-emerald-700 bg-emerald-50 dark:bg-emerald-950/20 font-bold";
                    } else if (term.ctr < 2.5) {
                      ctrStyle = "text-rose-700 bg-rose-50 dark:bg-rose-950/20 font-bold";
                    }

                    // Relevance score styling
                    let relevanceStyle = "bg-amber-500/10 text-amber-700 border border-amber-500/20";
                    if (term.relevanceScore >= 70) {
                      relevanceStyle = "bg-emerald-500/10 text-emerald-705 border border-emerald-500/20 font-bold";
                    } else if (term.relevanceScore < 30) {
                      relevanceStyle = "bg-rose-500/10 text-rose-705 border border-rose-500/20 font-bold";
                    }

                    return (
                      <tr key={term.id} className="hover:bg-slate-800/10 font-sans text-xs transition-colors">
                        <td className="py-3 font-mono font-semibold text-slate-900 dark:text-slate-150 select-all max-w-xs truncate pr-2">
                          {term.term}
                        </td>
                        <td className="py-3 text-center">
                          <span className={`inline-block px-1.5 py-0.5 rounded font-mono text-[10px] ${relevanceStyle}`}>
                            {term.relevanceScore}%
                          </span>
                        </td>
                        <td className="py-3 text-right font-mono text-slate-500">
                          {term.impressions.toLocaleString()}
                        </td>
                        <td className="py-3 text-right font-mono text-slate-500">
                          {term.clicks.toLocaleString()}
                        </td>
                        <td className="py-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${ctrStyle}`}>
                            {term.ctr}%
                          </span>
                        </td>
                        <td className="py-3 text-right font-mono font-medium text-slate-800 dark:text-slate-205">
                          {term.cost.toLocaleString()} UAH
                        </td>
                        <td className="py-3 text-center font-bold text-indigo-400 font-mono">
                          {term.conversions}
                        </td>
                        <td className="py-3 text-right space-x-1.5">
                          <button
                            onClick={() => handleDismissTerm(term)}
                            className="px-2 py-1 hover:bg-slate-850 border border-slate-800 rounded text-[10px] font-mono text-slate-400 hover:text-white"
                            title="Пропустити"
                          >
                            Скіп
                          </button>
                          <button
                            onClick={() => handleApproveNegative(term)}
                            className="px-2 py-1 bg-[#3a6fcb] hover:bg-[#2b59ab] text-white rounded text-[10px] font-mono font-bold"
                            title="Додати в мінус-списки"
                          >
                            - Мінус СЛОВО
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs">
              <Check className="mx-auto text-emerald-500 mb-2 p-1 bg-emerald-500/10 rounded-full" size={28} />
              <p className="font-semibold">Немає нових запитів для перевірки по {activeClientName}</p>
              <p className="text-[10px] mt-0.5">Всі низькорелевантні фрази верифіковано або внесено до мінус-листів.</p>
            </div>
          )}
        </div>

        {/* Right explanatory column containing details */}
        <div className="space-y-6">
          
          <div className={`p-5 rounded-lg border space-y-3.5 ${
            currentTheme === 'light' ? 'bg-white border-slate-205' : 'bg-slate-905 border-slate-800'
          }`}>
            <div className="pb-3 border-b border-slate-800/10 flex items-center gap-2">
              <Bot size={16} className="text-indigo-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-display">
                Як працює Search Terms Agent?
              </h4>
            </div>
            
            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
              Агент щоночі завантажує звіти Google Ads API по фразах, яки отримали більше ніж <b>5 кліків</b> без замовлень. 
              Використовуючи мовні моделі, він порівнює контекст фрази з ціннісною пропозицією клієнта. 
              Якщо відсоток релевантності менше ніж <b>30%</b>, він автоматично рекомендує фразу до мінус-листа.
            </p>

            <div className="p-3 bg-amber-500/10 border border-amber-500/15 rounded text-[10.5px] text-amber-500 leading-relaxed font-sans">
              <b>Поради спеціаліста:</b> Брендовий трафік (наприклад "купівля бренду кремів") завжди залишайте активним, навіть якщо CPA тимчасово зростає, для підтримки власного репутаційного поля.
            </div>
          </div>

          <div className={`p-5 rounded-lg border space-y-3 ${
            currentTheme === 'light' ? 'bg-white border-slate-205' : 'bg-slate-905 border-slate-800'
          }`}>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-display">
              Рівень бренд-канібалізації
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Монітор семантики фіксує відсутність значної канібалізації бренду іншими конкурентами на цьому тижні. Всі ключові показники знаходяться в межах контрольної зони.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
