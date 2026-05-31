import React, { useState } from 'react';
import { 
  FileText, 
  HelpCircle, 
  Search, 
  BookOpen, 
  Settings, 
  Clipboard, 
  Tag
} from 'lucide-react';
import { Document } from '../types';

interface DocLibraryProps {
  documents: Document[];
  currentTheme: 'light' | 'dark';
  searchQuery: string;
}

export default function DocLibrary({
  documents,
  currentTheme,
  searchQuery
}: DocLibraryProps) {
  
  const [selectedDocId, setSelectedDocId] = useState<string>(documents[0]?.id || 'doc-1');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activeDoc = documents.find(d => d.id === selectedDocId) || documents[0];

  const filteredDocs = documents.filter(d => 
    d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopyText = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const categoryLabels: Record<string, string> = {
    prompt: 'LLM Промт',
    sop: 'Регламент SOP',
    script: 'Python модуль',
    notes: 'Замітки'
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Document navigation index bar */}
        <div className={`p-5 rounded-lg border lg:col-span-1 space-y-4 h-fit ${
          currentTheme === 'light' ? 'bg-white border-slate-205' : 'bg-slate-900 border-slate-800'
        }`}>
          <div className="pb-3 border-b border-slate-800/10">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-display">
              База знань & SOP інструкції
            </h4>
            <p className="text-[10px] text-slate-400">Регламенти роботи та промти для асистентів у кабінетах</p>
          </div>

          <div className="space-y-2.5">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                onClick={() => setSelectedDocId(doc.id)}
                className={`p-3 rounded border text-xs cursor-pointer transition ${
                  selectedDocId === doc.id
                    ? 'border-indigo-500 bg-indigo-500/5'
                    : 'border-slate-800/10 hover:bg-slate-850/40'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-slate-850 dark:text-slate-100 font-display truncate max-w-40">{doc.title}</span>
                  <span className="px-1.5 py-0.5 text-[8px] rounded uppercase font-mono bg-slate-800 text-slate-400">
                    {categoryLabels[doc.category]}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-sans line-clamp-2">{doc.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Document Workspace */}
        <div className={`p-5 rounded-lg border lg:col-span-2 space-y-4 ${
          currentTheme === 'light' ? 'bg-white border-slate-210' : 'bg-slate-900 border-slate-800'
        }`}>
          <div className="pb-3 border-b border-slate-800/10 flex justify-between items-center bg-slate-950/20 px-4 py-2.5 -mx-5 -mt-5 rounded-t-lg">
            <div>
              <span className="text-[9px] font-mono text-indigo-400 uppercase tracking-widest">
                Категорія: {categoryLabels[activeDoc.category]}
              </span>
              <h3 className="text-sm font-bold font-display text-slate-900 dark:text-slate-100 mt-0.5">
                {activeDoc.title}
              </h3>
            </div>

            <button
              onClick={() => handleCopyText(activeDoc.content, activeDoc.id)}
              className="px-2.5 py-1 bg-[#3a6fcb] hover:bg-[#2b59ab] text-white rounded text-[10.5px] font-mono inline-flex items-center gap-1 cursor-pointer transition"
            >
              <Clipboard size={12} />
              <span>{copiedId === activeDoc.id ? 'Скопійовано !' : 'Копіювати текст'}</span>
            </button>
          </div>

          <div className="space-y-4 text-xs font-sans">
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-mono block">Короткий опис документа</span>
              <p className="text-slate-350 bg-slate-900/10 p-2 border border-slate-800/5 rounded mt-1 italic">
                {activeDoc.desc}
              </p>
            </div>

            <div>
              <span className="text-slate-400 text-[10px] uppercase font-mono block mb-2">Текстове тіло регламенту / Код</span>
              <div className="p-4 bg-slate-950/45 border border-slate-800 rounded font-mono text-[11px] leading-relaxed whitespace-pre-wrap select-all max-h-96 overflow-y-auto">
                {activeDoc.content}
              </div>
            </div>

            <div className="pt-2 text-right text-[9px] text-slate-500 font-mono">
              Остання редакція: {activeDoc.lastModified}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
