import React from 'react';
import { Play, Star, Zap, BookOpen } from 'lucide-react';

interface HeroProps {
  onStart: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStart }) => {
  return (
    <div className="min-h-[90vh] flex flex-col items-center justify-center bg-[#F8F8F8] overflow-hidden relative">
      
      {/* Abstract Background Shapes (Lego Bricks concept) */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-lego-yellow rounded-full blur-3xl opacity-50 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-lego-blue rounded-full blur-3xl opacity-50 animate-pulse delay-700"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white rounded-full opacity-40 blur-3xl"></div>

      {/* Main Container */}
      <div className="container mx-auto px-4 z-10 text-center">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-lego-yellow text-stone-900 px-4 py-1.5 rounded-full font-black uppercase tracking-wider text-xs mb-8 shadow-md transform rotate-2 hover:rotate-0 transition-transform cursor-default">
          <Star className="w-4 h-4" />
          <span>The Epic Comes Alive</span>
          <Star className="w-4 h-4" />
        </div>

        {/* Hero Title */}
        <h1 className="text-5xl md:text-7xl font-black text-stone-900 brand-font mb-6 leading-tight drop-shadow-sm">
          Visualize the <br/>
          <span className="text-lego-red relative inline-block">
            Mahabharata
            <svg className="absolute w-full h-3 -bottom-1 left-0 text-lego-yellow opacity-50" viewBox="0 0 100 10" preserveAspectRatio="none">
              <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
            </svg>
          </span>
        </h1>

        <p className="text-xl text-stone-500 font-bold max-w-2xl mx-auto mb-10 leading-relaxed">
          Turn ancient verses into stunning comic strips instantly. Grounded in authentic text, powered by AI imagination.
        </p>

        {/* CTA Button */}
        <button 
          onClick={onStart}
          className="group relative inline-flex items-center justify-center gap-3 bg-lego-blue text-white text-xl font-black px-10 py-5 rounded-full shadow-xl hover:bg-blue-600 transition-all transform hover:scale-105 active:scale-95 hover:shadow-2xl overflow-hidden"
        >
          <span className="relative z-10 flex items-center gap-2">
            Start Creating <Play className="w-6 h-6 fill-current" />
          </span>
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-full"></div>
        </button>

        {/* Feature Teasers (Cards) */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Feature 1 */}
          <div className="bg-white p-6 rounded-3xl card-shadow border-b-8 border-lego-red transform hover:-translate-y-2 transition-transform">
            <div className="w-14 h-14 bg-red-100 text-lego-red rounded-2xl flex items-center justify-center mb-4 mx-auto">
              <BookOpen className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-stone-900 mb-2 brand-font">Fully Grounded</h3>
            <p className="text-stone-500 font-medium text-sm">Strict adherence to the uploaded PDF. No hallucinations, just the epic as it was written.</p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-6 rounded-3xl card-shadow border-b-8 border-lego-yellow transform hover:-translate-y-2 transition-transform md:-mt-8">
            <div className="w-14 h-14 bg-yellow-100 text-yellow-600 rounded-2xl flex items-center justify-center mb-4 mx-auto">
              <Zap className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-stone-900 mb-2 brand-font">Instant Comics</h3>
            <p className="text-stone-500 font-medium text-sm">Generate panels, dialogue, and consistent characters in seconds using Gemini AI.</p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-6 rounded-3xl card-shadow border-b-8 border-lego-blue transform hover:-translate-y-2 transition-transform">
             <div className="w-14 h-14 bg-blue-100 text-lego-blue rounded-2xl flex items-center justify-center mb-4 mx-auto">
              <Star className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-stone-900 mb-2 brand-font">Visual Magic</h3>
            <p className="text-stone-500 font-medium text-sm">Vivid, authentic Indian-style line art that respects the cultural heritage of the epic.</p>
          </div>
        </div>

      </div>
    </div>
  );
};