import React from 'react';
import { 
  X, 
  Trash2, 
  Upload, 
  Loader2, 
  CheckCircle2, 
  Sparkles, 
  AlertCircle,
  FileText,
  Activity,
  ArrowRight
} from 'lucide-react';
import { StagedChange } from '../types';

interface StagingQueueModalProps {
  isOpen: boolean;
  onClose: () => void;
  stagedChanges: StagedChange[];
  onRemoveStagedChange: (id: string) => void;
  onUploadChanges: () => void;
  isUploading: boolean;
  currentTheme: 'light' | 'dark';
}

export default function StagingQueueModal({
  isOpen,
  onClose,
  stagedChanges,
  onRemoveStagedChange,
  onUploadChanges,
  isUploading,
  currentTheme
}: StagingQueueModalProps) {
  if (!isOpen) return null;

  const pendingChanges = stagedChanges.filter(c => c.status === 'pending');
  const uploadingChanges = stagedChanges.filter(c => c.status === 'uploading');
  const successChanges = stagedChanges.filter(c => c.status === 'success');

  const totalCount = stagedChanges.length;
  const isStagedEmpty = totalCount === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end font-sans">
      {/* Backdrop cover overlay */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={!isUploading ? onClose : undefined}
      />

      {/* Slideout panel container */}
      <div className={`relative w-full max-w-md h-full flex flex-col shadow-2xl transition-transform duration-300 transform translate-x-0 ${
        currentTheme === 'light' 
          ? 'bg-white text-slate-800 border-l border-slate-200' 
          : 'bg-[#0f172a] text-slate-100 border-l border-slate-800'
      }`}>
        
        {/* Modal Header */}
        <div className={`p-4 px-5 border-b flex items-center justify-between ${
          currentTheme === 'light' ? 'border-slate-150 bg-slate-50' : 'border-slate-850 bg-slate-900'
        }`}>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="p-1 rounded bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
                <Upload size={14} className="stroke-[2.5px]" />
              </span>
              <h3 className="text-xs font-bold uppercase tracking-wider font-mono">
                Черга авто-вивантаження
              </h3>
            </div>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">
              Тип Google Ads Client-Side Editor
            </p>
          </div>
          <button 
            type="button"
            disabled={isUploading}
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 disabled:opacity-40 transition cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Changes Body list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
          
          {isStagedEmpty ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-400 mb-2">
                <FileText size={20} />
              </div>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Черга порожня
              </p>
              <p className="text-[10px] text-slate-400 max-w-[240px] leading-relaxed">
                Додавайте до черги будь-які дії з кампаній або клієнтів (редагування тем, паузи, бюджети), щоб вивантажити їх одним пакетом.
              </p>
            </div>
          ) : (
            <>
              {/* Active stats badge */}
              <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-400 px-1">
                <span>Елементи в черзі ({totalCount})</span>
                {uploadingChanges.length > 0 && (
                  <span className="text-indigo-500 animate-pulse flex items-center gap-1">
                    <Activity size={10} className="animate-spin" /> Завантаження у кабінети...
                  </span>
                )}
              </div>

              {/* Staged Cards rendering */}
              <div className="space-y-2.5">
                {stagedChanges.map((change) => {
                  const isPending = change.status === 'pending';
                  const isUploadingItem = change.status === 'uploading';
                  const isSuccess = change.status === 'success';

                  return (
                    <div 
                      key={change.id}
                      className={`p-3 rounded-lg border text-left transition relative overflow-hidden flex items-start gap-2.5 ${
                        isSuccess 
                          ? 'bg-emerald-500/[0.03] border-emerald-500/25' 
                          : isUploadingItem 
                          ? 'bg-indigo-500/[0.02] border-indigo-500/30 animate-pulse'
                          : currentTheme === 'light'
                          ? 'bg-white border-slate-200 hover:border-slate-300'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-750'
                      }`}
                    >
                      {/* Left color bar reflecting type */}
                      <div className={`absolute top-0 bottom-0 left-0 w-1 ${
                        isSuccess 
                          ? 'bg-emerald-500' 
                          : isUploadingItem 
                          ? 'bg-indigo-550' 
                          : 'bg-indigo-500/50'
                      }`} />

                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex justify-between items-start gap-1">
                          <span className="text-[9px] font-mono font-bold text-slate-400 truncate max-w-[160px]">
                            {change.clientName}
                          </span>
                          <span className={`text-[8px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider font-mono ${
                            change.source === 'agent_decision' 
                              ? 'bg-purple-100 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400' 
                              : 'bg-indigo-100 text-indigo-650 dark:bg-indigo-950/40 dark:text-indigo-300'
                          }`}>
                            {change.source === 'agent_decision' ? 'ШІ' : 'User'}
                          </span>
                        </div>

                        <p className="text-[11px] font-bold leading-normal text-slate-900 dark:text-slate-100 break-words">
                          {change.description}
                        </p>

                        <div className="flex items-center gap-2 pt-0.5">
                          <span className="text-[8px] font-mono px-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-400 uppercase font-bold">
                            {change.type}
                          </span>
                          <span className="text-[8.5px] text-slate-400 font-mono">
                            {new Date(change.stagedAt).toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>

                      {/* Right actions (delete button / spinner / success icon) */}
                      <div className="pt-0.5">
                        {isPending && (
                          <button
                            type="button"
                            onClick={() => onRemoveStagedChange(change.id)}
                            className="p-1 rounded text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 cursor-pointer transition"
                            title="Видалити"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}

                        {isUploadingItem && (
                          <Loader2 size={13} className="text-indigo-500 animate-spin" />
                        )}

                        {isSuccess && (
                          <CheckCircle2 size={14} className="text-emerald-500 animate-bounce" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Footer controls */}
        {!isStagedEmpty && (
          <div className={`p-4 border-t space-y-3 ${
            currentTheme === 'light' ? 'border-slate-150 bg-slate-50' : 'border-slate-850 bg-slate-900/70'
          }`}>
            {isUploading && (
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[10px] font-mono font-bold text-indigo-500 px-0.5">
                  <span>Виконується вивантаження...</span>
                  <span>75%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full animate-pulse transition-all duration-1000" style={{ width: '75%' }}></div>
                </div>
              </div>
            )}

            <button
              type="button"
              disabled={isUploading || pendingChanges.length === 0}
              onClick={onUploadChanges}
              className={`w-full py-2.5 rounded-lg text-xs font-bold leading-none flex items-center justify-center gap-2 shadow-md transition ${
                isUploading || pendingChanges.length === 0
                  ? 'bg-slate-250 dark:bg-slate-800 text-slate-400 cursor-not-allowed border border-transparent'
                  : 'bg-indigo-600 hover:bg-indigo-750 text-white cursor-pointer shadow-indigo-550/15 hover:scale-[1.01]'
              }`}
            >
              {isUploading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Вивантажуємо у кабінети Google Ads...</span>
                </>
              ) : (
                <>
                  <Upload size={14} className="stroke-[2.5px]" />
                  <span>Вивантажити в Google Ads ({pendingChanges.length})</span>
                </>
              )}
            </button>
            
            <p className="text-[9px] text-center text-slate-400/80 font-mono leading-relaxed">
              *Всі зміни буде перенесено в Google Ads завантажувачем. Ви одразу побачите змінений статус кампаній в інтерфейсі.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
