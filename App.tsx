import React, { useState, useRef } from 'react';
import { extractTextFromPDF } from './utils/pdfHelper';
import { generateStoryboardPlan, generatePanelImage, performFullBookDiscovery } from './services/geminiService';
import { StoryboardState, AppState, StoryPanel, Character, CharacterStories } from './types';
import { PanelCard } from './components/PanelCard';
import { CharacterGrid } from './components/CharacterGrid';
import { StorySelection } from './components/StorySelection';
import { IndexingScreen } from './components/IndexingScreen';
import { Hero } from './components/Hero';
import { Upload, Loader2, Download, BookOpen, AlertTriangle, FileText, LayoutGrid } from 'lucide-react';
import html2canvas from 'html2canvas';

const DEMO_CONTEXT = `
[Summary of Key Events for Demo]
The Mahabharata is an ancient Indian epic.
Key Characters: Bhishma (Patriarch), Arjuna (Hero/Archer), Krishna (Divine Guide), Duryodhana (Antagonist), Draupadi (Queen).
Major Events:
1. Bhishma's Vow: Devavrata takes a vow of lifelong celibacy to allow his father Shantanu to marry Satyavati. He becomes Bhishma.
2. The Game of Dice: Shakuni and Duryodhana cheat the Pandavas. Yudhishthira loses his kingdom and brothers. Draupadi is humiliated.
3. Exile: The Pandavas spend 12 years in forests and 1 year incognito (Agyatavasa).
4. Bhagavad Gita: On the battlefield of Kurukshetra, Arjuna falters. Krishna teaches him duty (Dharma).
5. The War: An 18-day battle destroys the Kuru lineage. The Pandavas win but at great cost.
`;

const App = () => {
  const [state, setState] = useState<StoryboardState>({
    panels: [],
    sceneDescription: '',
    bookContext: null,
    isProcessing: false,
    error: null,
    selectedCharacterId: undefined,
    characterIndex: {},
    discoveryProgress: 0
  });
  
  const [appMode, setAppMode] = useState<AppState>(AppState.HERO);
  const storyboardRef = useRef<HTMLDivElement>(null);

  const startDiscovery = async (context: string) => {
    setState(prev => ({ ...prev, bookContext: context, isProcessing: true }));
    setAppMode(AppState.INDEXING);

    try {
      const result = await performFullBookDiscovery(context);
      
      // Fixed: Properly typed the index object for discovery results.
      const newIndex: Record<string, CharacterStories> = {};
      result.characters.forEach(char => {
        newIndex[char.id] = {
          character: {
            id: char.id,
            name: char.name,
            role: char.role,
            color: char.color,
            storyCount: char.stories.length
          },
          stories: char.stories
        };
      });

      setState(prev => ({ 
        ...prev, 
        characterIndex: newIndex, 
        isProcessing: false 
      }));
      setAppMode(AppState.CHARACTER_SELECT);
    } catch (err) {
      setState(prev => ({ ...prev, isProcessing: false, error: "Indexing failed. Try again." }));
      setAppMode(AppState.UPLOAD);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await extractTextFromPDF(file);
      await startDiscovery(text);
    } catch (err: any) {
      setState(prev => ({ ...prev, error: err.message || "Failed to read PDF." }));
    }
  };

  const handleGenerateStoryboard = async (prompt: string) => {
    if (!state.bookContext) return;
    setState(prev => ({ ...prev, isProcessing: true, sceneDescription: prompt, error: null }));
    setAppMode(AppState.GENERATING);

    try {
      const result = await generateStoryboardPlan(state.bookContext, prompt);
      if (!result.panels || result.panels.length === 0) {
        throw new Error("No panels generated");
      }
      const initialPanels: StoryPanel[] = result.panels.map((p, idx) => ({
        ...p,
        id: `panel-${Date.now()}-${idx}`,
        isLoadingImage: true
      }));

      setState(prev => ({ ...prev, panels: initialPanels, isProcessing: false }));
      setAppMode(AppState.VIEW);

      initialPanels.forEach((panel) => {
        handleGeneratePanelImage(panel.id, panel.visualDescription);
      });
    } catch (err) {
      setAppMode(AppState.STORY_SELECT);
    }
  };

  const handleGeneratePanelImage = async (panelId: string, visualPrompt: string) => {
    try {
      const imageUrl = await generatePanelImage(visualPrompt);
      setState(prev => ({
        ...prev,
        panels: prev.panels.map(p => 
          p.id === panelId ? { ...p, imageUrl: imageUrl || undefined, isLoadingImage: false } : p
        )
      }));
    } catch (err) {
       setState(prev => ({
        ...prev,
        panels: prev.panels.map(p => p.id === panelId ? { ...p, isLoadingImage: false } : p)
      }));
    }
  };

  const handleDownloadPNG = async () => {
    if (storyboardRef.current) {
      const canvas = await html2canvas(storyboardRef.current, { scale: 2 });
      const link = document.createElement('a');
      link.download = `mahabharata-${state.sceneDescription.slice(0, 20)}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  // Fixed: Use Object.keys to avoid the 'unknown' type error when mapping values in some TS environments.
  const characters = Object.keys(state.characterIndex).map(id => state.characterIndex[id].character);
  const selectedStories = state.selectedCharacterId ? state.characterIndex[state.selectedCharacterId]?.stories : [];
  const selectedCharacter = state.selectedCharacterId ? state.characterIndex[state.selectedCharacterId]?.character : undefined;

  return (
    <div className="h-screen flex flex-col font-sans text-stone-900 bg-[#F8F8F8] overflow-hidden">
      
      {appMode !== AppState.HERO && appMode !== AppState.INDEXING && (
        <header className="bg-lego-yellow border-b-4 border-yellow-500 p-3 shrink-0 z-50 shadow-md">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setAppMode(AppState.HERO)}>
              <div className="bg-lego-red text-white p-1.5 rounded-md shadow-sm">
                <BookOpen className="w-5 h-5" />
              </div>
              <h1 className="text-xl font-black tracking-tight text-stone-900 brand-font">Mahabharata Storyboard</h1>
            </div>
            {appMode !== AppState.CHARACTER_SELECT && (
                <button 
                  onClick={() => setAppMode(AppState.CHARACTER_SELECT)}
                  className="flex items-center gap-2 text-xs font-bold bg-white text-stone-900 px-3 py-2 rounded-full border-2 border-transparent hover:border-lego-blue"
                >
                  <LayoutGrid className="w-3 h-3" /> Change Character
                </button>
            )}
          </div>
        </header>
      )}

      <main className={`flex-grow overflow-y-auto scrollbar-hide ${appMode !== AppState.VIEW && appMode !== AppState.GENERATING ? 'container mx-auto p-4 md:p-8' : ''}`}>
        
        {appMode === AppState.HERO && <Hero onStart={() => setAppMode(AppState.UPLOAD)} />}

        {appMode === AppState.UPLOAD && (
          <div className="flex flex-col items-center justify-center min-h-[70vh] animate-fade-in">
            <div className="bg-white p-10 rounded-3xl card-shadow max-w-xl w-full text-center border-b-8 border-lego-blue">
              <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Upload className="w-10 h-10 text-lego-blue" />
              </div>
              <h2 className="text-3xl font-black text-stone-900 mb-3 brand-font">Load The Epic</h2>
              <p className="text-stone-500 mb-8 font-medium">Select a PDF to begin the one-time indexing process.</p>
              
              <label className="block w-full group cursor-pointer mb-4">
                <input type="file" accept=".pdf" onChange={handleFileUpload} className="hidden" />
                <div className="bg-lego-red text-white py-5 px-8 rounded-2xl font-black text-lg transition-all transform hover:scale-[1.02] shadow-xl">
                  {state.isProcessing ? "INITIALIZING SCRIBE..." : "UPLOAD PDF FILE"}
                </div>
              </label>

              <button onClick={() => startDiscovery(DEMO_CONTEXT)} className="w-full py-4 text-stone-500 font-bold hover:text-stone-800 transition-colors">
                Or use Pre-loaded Demo
              </button>

              {state.error && <div className="mt-4 text-red-600 font-bold text-sm bg-red-50 p-3 rounded-xl border border-red-100">{state.error}</div>}
            </div>
          </div>
        )}

        {appMode === AppState.INDEXING && <IndexingScreen />}

        {appMode === AppState.CHARACTER_SELECT && (
          <div className="animate-fade-in">
            <h2 className="text-center text-4xl font-black text-stone-900 brand-font mb-2">Discovered Cast</h2>
            <p className="text-center text-stone-500 font-medium mb-10">We found these characters in your text. Select one to see their stories.</p>
            <CharacterGrid 
              characters={characters} 
              onSelect={(char) => {
                setState(prev => ({ ...prev, selectedCharacterId: char.id }));
                setAppMode(AppState.STORY_SELECT);
              }} 
            />
          </div>
        )}

        {appMode === AppState.STORY_SELECT && selectedCharacter && (
          <StorySelection 
            character={selectedCharacter}
            stories={selectedStories}
            onSelectStory={handleGenerateStoryboard}
            onBack={() => setAppMode(AppState.CHARACTER_SELECT)}
          />
        )}

        {(appMode === AppState.VIEW || appMode === AppState.GENERATING) && (
          <div className="flex flex-col h-full relative bg-stone-100">
            {appMode === AppState.GENERATING && (
                <div className="absolute inset-0 bg-white/90 backdrop-blur-md z-30 flex flex-col items-center justify-center">
                   <Loader2 className="w-12 h-12 text-lego-blue animate-spin mb-4" />
                   <h3 className="text-2xl font-black brand-font">Drawing Comic...</h3>
                </div>
            )}
            
            <div className="absolute top-0 left-0 right-0 z-20 p-4 pointer-events-none">
                 <div className="inline-block bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-sm border border-white/50 pointer-events-auto">
                     <h2 className="text-lg font-black text-stone-900 brand-font">{state.sceneDescription}</h2>
                 </div>
            </div>

            <div ref={storyboardRef} className="h-full overflow-y-auto snap-y snap-mandatory scroll-smooth">
              {state.panels.map((panel, index) => (
                <section key={panel.id} className="w-full h-full min-h-screen snap-start flex flex-col items-center justify-center p-4 md:p-8 relative">
                   <div className="w-full max-w-3xl h-full flex flex-col shadow-2xl rounded-xl overflow-hidden bg-white">
                     <PanelCard panel={panel} onRegenerateImage={handleGeneratePanelImage} />
                   </div>
                   <div className="absolute bottom-4 right-6 text-xs font-black text-stone-400">{index + 1} / {state.panels.length}</div>
                </section>
              ))}
              <div className="snap-start w-full h-[60vh] flex flex-col items-center justify-center bg-stone-900 text-white p-8 text-center gap-6">
                  <h3 className="text-4xl font-black brand-font">The Chapter Ends</h3>
                  <div className="flex gap-4">
                     <button onClick={() => setAppMode(AppState.STORY_SELECT)} className="px-8 py-3 bg-lego-yellow text-stone-900 rounded-full font-black">Read More</button>
                     <button onClick={handleDownloadPNG} className="px-8 py-3 border-2 border-white text-white rounded-full font-black">Save Comic</button>
                  </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;