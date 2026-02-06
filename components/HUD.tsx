import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MousePosition, ChatMessage } from '../types';
import { sendMessageToSystem } from '../services/geminiService';
import { useUI } from '../context/UIContext';

interface HUDProps {
  scrollProgress: number;
  totalDepth: number;
  activeCategory?: string;
  setActiveCategory?: (category: string) => void;
}

const CATEGORIES = ['ALL', 'MEDIA', 'UX UI', 'ARCHITECTURE', 'TECHNOLOGY'];

const MANIFESTO = "The site is organised into several main categories (media, UX UI, architecture, technology). Looking at architecture from outside the boundaries of the discipline, explores different areas of investigation and reveals their underlying affinities and relationships through an approach ranging from pure curatorial practice to in-depth analysis. Its articles follow a non-linear sequence, aiming to show permanences, correspondences and anachronisms among works situated far away in time and space and, in this way, offer alternative tools for contemporary architectural research and design.";

export const HUD: React.FC<HUDProps> = ({ scrollProgress, totalDepth, activeCategory = 'ALL', setActiveCategory }) => {
  const [mousePos, setMousePos] = useState<MousePosition>({ x: 0, y: 0 });
  const [chatOpen, setChatOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'ARCHIVE ACCESSED. TYPE "install skill.sh" FOR TECH STACK.', timestamp: Date.now() }
  ]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const { viewMode, setViewMode, cursorData } = useUI();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, chatOpen]);

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || loading) return;

    const userMsg: ChatMessage = { role: 'user', text: query, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setQuery('');
    setLoading(true);

    // Easter Egg: install skill.sh
    if (query.trim().toLowerCase() === 'install skill.sh') {
        setTimeout(() => {
            const skillMsg: ChatMessage = { 
                role: 'model', 
                text: 'INSTALLING SKILLS... [DONE] > React / Next.js / Three.js / TypeScript / Rhino / Grasshopper / Unreal Engine', 
                timestamp: Date.now() 
            };
            setMessages(prev => [...prev, skillMsg]);
            setLoading(false);
        }, 800);
        return;
    }

    const response = await sendMessageToSystem(query);
    setMessages(prev => [...prev, { role: 'model', text: response, timestamp: Date.now() }]);
    setLoading(false);
  };

  const progressPercent = Math.min(100, Math.max(0, (scrollProgress / totalDepth) * 100));
  
  const isWireframe = viewMode === 'wireframe';
  const textColor = isWireframe ? 'text-white' : 'text-black';
  const borderColor = isWireframe ? 'border-white' : 'border-black';
  const bgColor = isWireframe ? 'bg-black' : 'bg-white';

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      
      {/* 1. Header & Navigation */}
      <header className="absolute top-0 left-0 w-full p-6 flex flex-col md:flex-row justify-between items-start md:items-center pointer-events-auto gap-4">
        <div>
            <h1 
                className={`font-['Rajdhani'] text-5xl font-bold ${textColor} tracking-tight uppercase leading-none cursor-pointer`}
                onClick={() => setAboutOpen(true)}
            >
              Super<span className="italic font-light">Archive</span>
            </h1>
            <div className={`flex items-center gap-2 ${textColor} opacity-60 text-xs font-mono mt-1`}>
                <div className={`w-2 h-2 ${isWireframe ? 'bg-white' : 'bg-black'}`}></div>
                <span>CONTINUOUS_MONUMENT_V1</span>
            </div>
        </div>

        {/* Category Filters */}
        {setActiveCategory && (
            <nav className="flex flex-wrap gap-4">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`
                            text-xs font-mono font-bold uppercase transition-all
                            ${activeCategory === cat 
                                ? `border-b-2 ${borderColor} opacity-100` 
                                : `${textColor} opacity-40 hover:opacity-100`}
                        `}
                    >
                        {cat}
                    </button>
                ))}
            </nav>
        )}

        {/* View Mode */}
        <div className="hidden md:flex gap-4 items-center">
            <button 
                onClick={() => setViewMode(viewMode === 'render' ? 'wireframe' : 'render')}
                className={`
                    border-2 px-4 py-1 font-mono text-xs transition-all font-bold uppercase
                    ${isWireframe 
                        ? 'border-white text-black bg-white hover:bg-black hover:text-white' 
                        : 'border-black text-black hover:bg-black hover:text-white'}
                `}
            >
                {viewMode === 'render' ? 'SWITCH TO CAD' : 'SWITCH TO RENDER'}
            </button>
        </div>
      </header>

      {/* 2. Cursor Annotation */}
      <AnimatePresence>
        {cursorData.visible && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, x: mousePos.x + 15, y: mousePos.y + 15 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0 }}
                className="fixed pointer-events-none z-[100]"
                style={{ top: 0, left: 0 }} 
            >
                <div className={`${bgColor} border-2 ${borderColor} p-3 shadow-[4px_4px_0px_rgba(0,0,0,0.2)] min-w-[150px]`}>
                    <div className={`font-mono text-[10px] ${textColor} opacity-50 mb-1 border-b ${borderColor} pb-1`}>
                        {cursorData.label || 'DATA'}
                    </div>
                    <div className={`font-['Rajdhani'] font-bold ${textColor} text-xl uppercase`}>
                        {cursorData.value}
                    </div>
                    {cursorData.subtext && (
                        <div className={`font-mono text-[9px] ${textColor} mt-1 uppercase`}>
                            {cursorData.subtext}
                        </div>
                    )}
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* 3. About Modal (Philosophy) */}
      <AnimatePresence>
          {aboutOpen && (
              <div className="fixed inset-0 z-[60] flex items-center justify-center p-8 pointer-events-auto bg-white/10 backdrop-blur-sm">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={`${bgColor} border-4 ${borderColor} max-w-2xl p-8 shadow-[10px_10px_0px_rgba(0,0,0,0.2)]`}
                  >
                      <div className="flex justify-between items-center mb-6">
                          <h2 className={`font-['Rajdhani'] text-3xl font-bold ${textColor} uppercase`}>Manifesto</h2>
                          <button onClick={() => setAboutOpen(false)} className={`text-xl font-bold ${textColor} hover:opacity-50`}>×</button>
                      </div>
                      <p className={`font-mono text-sm leading-relaxed ${textColor} text-justify`}>
                          {MANIFESTO}
                      </p>
                  </motion.div>
              </div>
          )}
      </AnimatePresence>

      {/* 4. Scroll Bar */}
      <div className={`absolute right-6 top-1/2 -translate-y-1/2 h-64 w-1 ${isWireframe ? 'bg-white/20' : 'bg-black/10'}`}>
        <motion.div 
            className={`w-full ${isWireframe ? 'bg-white' : 'bg-black'}`}
            style={{ height: `${progressPercent}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      </div>

      {/* 5. Terminal */}
      <div className="absolute bottom-6 right-6 pointer-events-auto">
        <AnimatePresence>
            {chatOpen && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className={`w-80 md:w-96 ${bgColor} border-4 ${borderColor} mb-4 shadow-[8px_8px_0px_rgba(0,0,0,0.2)]`}
                >
                     <div className={`${isWireframe ? 'bg-white/10' : 'bg-black text-white'} p-2 flex justify-between items-center`}>
                        <span className="font-mono text-xs uppercase font-bold">Terminal</span>
                        <button onClick={() => setChatOpen(false)} className="hover:opacity-50">×</button>
                    </div>
                    <div className={`h-64 overflow-y-auto p-4 space-y-3 font-mono text-xs ${textColor}`}>
                        {messages.map((m, i) => (
                            <div key={i} className={`${m.role === 'user' ? 'text-right opacity-60' : 'text-left font-bold'}`}>
                                <span className="block text-[9px] mb-0.5 uppercase">{m.role}</span>
                                <span className="block">{m.text}</span>
                            </div>
                        ))}
                        {loading && <div className="animate-pulse">_PROCESSING</div>}
                        <div ref={chatEndRef} />
                    </div>
                    <form onSubmit={handleChatSubmit} className={`border-t-2 ${borderColor} flex`}>
                        <input 
                            type="text" 
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="INPUT COMMAND..."
                            className={`flex-1 bg-transparent border-none ${textColor} text-xs font-mono p-3 focus:outline-none uppercase placeholder-opacity-40`}
                        />
                        <button type="submit" className={`${textColor} px-4 font-bold border-l-2 ${borderColor} hover:bg-gray-200 transition-colors`}>RUN</button>
                    </form>
                </motion.div>
            )}
        </AnimatePresence>
        
        <button 
            onClick={() => setChatOpen(!chatOpen)}
            className={`flex items-center gap-3 group ${bgColor} border-2 ${borderColor} px-4 py-2 hover:bg-gray-100 transition-all shadow-[4px_4px_0px_rgba(0,0,0,0.2)]`}
        >
            <div className={`w-2 h-2 ${isWireframe ? 'bg-white' : 'bg-black'} rounded-full`} />
            <span className={`font-['Rajdhani'] font-bold ${textColor} uppercase tracking-wider`}>
                {chatOpen ? 'CLOSE' : 'SYSTEM'}
            </span>
        </button>
      </div>

    </div>
  );
};
