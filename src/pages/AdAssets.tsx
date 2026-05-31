import React, { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  Lightbulb, 
  Edit2, 
  Pause, 
  Play, 
  Check, 
  X, 
  ChevronRight, 
  Filter, 
  Plus, 
  AlertCircle,
  TrendingUp,
  Pin
} from 'lucide-react';
import { Client, Campaign, AdAsset, AdGroup, StagedChange } from '../types';

interface AdAssetsProps {
  clients: Client[];
  campaigns: Campaign[];
  adAssets: AdAsset[];
  adGroups: AdGroup[];
  currentTheme: 'light' | 'dark';
  onAddAssets: (assets: Omit<AdAsset, 'id'>[]) => void;
  onUpdateAsset: (id: string, update: Partial<AdAsset>) => void;
  initialClientId?: string;
  onStageChange: (change: any) => void;
  stagedChanges: StagedChange[];
}

const typeLabels: Record<string, string> = {
  headline: 'Заголовок',
  description: 'Опис',
  sitelink: 'Посилання (Sitelink)',
  callout: 'Уточнення (Callout)',
  structured_snippet: 'Структурований фрагмент',
  call: 'Телефон',
  image: 'Зображення',
  promotion: 'Промоакція',
  price: 'Ціни',
  lead_form: 'Форма для лідів'
};

const getCharLimit = (type: string) => {
  switch (type) {
    case 'headline': return 30;
    case 'description': return 90;
    case 'sitelink': return 25;
    case 'callout': return 25;
    case 'structured_snippet': return 25;
    case 'promotion': return 20;
    case 'price': return 25;
    default: return 100;
  }
};

export default function AdAssets({
  clients,
  campaigns,
  adAssets,
  adGroups,
  currentTheme,
  onAddAssets,
  onUpdateAsset,
  initialClientId,
  onStageChange,
  stagedChanges
}: AdAssetsProps) {
  // Shared filter states
  const [selectedClientId, setSelectedClientId] = useState<string>(initialClientId || 'c1');

  React.useEffect(() => {
    if (initialClientId) {
      setSelectedClientId(initialClientId);
    }
  }, [initialClientId]);

  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<
    | 'all'
    | 'headline'
    | 'description'
    | 'sitelink'
    | 'callout'
    | 'structured_snippet'
    | 'call'
    | 'image'
    | 'promotion'
    | 'price'
    | 'lead_form'
  >('all');
  const [perfFilter, setPerfFilter] = useState<string>('all');
  
  // Generating panel modal state
  const [showGenPanel, setShowGenPanel] = useState(false);
  const [genGroupId, setGenGroupId] = useState('');
  const [uspText, setUspText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedItems, setGeneratedItems] = useState<Array<{ text: string, type: 'headline' | 'description', added: boolean }>>([]);

  // Editing state
  const [editingAssetId, setEditingAssetId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

  // Hover suggestions tooltip state
  const [activeTooltipId, setActiveTooltipId] = useState<string | null>(null);

  // Derived filters
  const availableCampaigns = campaigns.filter(c => c.clientId === selectedClientId);
  
  const filteredAssets = adAssets.filter(asset => {
    if (asset.clientId !== selectedClientId) return false;
    if (selectedCampaignId !== 'all' && asset.campaignId !== selectedCampaignId) return false;
    if (typeFilter !== 'all' && asset.type !== typeFilter) return false;
    if (perfFilter !== 'all' && asset.performanceLabel !== perfFilter) return false;
    return true;
  });

  const handleGenerate = () => {
    if (!uspText.trim()) return;
    setIsGenerating(true);
    setGeneratedItems([]);
    
    setTimeout(() => {
      setIsGenerating(false);
      // Generate realistic heads & copy depending on selectedClient
      const clientName = clients.find(c => c.id === selectedClientId)?.name || 'Клієнт';
      
      const mockHeadlines = [
        `Оригінальний ${clientName}`,
        `Швидка доставка – 1 день`,
        `Сертифікована продукція`,
        `Гарантія якості та сервіс`,
        `Замовляйте вигідно зараз!`
      ];

      const mockDescriptions = [
        `Офіційний дистриб'ютор в Україні. Привабливі ціни та швидка доставка замовлень. Телефонуйте!`,
        `Великий асортимент продукції з офіційними сертифікатами якості. Знижка -10% новачкам.`
      ];

      setGeneratedItems([
        ...mockHeadlines.map(h => ({ text: h, type: 'headline' as const, added: false })),
        ...mockDescriptions.map(d => ({ text: d, type: 'description' as const, added: false }))
      ]);
    }, 1500);
  };

  const handleAddGeneratedAsset = (index: number) => {
    const item = generatedItems[index];
    if (item.added) return;

    // Call onAddAssets with the new asset template
    onAddAssets([{
      clientId: selectedClientId,
      campaignId: selectedCampaignId !== 'all' ? selectedCampaignId : (availableCampaigns[0]?.id || 'g1_1'),
      adGroupName: adGroups.find(g => g.id === genGroupId)?.name || 'Default Ad Group',
      type: item.type,
      text: item.text,
      performanceLabel: 'UNRATED',
      impressions: 0,
      clicks: 0,
      pinned: null,
      aiScore: Math.floor(Math.random() * 25) + 65, // 65-90
      aiSuggestion: null,
      status: 'active'
    }]);

    // Mark as added locally
    setGeneratedItems(prev => prev.map((g, idx) => idx === index ? { ...g, added: true } : g));
  };

  const startEditing = (asset: AdAsset) => {
    setEditingAssetId(asset.id);
    setEditingText(asset.text);
  };

  const saveInlineEdit = (id: string) => {
    if (!editingText.trim()) return;
    onUpdateAsset(id, { text: editingText, aiScore: Math.min(100, Math.max(10, editingText.length * 2)) });
    setEditingAssetId(null);
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
      
      {/* Top filter banner */}
      <div className={`p-4 rounded-lg border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
        currentTheme === 'light' ? 'bg-white border-slate-205' : 'bg-slate-900 border-slate-800'
      }`}>
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Client select */}
          <div className="space-y-1">
            <label className="block text-[9px] font-mono text-slate-400 uppercase">Клієнт</label>
            <select
              value={selectedClientId}
              onChange={(e) => {
                setSelectedClientId(e.target.value);
                setSelectedCampaignId('all');
              }}
              className="p-1 px-2.5 bg-slate-100/10 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded outline-none text-xs font-semibold focus:border-indigo-500"
            >
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Campaign Select */}
          <div className="space-y-1">
            <label className="block text-[9px] font-mono text-slate-400 uppercase">Кампанія</label>
            <select
              value={selectedCampaignId}
              onChange={(e) => setSelectedCampaignId(e.target.value)}
              className="p-1 px-2.5 bg-slate-100/10 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded outline-none text-xs font-semibold focus:border-indigo-500"
            >
              <option value="all">Всі кампанії ({availableCampaigns.length})</option>
              {availableCampaigns.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div className="space-y-1">
            <label className="block text-[9px] font-mono text-slate-400 uppercase">Тип активу</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="p-1 px-2.5 bg-slate-100/10 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded outline-none text-xs font-semibold focus:border-indigo-500"
            >
              <option value="all">Всі активи</option>
              {Object.entries(typeLabels).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </div>

          {/* Performance Filter */}
          <div className="space-y-1">
            <label className="block text-[9px] font-mono text-slate-400 uppercase">Ефективність</label>
            <select
              value={perfFilter}
              onChange={(e) => setPerfFilter(e.target.value)}
              className="p-1 px-2.5 bg-slate-100/10 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded outline-none text-xs font-semibold focus:border-indigo-500"
            >
              <option value="all">Всі оцінки</option>
              <option value="BEST">BEST (найкраще)</option>
              <option value="GOOD">GOOD (добре)</option>
              <option value="LOW">LOW (гірше)</option>
              <option value="UNRATED">UNRATED (мало даних)</option>
            </select>
          </div>

        </div>

        <button
          onClick={() => {
            setShowGenPanel(true);
            const clientGroups = adGroups.filter(g => g.clientId === selectedClientId);
            if (clientGroups.length > 0) {
              setGenGroupId(clientGroups[0].id);
            }
          }}
          className="px-4 py-2 bg-indigo-650 hover:bg-indigo-700 text-white text-xs font-bold rounded flex items-center gap-1.5 transition-all outline-none"
        >
          <Sparkles size={14} />+ Згенерувати assets
        </button>
      </div>

      {/* Main Table panel */}
      <div className={`p-5 rounded-lg border ${
        currentTheme === 'light' ? 'bg-white border-slate-205' : 'bg-slate-905 border-slate-800'
      }`}>
        <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-indigo-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-display">
              Якість текстових активів та об'єктів Google Ads ({filteredAssets.length} одиниць)
            </h3>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            Авто-класифікація Google Ads API збагачена AI аналітикою
          </span>
        </div>

        {filteredAssets.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-450 font-mono text-[9px] uppercase">
                  <th className="py-2.5">Тип</th>
                  <th className="py-2.5">Текстовий Актив</th>
                  <th className="py-2.5 text-center">Pin</th>
                  <th className="py-2.5 text-center">Ефективність (Google)</th>
                  <th className="py-2.5 text-center">AI Score</th>
                  <th className="py-2.5 text-right">Покази</th>
                  <th className="py-2.5 text-center">Статус</th>
                  <th className="py-2.5 text-right px-4">Дія</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                {filteredAssets.map((asset) => {
                  
                  // Color Labels
                  let labelColor = 'bg-slate-400/10 text-slate-400';
                  if (asset.performanceLabel === 'BEST') labelColor = 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/10 font-bold';
                  else if (asset.performanceLabel === 'GOOD') labelColor = 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/10';
                  else if (asset.performanceLabel === 'LOW') labelColor = 'bg-rose-500/10 text-rose-500 border border-rose-500/10 font-bold';
                  else if (asset.performanceLabel === 'LEARNING') labelColor = 'bg-amber-500/10 text-amber-500 border border-amber-500/10';

                  // AI Score classes
                  let scoreColor = 'bg-rose-500';
                  if (asset.aiScore >= 70) scoreColor = 'bg-emerald-500';
                  else if (asset.aiScore >= 40) scoreColor = 'bg-amber-500';

                  const isEditing = editingAssetId === asset.id;

                  return (
                    <tr key={asset.id} className="hover:bg-slate-500/5 transition-colors">
                      <td className="py-3 font-mono text-[10px] uppercase text-slate-450">
                        {typeLabels[asset.type] || asset.type}
                      </td>
                      <td className="py-3 max-w-md pr-4">
                        {isEditing ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="text"
                              value={editingText}
                              onChange={(e) => setEditingText(e.target.value)}
                              className="p-1 px-2 border rounded dark:bg-slate-950 dark:border-slate-700 outline-none w-full text-xs"
                              maxLength={getCharLimit(asset.type)}
                            />
                            <button
                              onClick={() => saveInlineEdit(asset.id)}
                              className="p-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded"
                            >
                              <Check size={12} />
                            </button>
                            <button
                              onClick={() => setEditingAssetId(null)}
                              className="p-1 bg-slate-700 hover:bg-slate-650 text-slate-300 rounded"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 group">
                            <span className="font-medium text-slate-900 dark:text-slate-100">
                              {asset.text}
                            </span>
                            {asset.aiSuggestion && (
                              <div className="relative self-center">
                                <button
                                  onClick={() => setActiveTooltipId(activeTooltipId === asset.id ? null : asset.id)}
                                  onMouseEnter={() => setActiveTooltipId(asset.id)}
                                  onMouseLeave={() => setActiveTooltipId(null)}
                                  className="text-amber-500 hover:text-amber-400 p-0.5"
                                >
                                  <Lightbulb size={12} />
                                </button>
                                {activeTooltipId === asset.id && (
                                  <div className="absolute left-6 bottom-4 z-40 p-2.5 bg-slate-900 border border-indigo-500 text-indigo-100 rounded shadow-md text-[10px] w-64 leading-normal font-sans text-left">
                                    <p className="font-semibold text-amber-550 mb-1 flex items-center gap-1">
                                      <Sparkles size={11} /> AI Порада:
                                    </p>
                                    {asset.aiSuggestion}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                        <span className="text-[9px] font-mono text-slate-400 block mt-0.5">
                          Група: {asset.adGroupName}
                        </span>
                      </td>
                      <td className="py-3 text-center">
                        {asset.pinned ? (
                          <span className="inline-flex items-center gap-0.5 text-indigo-505 dark:text-indigo-400 font-mono text-[9px] font-bold bg-indigo-500/10 px-1 py-0.2 rounded">
                            <Pin size={8} className="rotate-45" /> {asset.pinned}
                          </span>
                        ) : (
                          <span className="text-slate-500 font-mono">-</span>
                        )}
                      </td>
                      <td className="py-3 text-center">
                        <span className={`inline-block px-1.5 py-0.2 rounded font-mono text-[9px] uppercase ${labelColor}`}>
                          {asset.performanceLabel}
                        </span>
                      </td>
                      <td className="py-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <span className="font-mono font-bold text-[10px] min-w-5">{asset.aiScore}%</span>
                          <div className="w-12 h-1 bg-slate-800 rounded-full overflow-hidden">
                            <div className={`h-full ${scoreColor}`} style={{ width: `${asset.aiScore}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-right font-mono text-slate-400">
                        {asset.impressions.toLocaleString()}
                      </td>
                      <td className="py-3 text-center">
                        <span className={`inline-block px-1.5 py-0.2 rounded text-[9px] font-mono capitalize ${
                          asset.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-500'
                        }`}>
                          {asset.status === 'active' ? 'активний' : 'павза'}
                        </span>
                      </td>
                      <td className="py-3 text-right px-4">
                        <div className="flex justify-end gap-1 font-mono items-center">
                          {stagedChanges.some(c => c.type === 'pause_asset' && c.payload.assetId === asset.id && c.status === 'pending') ? (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-500 dark:text-indigo-400 font-bold border border-indigo-500/10 font-sans tracking-wide">
                              В черзі
                            </span>
                          ) : (
                            <>
                              <button
                                onClick={() => startEditing(asset)}
                                className="p-1 hover:bg-slate-800/20 text-indigo-400 hover:text-indigo-300 rounded"
                                title="Редагувати"
                              >
                                <Edit2 size={11} />
                              </button>
                              <button
                                onClick={() => {
                                  onStageChange({
                                    clientId: selectedClientId,
                                    clientName: clients.find(c => c.id === selectedClientId)?.name || 'Клієнт',
                                    type: 'pause_asset',
                                    description: `Призупинити ${typeLabels[asset.type] || asset.type} '${asset.text.length > 25 ? asset.text.substring(0, 25) + '...' : asset.text}'`,
                                    payload: { assetId: asset.id, text: asset.text, type: asset.type },
                                    source: 'manual'
                                  });
                                }}
                                className={`p-1 hover:bg-slate-800/20 rounded ${
                                  asset.status === 'active' ? 'text-amber-500 hover:text-amber-400' : 'text-emerald-500 hover:text-emerald-450'
                                }`}
                                title={asset.status === 'active' ? 'Пауза (Staging)' : 'Запустити'}
                              >
                                {asset.status === 'active' ? <Pause size={11} /> : <Play size={11} />}
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-slate-400 font-sans">
            <AlertCircle size={32} className="mx-auto text-amber-500 mb-2 p-1 bg-amber-500/10 rounded-full" />
            <p className="font-bold">Об'єктів не знайдено за поточною комбінацією фільтрів!</p>
          </div>
        )}
      </div>

      {/* Generating Sliding Panel Modal */}
      {showGenPanel && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex justify-end">
          <div className={`max-w-md w-full h-full p-6 border-l flex flex-col justify-between ${
            currentTheme === 'light' ? 'bg-white border-slate-205 text-slate-800' : 'bg-slate-905 border-slate-800 text-white'
          } animate-slide-in`}>
            
            <div className="space-y-6 overflow-y-auto pb-4">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-850 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-violet-500" />
                  <h4 className="font-bold font-display text-sm tracking-tight">AI Генератор Рекламних Оголошень</h4>
                </div>
                <button onClick={() => setShowGenPanel(false)} className="text-slate-400 hover:text-white p-1">
                  <X size={18} />
                </button>
              </div>

              {/* Group selection dropdown */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono uppercase text-slate-400">Група оголошень для генерації</label>
                <select
                  value={genGroupId}
                  onChange={(e) => setGenGroupId(e.target.value)}
                  className="w-full p-2 bg-slate-100/10 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded outline-none text-xs"
                >
                  {adGroups.filter(g => g.clientId === selectedClientId).map(group => (
                    <option key={group.id} value={group.id}>{group.name}</option>
                  ))}
                </select>
              </div>

              {/* USP Input description */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono uppercase text-slate-400">
                  Що продає клієнт / УТП (Унікальна пропозиція)
                </label>
                <textarea
                  value={uspText}
                  onChange={(e) => setUspText(e.target.value)}
                  placeholder="Наприклад: Корейська косметика, швидка доставка за 1 день, тільки оригінал, сертифікати якості..."
                  rows={4}
                  className="w-full p-2.5 bg-slate-100/10 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded outline-none text-xs leading-relaxed focus:border-indigo-500"
                />
                <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                  <span>Заголовки: 30 симв. макс.</span>
                  <span>Описи: 90 симв. макс.</span>
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={!uspText.trim() || isGenerating}
                className="w-full py-2 bg-violet-650 hover:bg-violet-750 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold text-xs rounded tracking-wider flex items-center justify-center gap-2 outline-none"
              >
                {isGenerating ? (
                  <>
                    <div className="border-2 border-slate-350 border-t-white animate-spin rounded-full w-3.5 h-3.5" />
                    Аналізую нішу та ТЗ...
                  </>
                ) : (
                  <>
                    <Sparkles size={13} /> Згенерувати варіанти AI
                  </>
                )}
              </button>

              {/* Generated Options Cards */}
              {generatedItems.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-slate-150 dark:border-slate-850">
                  <h5 className="font-bold text-xs font-mono uppercase text-slate-400">Згенеровані пропозиції:</h5>
                  <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                    {generatedItems.map((item, idx) => {
                      const exceedsLimit = item.type === 'headline' ? item.text.length > 30 : item.text.length > 90;
                      return (
                        <div 
                          key={idx}
                          className={`p-3 rounded border text-xs flex justify-between items-start gap-2.5 transition-all ${
                            item.added 
                              ? 'bg-emerald-500/10 border-emerald-500/20 opacity-70' 
                              : 'bg-slate-500/5 hover:bg-slate-500/10 border-slate-500/10'
                          }`}
                        >
                          <div className="space-y-1 w-full">
                            <span className="text-[9px] font-mono bg-indigo-505/10 text-indigo-400 px-1 py-0.2 rounded uppercase block w-max">
                              {item.type === 'headline' ? 'Заголовок' : 'Опис'}
                            </span>
                            <p className="font-semibold text-slate-150">{item.text}</p>
                            <span className={`text-[9px] font-mono block ${exceedsLimit ? 'text-rose-500' : 'text-slate-405'}`}>
                              Довжина: {item.text.length} симв.
                            </span>
                          </div>

                          <button
                            onClick={() => handleAddGeneratedAsset(idx)}
                            disabled={item.added}
                            className={`p-1 rounded text-xs leading-none transition-all flex-shrink-0 ${
                              item.added 
                                ? 'text-emerald-500 hover:text-emerald-500' 
                                : 'bg-slate-800 hover:bg-indigo-600 text-white'
                            }`}
                          >
                            {item.added ? <Check size={14} /> : <Plus size={14} />}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>

            <div className="border-t border-slate-150 dark:border-slate-850 pt-3 flex justify-end">
              <button
                onClick={() => setShowGenPanel(false)}
                className="px-4 py-1.5 bg-slate-800/80 hover:bg-slate-750 text-slate-300 rounded text-xs font-mono"
              >
                Закрити
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
