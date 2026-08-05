import React, { useState } from 'react';
import {
  Layers,
  Volume2,
  VolumeX,
  Radio,
  PlusCircle,
  MinusCircle,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { LayerState, KeptStemLayer, AddedSynthLayer, RemovedOriginalLayer } from '../types';

interface AiRemixLayersProps {
  genreName: string;
  layers: LayerState;
  onLayerChange: (updatedLayers: LayerState) => void;
  isProcessing?: boolean;
}

export const AiRemixLayers: React.FC<AiRemixLayersProps> = ({
  genreName,
  layers,
  onLayerChange,
  isProcessing = false,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'kept' | 'added' | 'removed'>('all');
  const [openSections, setOpenSections] = useState({
    kept: true,
    added: true,
    removed: true,
  });

  const toggleSection = (section: 'kept' | 'added' | 'removed') => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleKeptToggleMute = (id: string) => {
    const updatedKept = layers.kept.map((item) =>
      item.id === id ? { ...item, muted: !item.muted } : item
    );
    onLayerChange({ ...layers, kept: updatedKept });
  };

  const handleKeptVolume = (id: string, vol: number) => {
    const updatedKept = layers.kept.map((item) =>
      item.id === id ? { ...item, volume: vol } : item
    );
    onLayerChange({ ...layers, kept: updatedKept });
  };

  const handleAddedToggle = (id: string) => {
    const updatedAdded = layers.added.map((item) =>
      item.id === id ? { ...item, enabled: !item.enabled } : item
    );
    onLayerChange({ ...layers, added: updatedAdded });
  };

  const handleAddedVolume = (id: string, vol: number) => {
    const updatedAdded = layers.added.map((item) =>
      item.id === id ? { ...item, volume: vol } : item
    );
    onLayerChange({ ...layers, added: updatedAdded });
  };

  const handleRemovedRestore = (id: string) => {
    const updatedRemoved = layers.removed.map((item) =>
      item.id === id ? { ...item, restored: !item.restored } : item
    );
    onLayerChange({ ...layers, removed: updatedRemoved });
  };

  return (
    <div className="rounded-xl bg-[#141417] border border-[#1E1E22] p-3.5 md:p-4 shadow-lg space-y-3">
      {/* Header & Tabs */}
      <div className="flex flex-wrap items-center justify-between border-b border-gray-800/80 pb-2.5 gap-2">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-violet-600/20 border border-violet-500/30 text-violet-400">
            <Layers className="w-4 h-4 text-violet-400" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h2 className="text-sm font-extrabold text-white tracking-wide">AI Remix Layers</h2>
              <span className="px-1.5 py-0.5 rounded-md bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-[10px] font-bold uppercase">
                {genreName}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Filter Pills */}
        <div className="flex items-center space-x-1 bg-[#0E0E11] p-0.5 rounded-lg border border-gray-800 text-[10px] font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-2 py-1 rounded transition-all ${
              activeTab === 'all'
                ? 'bg-violet-600 text-white font-extrabold shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            All ({layers.kept.length + layers.added.length + layers.removed.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('kept')}
            className={`px-2 py-1 rounded transition-all ${
              activeTab === 'kept'
                ? 'bg-emerald-600 text-white font-extrabold shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Kept ({layers.kept.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('added')}
            className={`px-2 py-1 rounded transition-all ${
              activeTab === 'added'
                ? 'bg-cyan-600 text-white font-extrabold shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Added ({layers.added.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('removed')}
            className={`px-2 py-1 rounded transition-all ${
              activeTab === 'removed'
                ? 'bg-amber-600 text-white font-extrabold shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Filtered ({layers.removed.length})
          </button>
        </div>
      </div>

      {/* Accordion List View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* 1. KEPT FROM ORIGINAL */}
        {(activeTab === 'all' || activeTab === 'kept') && (
          <div className="rounded-lg bg-[#0E0E11] border border-emerald-500/30 p-2.5 space-y-2">
            <button
              type="button"
              onClick={() => toggleSection('kept')}
              className="w-full flex items-center justify-between text-emerald-400 font-extrabold text-[11px] uppercase tracking-wider pb-1.5 border-b border-gray-800/80"
            >
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>KEPT ({layers.kept.length})</span>
              </span>
              {openSections.kept ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {openSections.kept && (
              <div className="space-y-1.5">
                {layers.kept.length === 0 ? (
                  <div className="p-2 rounded bg-[#121215] text-center text-[10px] text-gray-400">
                    0 Raw Stems Kept (Cleared for Pro Remix)
                  </div>
                ) : (
                  layers.kept.map((stem: KeptStemLayer) => (
                    <div
                      key={stem.id}
                      className={`p-2 rounded-md border text-xs space-y-1 ${
                        stem.muted
                          ? 'bg-[#121215] border-gray-800 opacity-60'
                          : 'bg-[#16161C] border-gray-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-[11px] text-gray-200 truncate flex items-center space-x-1">
                          <Radio className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                          <span className="truncate">{stem.name}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => handleKeptToggleMute(stem.id)}
                          className={`px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                            stem.muted ? 'bg-rose-950 text-rose-300' : 'bg-gray-800 text-gray-400'
                          }`}
                        >
                          {stem.muted ? 'Muted' : 'Mute'}
                        </button>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={stem.volume}
                          onChange={(e) => handleKeptVolume(stem.id, parseFloat(e.target.value))}
                          disabled={stem.muted}
                          className="w-full accent-emerald-400 h-1 bg-gray-800 rounded cursor-pointer"
                        />
                        <span className="text-[9px] text-gray-400 font-mono w-6 text-right">
                          {Math.round(stem.volume * 100)}%
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* 2. AI SYNTHESIZED (ADDED) */}
        {(activeTab === 'all' || activeTab === 'added') && (
          <div className="rounded-lg bg-[#0E0E11] border border-cyan-500/30 p-2.5 space-y-2">
            <button
              type="button"
              onClick={() => toggleSection('added')}
              className="w-full flex items-center justify-between text-cyan-400 font-extrabold text-[11px] uppercase tracking-wider pb-1.5 border-b border-gray-800/80"
            >
              <span className="flex items-center space-x-1.5">
                <PlusCircle className="w-3.5 h-3.5 text-cyan-400" />
                <span>ADDED SYNTHS ({layers.added.length})</span>
              </span>
              {openSections.added ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {openSections.added && (
              <div className="space-y-1.5">
                {layers.added.map((added: AddedSynthLayer) => (
                  <div
                    key={added.id}
                    className={`p-2 rounded-md border text-xs space-y-1 ${
                      added.enabled
                        ? 'bg-cyan-950/40 border-cyan-500/40'
                        : 'bg-[#121215] border-gray-800 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-[11px] text-cyan-200 truncate flex items-center space-x-1">
                        <Sparkles className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                        <span className="truncate">{added.name}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => handleAddedToggle(added.id)}
                        className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                          added.enabled ? 'bg-cyan-400 text-black' : 'bg-gray-800 text-gray-400'
                        }`}
                      >
                        {added.enabled ? 'ON' : 'OFF'}
                      </button>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={added.volume}
                        onChange={(e) => handleAddedVolume(added.id, parseFloat(e.target.value))}
                        disabled={!added.enabled}
                        className="w-full accent-cyan-400 h-1 bg-gray-800 rounded cursor-pointer"
                      />
                      <span className="text-[9px] text-cyan-300 font-mono w-6 text-right font-bold">
                        {Math.round(added.volume * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 3. AI FILTERED OUT (REMOVED) */}
        {(activeTab === 'all' || activeTab === 'removed') && (
          <div className="rounded-lg bg-[#0E0E11] border border-amber-500/30 p-2.5 space-y-2">
            <button
              type="button"
              onClick={() => toggleSection('removed')}
              className="w-full flex items-center justify-between text-amber-400 font-extrabold text-[11px] uppercase tracking-wider pb-1.5 border-b border-gray-800/80"
            >
              <span className="flex items-center space-x-1.5">
                <MinusCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>FILTERED OUT ({layers.removed.length})</span>
              </span>
              {openSections.removed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {openSections.removed && (
              <div className="space-y-1.5">
                {layers.removed.map((removed: RemovedOriginalLayer) => (
                  <div
                    key={removed.id}
                    className={`p-2 rounded-md border text-xs flex items-center justify-between ${
                      removed.restored
                        ? 'bg-amber-950/40 border-amber-500/50 text-amber-200'
                        : 'bg-[#121215] border-gray-800 text-gray-400'
                    }`}
                  >
                    <div className="truncate pr-1">
                      <span className={`font-bold text-[11px] block truncate ${removed.restored ? 'line-through opacity-70' : 'text-gray-300'}`}>
                        {removed.name}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemovedRestore(removed.id)}
                      className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase flex items-center space-x-1 transition-all flex-shrink-0 ${
                        removed.restored
                          ? 'bg-gray-800 text-gray-300'
                          : 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-sm'
                      }`}
                    >
                      <RotateCcw className="w-2.5 h-2.5" />
                      <span>{removed.restored ? 'Re-filter' : 'Restore'}</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
