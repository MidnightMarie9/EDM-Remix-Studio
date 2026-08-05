import React, { useState } from 'react';
import { AiAnalysis, GenreType, TrackMetadata } from '../types';
import { Bot, Sparkles, Send, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

interface AiProducerPanelProps {
  trackMeta: TrackMetadata | null;
  activeGenre: GenreType;
  analysis: AiAnalysis | null;
  onFetchAnalysis: (customPrompt?: string) => void;
  isLoading: boolean;
}

export const AiProducerPanel: React.FC<AiProducerPanelProps> = ({
  trackMeta,
  activeGenre,
  analysis,
  onFetchAnalysis,
  isLoading,
}) => {
  const [userPrompt, setUserPrompt] = useState('');
  const [isExpanded, setIsExpanded] = useState(false); // Collapsed by default to save space

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFetchAnalysis(userPrompt);
  };

  const previewAdvice = analysis?.advice
    ? `${analysis.advice.slice(0, 75)}...`
    : `AI Strategy ready for ${activeGenre}-style banger...`;

  return (
    <div id="ai-producer-assistant-section" className="bg-[#141417] border border-[#1E1E22] rounded-xl p-3 md:p-3.5 shadow-lg space-y-2.5">
      {/* Collapsible Header with Strategy Preview */}
      <div
        className="flex items-center justify-between cursor-pointer select-none"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-2.5 truncate pr-2">
          <div className="p-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-cyan-500 flex-shrink-0">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div className="truncate">
            <div className="flex items-center space-x-2">
              <h3 className="text-xs font-extrabold text-white tracking-wide flex-shrink-0">AI Producer Assistant</h3>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 font-bold hidden sm:inline">
                Gemini 3.6 Flash
              </span>
            </div>
            <p className="text-[11px] text-cyan-300 truncate mt-0.5 font-medium">
              <Sparkles className="w-3 h-3 text-cyan-400 inline mr-1" />
              <span>Remix Strategy: {previewAdvice}</span>
            </p>
          </div>
        </div>

        <button
          type="button"
          className="text-gray-400 hover:text-white p-1 flex-shrink-0 flex items-center space-x-1 text-xs font-bold"
        >
          <span>{isExpanded ? 'Collapse' : 'Expand'}</span>
          {isExpanded ? <ChevronUp className="w-4 h-4 text-cyan-400" /> : <ChevronDown className="w-4 h-4 text-cyan-400" />}
        </button>
      </div>

      {isExpanded && (
        <div className="pt-2 border-t border-gray-800/80 space-y-2.5 text-xs">
          {/* Analysis Output Card */}
          {analysis && (
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-[#0E0E11] border border-violet-500/30 text-gray-200">
                <p className="font-bold text-violet-300 mb-1 flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Production & Mixing Advice:</span>
                </p>
                <p className="text-gray-300 leading-relaxed text-xs">{analysis.advice}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 rounded-lg bg-[#0E0E11] border border-[#2A2A2E]">
                  <span className="text-gray-400 text-[9px] uppercase font-bold block">Target BPM:</span>
                  <span className="text-xs font-bold text-cyan-400 font-mono">
                    {analysis.recommendedBpm} BPM
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-[#0E0E11] border border-[#2A2A2E]">
                  <span className="text-gray-400 text-[9px] uppercase font-bold block">Genre Preset:</span>
                  <span className="text-xs font-bold text-violet-300 capitalize">
                    {activeGenre}
                  </span>
                </div>
              </div>

              {analysis.keyElements && analysis.keyElements.length > 0 && (
                <div className="p-2 rounded-lg bg-[#0E0E11] border border-[#2A2A2E]">
                  <span className="text-gray-400 text-[9px] uppercase font-bold block mb-1">Key Production Elements:</span>
                  <div className="flex flex-wrap gap-1">
                    {analysis.keyElements.map((elem, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded bg-violet-950/80 border border-violet-500/30 text-violet-300 text-[10px] font-bold"
                      >
                        <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                        <span>{elem}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Prompt Form */}
          <form onSubmit={handleSubmit} className="flex items-center space-x-2 pt-1">
            <input
              type="text"
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder="e.g. Add aggressive 303 acid line & heavy sidechain..."
              className="flex-1 px-3 py-1.5 rounded-lg bg-[#0A0A0B] border border-gray-800 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-cyan-400"
            />
            <button
              id="ask-ai-producer-btn"
              type="submit"
              disabled={isLoading}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-extrabold text-xs uppercase tracking-wider flex items-center space-x-1 shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-3 h-3" />
                  <span>Ask AI</span>
                </>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
