import React from 'react';
import { Scroll, Sword, Crown, Sparkles, BookOpen } from 'lucide-react';

interface SceneSelectorProps {
  onSelect: (prompt: string) => void;
  disabled: boolean;
}

const SUGGESTIONS = [
  { text: "Bhishma's Terrible Vow", icon: <Scroll className="w-4 h-4" />, category: "Origins", color: "bg-orange-100 text-orange-600 border-orange-200" },
  { text: "The Game of Dice", icon: <Crown className="w-4 h-4" />, category: "Turning Point", color: "bg-red-100 text-red-600 border-red-200" },
  { text: "Draupadi's Swayamvara", icon: <Sparkles className="w-4 h-4" />, category: "Romance", color: "bg-pink-100 text-pink-600 border-pink-200" },
  { text: "Arjuna and the Fish Eye", icon: <Sword className="w-4 h-4" />, category: "Skill", color: "bg-blue-100 text-blue-600 border-blue-200" },
  { text: "Krishna Reveals the Gita", icon: <BookOpen className="w-4 h-4" />, category: "Divine", color: "bg-purple-100 text-purple-600 border-purple-200" },
  { text: "Abhimanyu in the Chakravyuha", icon: <Sword className="w-4 h-4" />, category: "Battle", color: "bg-stone-100 text-stone-600 border-stone-200" },
  { text: "Karna gives his Armor", icon: <Crown className="w-4 h-4" />, category: "Sacrifice", color: "bg-yellow-100 text-yellow-600 border-yellow-200" },
];

export const SceneSelector: React.FC<SceneSelectorProps> = ({ onSelect, disabled }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xs font-black text-stone-400 uppercase tracking-wider flex items-center gap-2 px-1">
        <Sparkles className="w-4 h-4 text-lego-yellow" />
        Suggested Episodes
      </h3>
      <div className="grid grid-cols-1 gap-3">
        {SUGGESTIONS.map((item, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(item.text)}
            disabled={disabled}
            className={`flex items-center gap-4 p-4 text-left bg-white border-2 rounded-2xl hover:shadow-md transition-all group disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-95 ${item.color} border-transparent hover:border-current`}
          >
            <div className={`p-2 rounded-full bg-white/50 backdrop-blur-sm shadow-sm`}>
              {item.icon}
            </div>
            <div>
              <div className="font-bold text-stone-800 text-sm">{item.text}</div>
              <div className="text-[10px] font-bold uppercase opacity-60 mt-0.5">{item.category}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};