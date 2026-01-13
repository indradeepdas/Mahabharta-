import React from 'react';
import { StoryEpisode, Character } from '../types';
import { PlayCircle, ArrowLeft, AlertTriangle } from 'lucide-react';

interface StorySelectionProps {
  character: Character;
  stories: StoryEpisode[];
  onSelectStory: (prompt: string) => void;
  onBack: () => void;
  error?: string | null;
}

export const StorySelection: React.FC<StorySelectionProps> = ({ character, stories, onSelectStory, onBack, error }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 hover:bg-stone-200 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-stone-600" />
        </button>
        <div>
          <h2 className="text-3xl font-black text-stone-900 brand-font">Tales of {character.name}</h2>
          <p className="text-stone-500 font-medium">Select an episode to visualize</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-2 border-red-100 rounded-xl p-4 flex items-center gap-3 text-red-600 font-bold mb-6 animate-pulse">
          <AlertTriangle className="w-6 h-6" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stories.map((story, idx) => (
          <button
            key={idx}
            onClick={() => onSelectStory(story.prompt)}
            className="text-left bg-white p-6 rounded-2xl border-2 border-stone-100 hover:border-lego-blue hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group relative overflow-hidden h-full flex flex-col"
          >
            <div className="absolute top-0 right-0 w-16 h-16 bg-lego-yellow rounded-bl-full -mr-8 -mt-8 opacity-20 group-hover:opacity-100 transition-opacity"></div>
            
            <h3 className="font-bold text-lg text-stone-800 mb-2 pr-4">{story.title}</h3>
            <p className="text-sm text-stone-500 mb-4 italic leading-snug flex-grow">"{story.tagline}"</p>
            
            <div className="flex items-center gap-2 text-lego-blue font-bold text-xs uppercase tracking-wider mt-auto">
              <PlayCircle className="w-4 h-4" /> Generate Comic
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};