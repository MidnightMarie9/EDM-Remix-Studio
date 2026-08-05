import React from 'react';
import {
  Mic,
  Sparkles,
  Wand2,
  Volume2,
  Music2,
  Repeat,
  Zap,
  Radio,
  SlidersHorizontal,
  CheckCircle2,
  Bot,
} from 'lucide-react';
import { VocalSettings, VocalMode } from '../types';

interface VocalMagicStudioProps {
  vocalSettings: VocalSettings;
  onChange: (updatedSettings: VocalSettings) => void;
  onApply: () => void;
  isProcessing?: boolean;
}

const VOCAL_MODES: { id: VocalMode; label: string; tag: string }[] = [
  { id: 'chop_hook', label: 'Chop & Repeat Hook', tag: 'Catchy 4-bar phrase loop' },
  { id: 'stutter_edit', label: 'Stutter Edit', tag: 'Micro 1/16th note stutters' },
  { id: 'pitched_chop', label: 'Pitched Chop', tag: 'Pitch-bent instrument leads' },
  { id: 'keep_original', label: 'Keep Original', tag: 'Auto-tuned raw lead vocal' },
  { id: 'minimal_instrumental', label: 'Minimal / Instrumental', tag: 'Atmospheric ad-libs only' },
];

const PITCH_KEYS = [
  'A Minor',
  'C Major',
  'F Minor',
  'G Minor',
  'D Minor',
  'E Minor',
  'F# Minor',
  'A# Minor',
];

export const VocalMagicStudio: React.FC<VocalMagicStudioProps> = ({
  vocalSettings,
  onChange,
  onApply,
  isProcessing = false,
}) => {
  const handleModeChange = (mode: VocalMode) => {
    onChange({ ...vocalSettings, mode });
  };

  const handleStrengthChange = (val: number) => {
    onChange({ ...vocalSettings, fixStrength: val });
  };

  const handleAdLibsToggle = () => {
    onChange({ ...vocalSettings, addAdLibs: !vocalSettings.addAdLibs });
  };

  const handleHookDropToggle = () => {
    onChange({ ...vocalSettings, repeatHookOnDrop: !vocalSettings.repeatHookOnDrop });
  };

  const handleVolumeChange = (vol: number) => {
    onChange({ ...vocalSettings, volume: vol });
  };

  const handleReverbChange = (rev: number) => {
    onChange({ ...vocalSettings, reverbDelay: rev });
  };

  const handleKeyChange = (pitchKey: string) => {
    onChange({ ...vocalSettings, pitchKey });
  };

  return (
    <div
      id="vocal-magic-studio-panel"
      className="rounded-xl bg-[#141417] border border-[#1E1E22] p-3.5 md:p-4 shadow-lg space-y-3"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-800/80 pb-2.5 gap-2">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-cyan-600/20 border border-cyan-500/30 text-cyan-400">
            <Mic className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h2 className="text-sm font-extrabold text-white tracking-wide">
                Vocal Magic Studio
              </h2>
              <span className="px-1.5 py-0.5 rounded-md bg-cyan-950 border border-cyan-500/30 text-cyan-300 text-[10px] font-bold uppercase">
                AI Engine
              </span>
            </div>
          </div>
        </div>

        <button
          id="rebuild-vocals-btn"
          type="button"
          onClick={onApply}
          disabled={isProcessing}
          className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white font-extrabold text-[11px] uppercase tracking-wider transition-all shadow-sm flex items-center space-x-1 disabled:opacity-50 cursor-pointer"
        >
          <Wand2 className="w-3.5 h-3.5 text-cyan-200" />
          <span>{isProcessing ? 'Rendering...' : 'Re-Mix Vocals'}</span>
        </button>
      </div>

      {/* ROW 1: MASTER PRO REPLACE TOGGLE & REPLACEMENT MODE */}
      <div className="p-2.5 rounded-lg bg-[#0E0E11] border border-cyan-500/30 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-md bg-cyan-500/20 text-cyan-300">
              <Wand2 className="w-3.5 h-3.5 text-cyan-300" />
            </div>
            <span className="text-xs font-extrabold text-white">
              Pro Mode: Replace Bad Vocals
            </span>
          </div>

          <button
            id="auto-rebuild-vocal-toggle"
            type="button"
            onClick={() =>
              onChange({
                ...vocalSettings,
                autoRebuildVocals: vocalSettings.autoRebuildVocals === false ? true : false,
              })
            }
            className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase transition-all cursor-pointer flex items-center space-x-1 ${
              vocalSettings.autoRebuildVocals !== false
                ? 'bg-cyan-500 text-black shadow-sm font-black'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <CheckCircle2 className="w-3 h-3" />
            <span>{vocalSettings.autoRebuildVocals !== false ? 'ON (Auto-Replace)' : 'OFF (Keep Raw)'}</span>
          </button>
        </div>

        {vocalSettings.autoRebuildVocals !== false && (
          <div className="pt-1.5 border-t border-gray-800/80 flex items-center justify-between gap-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center space-x-1">
              <Bot className="w-3 h-3 text-violet-400" />
              <span>If Removed, Replace With:</span>
            </span>

            <div className="grid grid-cols-3 gap-1 bg-[#141418] p-0.5 rounded-lg border border-gray-800">
              <button
                type="button"
                onClick={() => onChange({ ...vocalSettings, replaceMode: 'vocal_chops' })}
                className={`px-2 py-0.5 rounded text-[10px] font-extrabold transition-all text-center ${
                  (vocalSettings.replaceMode || 'vocal_chops') === 'vocal_chops'
                    ? 'bg-cyan-500 text-black font-black'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Pitched Chops
              </button>

              <button
                type="button"
                onClick={() => onChange({ ...vocalSettings, replaceMode: 'synthetic_voice' })}
                className={`px-2 py-0.5 rounded text-[10px] font-extrabold transition-all text-center ${
                  vocalSettings.replaceMode === 'synthetic_voice'
                    ? 'bg-violet-500 text-white font-black'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                AI Voice
              </button>

              <button
                type="button"
                onClick={() => onChange({ ...vocalSettings, replaceMode: 'instrumental_only' })}
                className={`px-2 py-0.5 rounded text-[10px] font-extrabold transition-all text-center ${
                  vocalSettings.replaceMode === 'instrumental_only'
                    ? 'bg-amber-500 text-black font-black'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Instrumental
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ROW 2: 5 VOCAL MODES AS COMPACT PILLS */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-400 flex items-center space-x-1">
          <Music2 className="w-3 h-3 text-cyan-400" />
          <span>Vocal Mode (5 Options)</span>
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
          {VOCAL_MODES.map((mode) => {
            const isSelected = vocalSettings.mode === mode.id;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => handleModeChange(mode.id)}
                className={`p-2 rounded-lg border text-left transition-all ${
                  isSelected
                    ? 'bg-cyan-950/80 border-cyan-400 text-white ring-1 ring-cyan-400/40'
                    : 'bg-[#0E0E11] border-[#2A2A2E] text-gray-400 hover:text-gray-200'
                }`}
              >
                <div className="text-[11px] font-extrabold truncate text-white flex items-center space-x-1">
                  {isSelected && <Sparkles className="w-2.5 h-2.5 text-cyan-400 flex-shrink-0" />}
                  <span className="truncate">{mode.label}</span>
                </div>
                <div className="text-[9px] text-gray-500 truncate">{mode.tag}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ROW 3: VOCAL FIX STRENGTH & PERFORMANCE CONTROLS */}
      <div className="p-2.5 rounded-lg bg-[#0E0E11] border border-[#2A2A2E] space-y-2">
        <div className="flex items-center justify-between text-xs">
          <label className="font-extrabold text-white flex items-center space-x-1">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Fix Strength: {vocalSettings.fixStrength}%</span>
          </label>
          <span className="text-[10px] text-gray-400 font-mono">
            {vocalSettings.fixStrength > 75
              ? 'Aggressive Rebuild'
              : vocalSettings.fixStrength > 50
              ? 'Heavy Chop'
              : 'Subtle Auto-Tune'}
          </span>
        </div>
        <input
          id="vocal-fix-strength-slider"
          type="range"
          min="0"
          max="100"
          step="1"
          value={vocalSettings.fixStrength}
          onChange={(e) => handleStrengthChange(parseInt(e.target.value, 10))}
          className="w-full accent-cyan-400 h-1.5 bg-gray-900 rounded cursor-pointer"
        />

        {/* 3 Inline Dropdowns/Toggles */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          {/* Key Target */}
          <div className="bg-[#141418] p-1.5 rounded-md border border-gray-800">
            <span className="text-[9px] font-bold text-gray-400 uppercase block mb-0.5">Pitch Key</span>
            <select
              value={vocalSettings.pitchKey || 'A Minor'}
              onChange={(e) => handleKeyChange(e.target.value)}
              className="w-full bg-transparent text-[10px] text-cyan-300 font-mono font-bold focus:outline-none cursor-pointer"
            >
              {PITCH_KEYS.map((k) => (
                <option key={k} value={k} className="bg-[#141418] text-white">
                  {k}
                </option>
              ))}
            </select>
          </div>

          {/* Ad-libs */}
          <button
            type="button"
            onClick={handleAdLibsToggle}
            className={`p-1.5 rounded-md border text-left flex flex-col justify-between transition-all ${
              vocalSettings.addAdLibs
                ? 'bg-cyan-950/60 border-cyan-500/50 text-cyan-300'
                : 'bg-[#141418] border-gray-800 text-gray-500'
            }`}
          >
            <span className="text-[9px] font-bold uppercase">Ad-Libs</span>
            <span className="text-[10px] font-mono font-extrabold">{vocalSettings.addAdLibs ? 'ON' : 'OFF'}</span>
          </button>

          {/* Repeat Hook */}
          <button
            type="button"
            onClick={handleHookDropToggle}
            className={`p-1.5 rounded-md border text-left flex flex-col justify-between transition-all ${
              vocalSettings.repeatHookOnDrop
                ? 'bg-violet-950/60 border-violet-500/50 text-violet-300'
                : 'bg-[#141418] border-gray-800 text-gray-500'
            }`}
          >
            <span className="text-[9px] font-bold uppercase flex items-center justify-between">
              <span>Drop Loop</span>
              <Repeat className="w-2.5 h-2.5" />
            </span>
            <span className="text-[10px] font-mono font-extrabold">{vocalSettings.repeatHookOnDrop ? 'Active' : 'Disabled'}</span>
          </button>
        </div>
      </div>

      {/* ROW 4: VOCAL VOLUME & REVERB SLIDERS */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="p-2.5 rounded-lg bg-[#0E0E11] border border-[#2A2A2E] space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold text-gray-300 flex items-center space-x-1">
              <Volume2 className="w-3 h-3 text-cyan-400" />
              <span>Vocal Volume</span>
            </span>
            <span className="text-cyan-400 font-mono font-extrabold text-[11px]">
              {Math.round(vocalSettings.volume * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={vocalSettings.volume}
            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
            className="w-full accent-cyan-400 h-1.5 bg-gray-900 rounded cursor-pointer"
          />
        </div>

        <div className="p-2.5 rounded-lg bg-[#0E0E11] border border-[#2A2A2E] space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold text-gray-300 flex items-center space-x-1">
              <SlidersHorizontal className="w-3 h-3 text-violet-400" />
              <span>Reverb & Delay</span>
            </span>
            <span className="text-violet-400 font-mono font-extrabold text-[11px]">
              {Math.round(vocalSettings.reverbDelay * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={vocalSettings.reverbDelay}
            onChange={(e) => handleReverbChange(parseFloat(e.target.value))}
            className="w-full accent-violet-400 h-1.5 bg-gray-900 rounded cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
