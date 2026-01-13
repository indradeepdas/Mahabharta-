import React, { useState } from 'react';
import { StoryPanel } from '../types';
import { RefreshCw, Edit2, Image as ImageIcon, AlertCircle } from 'lucide-react';

interface PanelCardProps {
  panel: StoryPanel;
  onRegenerateImage: (id: string, newPrompt: string) => void;
}

export const PanelCard: React.FC<PanelCardProps> = ({ panel, onRegenerateImage }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [promptText, setPromptText] = useState(panel.visualDescription);

  const handleRegenerate = () => {
    setIsEditing(false);
    onRegenerateImage(panel.id, promptText);
  };

  return (
    <div className="flex flex-col h-full w-full bg-white relative group">
      {/* Header - Transparent overlay or solid? Let's make it solid for readability */}
      <div className="bg-white px-6 py-4 border-b border-stone-100 flex justify-between items-center shrink-0">
        <h3 className="font-bold text-stone-800 brand-font truncate text-xl">{panel.title}</h3>
        <span className="text-[10px] font-black text-white bg-stone-300 px-2 py-1 rounded-full uppercase tracking-wider">
          {panel.sourceReference.replace("Page", "PG")}
        </span>
      </div>

      {/* Image Area - Flexible Height */}
      <div className="relative flex-grow bg-stone-100 flex items-center justify-center overflow-hidden min-h-0">
        {panel.isLoadingImage ? (
          <div className="flex flex-col items-center animate-pulse text-stone-400">
            <RefreshCw className="w-12 h-12 animate-spin mb-4 text-lego-blue" />
            <span className="text-sm font-bold uppercase tracking-widest">Painting Scene...</span>
          </div>
        ) : panel.imageUrl ? (
          <img 
            src={panel.imageUrl} 
            alt={panel.visualDescription}
            className="w-full h-full object-contain bg-stone-900 animate-fade-in" 
          />
        ) : (
          <div className="text-stone-400 flex flex-col items-center p-6 text-center">
            <AlertCircle className="w-10 h-10 mb-3 opacity-30" />
            <span className="text-sm font-bold">Image unavailable</span>
          </div>
        )}
        
        {/* Quick Regen Button Overlay */}
        {!panel.isLoadingImage && (
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="absolute top-4 right-4 bg-white/90 hover:bg-lego-yellow text-stone-800 p-3 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 z-10"
            title="Edit Prompt"
          >
            <Edit2 className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Content Area */}
      <div className="p-6 shrink-0 bg-white relative border-t border-stone-100">
        {/* Decorative arrow pointing up to image */}
        <div className="absolute top-0 left-10 w-4 h-4 bg-white border-t border-l border-stone-100 transform -translate-y-1/2 rotate-45 z-10"></div>
        
        <div className="mb-4">
          <p className="font-medium text-lg md:text-xl leading-relaxed text-stone-800 text-center font-serif italic">
            "{panel.narration}"
          </p>
        </div>

        {/* Edit Prompt Section */}
        {isEditing ? (
          <div className="mt-4 animate-in slide-in-from-bottom-2 fade-in bg-stone-50 p-4 rounded-xl border border-stone-200 shadow-inner">
            <label className="text-[10px] font-black text-stone-400 uppercase tracking-wider mb-2 block">Visual Prompt</label>
            <textarea
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              className="w-full text-sm p-3 border-2 border-stone-200 rounded-lg bg-white focus:border-lego-blue focus:ring-0 outline-none mb-3 font-medium"
              rows={3}
            />
            <div className="flex gap-3">
              <button 
                onClick={handleRegenerate}
                disabled={panel.isLoadingImage}
                className="flex-1 bg-lego-blue text-white text-sm font-bold py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 transition-colors"
              >
                <RefreshCw className="w-4 h-4" /> Redraw
              </button>
              <button 
                onClick={() => setIsEditing(false)}
                className="px-6 py-3 text-sm font-bold text-stone-500 hover:bg-stone-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-center pt-2">
             <button 
                onClick={() => setIsEditing(true)}
                className="text-xs font-bold text-stone-300 hover:text-lego-blue flex items-center gap-1.5 transition-colors uppercase tracking-wide"
              >
                <ImageIcon className="w-3 h-3" /> Tweak Art
              </button>
          </div>
        )}
      </div>
    </div>
  );
};