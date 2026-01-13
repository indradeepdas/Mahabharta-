import React from 'react';
import { Loader2, BookOpen, PenTool, Search } from 'lucide-react';

export const IndexingScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] animate-fade-in text-center px-4">
      <div className="relative mb-12">
        <div className="w-32 h-32 bg-lego-yellow/20 rounded-full animate-ping absolute inset-0"></div>
        <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-2xl relative z-10 border-4 border-lego-yellow">
          <BookOpen className="w-16 h-16 text-stone-800" />
        </div>
      </div>
      
      <h2 className="text-4xl font-black text-stone-900 brand-font mb-4">Indexing the Epic</h2>
      <p className="text-stone-500 max-w-md font-medium text-lg leading-relaxed">
        Our AI Scribe is reading your text, identifying the heroes, and mapping out their legendary arcs. 
        <br/><span className="text-lego-blue font-bold">This only happens once.</span>
      </p>

      <div className="mt-12 space-y-4 w-full max-w-xs">
        <div className="flex items-center gap-3 text-stone-400 font-bold text-sm uppercase tracking-widest animate-pulse">
           <Search className="w-4 h-4" /> Scanning Lineage...
        </div>
        <div className="flex items-center gap-3 text-lego-blue font-bold text-sm uppercase tracking-widest">
           <PenTool className="w-4 h-4" /> Ink is Drying...
        </div>
        <div className="w-full bg-stone-200 h-3 rounded-full overflow-hidden shadow-inner">
           <div className="bg-lego-blue h-full w-2/3 animate-[progress_3s_infinite] rounded-full"></div>
        </div>
      </div>
    </div>
  );
};