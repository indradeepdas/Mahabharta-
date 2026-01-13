import React from 'react';
import { Character } from '../types';
import { Shield, Sword, Crown, Zap, User, BookOpen } from 'lucide-react';

interface CharacterGridProps {
  characters: Character[];
  onSelect: (char: Character) => void;
}

export const CharacterGrid: React.FC<CharacterGridProps> = ({ characters, onSelect }) => {
  if (characters.length === 0) {
    return (
      <div className="text-center py-20 bg-stone-100 rounded-3xl border-2 border-dashed border-stone-200">
        <BookOpen className="w-12 h-12 text-stone-300 mx-auto mb-4" />
        <p className="text-stone-400 font-bold uppercase tracking-widest">No Characters Discovered Yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
      {characters.map((char) => (
        <button
          key={char.id}
          onClick={() => onSelect(char)}
          className={`group relative h-72 rounded-3xl border-4 border-white shadow-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:-rotate-1 ${char.color || 'bg-stone-200'}`}
        >
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-black to-transparent"></div>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-inner mb-4 group-hover:scale-110 transition-transform">
               <User className="w-12 h-12 text-stone-400" />
            </div>
            
            <h3 className="text-2xl font-black text-stone-900 brand-font uppercase tracking-tight text-center">{char.name}</h3>
            <div className="mt-2 px-3 py-1 bg-white/50 backdrop-blur-sm rounded-full text-[10px] font-black text-stone-700 uppercase tracking-widest border border-white/50">
              {char.role}
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-14 bg-stone-900/10 backdrop-blur-md flex flex-col items-center justify-center border-t border-white/20">
             <div className="text-[10px] font-black text-stone-600 uppercase tracking-widest">{char.storyCount} STORIES INDEXED</div>
             <div className="flex gap-4 mt-1 opacity-40">
                <Sword className="w-3 h-3" />
                <Shield className="w-3 h-3" />
                <Zap className="w-3 h-3" />
             </div>
          </div>
        </button>
      ))}
    </div>
  );
};