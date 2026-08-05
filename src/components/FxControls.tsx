import React from 'react';
import { FxSettings } from '../types';
import { Sliders, RefreshCw } from 'lucide-react';

interface FxControlsProps {
  fx: FxSettings;
  onChange: (newFx: FxSettings) => void;
  onApplyFx: () => void;
  isProcessing: boolean;
}

export const FxControls: React.FC<FxControlsProps> = ({
  fx,
  onChange,
  onApplyFx,
  isProcessing,
}) => {
  const handleSlider = (key: keyof FxSettings, value: number) => {
    onChange({
      ...fx,
      [key]: value,
    });
  };

  return (
    <div id="studio-fx-section" className="bg-[#141417] border border-[#1E1E22] rounded-xl p-3.5 md:p-4 shadow-lg space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-800/80 pb-2.5">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-cyan-600/20 border border-cyan-500/30 text-cyan-400">
            <Sliders className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-white tracking-wide">Studio FX & Parameters</h3>
            <p className="text-[11px] text-gray-400">
              Cutoff, sidechain, drive & spatial reverbs.
            </p>
          </div>
        </div>
        <button
          id="re-render-remix-btn"
          type="button"
          onClick={onApplyFx}
          disabled={isProcessing}
          className="px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-extrabold text-[11px] uppercase tracking-wider flex items-center space-x-1 transition-all shadow-sm disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
          <span>Apply Tweaks</span>
        </button>
      </div>

      {/* 2-Column Grid x 4 Rows of Compact Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        {/* Filter Cutoff */}
        <div className="bg-[#0E0E11] p-2.5 rounded-lg border border-[#2A2A2E] space-y-1">
          <div className="flex justify-between font-mono text-[11px] font-bold">
            <span className="text-gray-300 font-sans">Filter Cutoff</span>
            <span className="text-cyan-400 font-extrabold">{Math.round(fx.filterFreq)} Hz</span>
          </div>
          <input
            type="range"
            min={200}
            max={18000}
            step={100}
            value={fx.filterFreq}
            onChange={(e) => handleSlider('filterFreq', parseFloat(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer h-1 bg-gray-900 rounded"
          />
        </div>

        {/* Filter Resonance */}
        <div className="bg-[#0E0E11] p-2.5 rounded-lg border border-[#2A2A2E] space-y-1">
          <div className="flex justify-between font-mono text-[11px] font-bold">
            <span className="text-gray-300 font-sans">Resonance (Q)</span>
            <span className="text-violet-400 font-extrabold">{fx.filterResonance.toFixed(1)}</span>
          </div>
          <input
            type="range"
            min={0.5}
            max={15}
            step={0.5}
            value={fx.filterResonance}
            onChange={(e) => handleSlider('filterResonance', parseFloat(e.target.value))}
            className="w-full accent-violet-400 cursor-pointer h-1 bg-gray-900 rounded"
          />
        </div>

        {/* Sidechain Depth */}
        <div className="bg-[#0E0E11] p-2.5 rounded-lg border border-[#2A2A2E] space-y-1">
          <div className="flex justify-between font-mono text-[11px] font-bold">
            <span className="text-gray-300 font-sans">Sidechain Pump</span>
            <span className="text-cyan-400 font-extrabold">{Math.round(fx.sidechainDepth * 100)}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={fx.sidechainDepth}
            onChange={(e) => handleSlider('sidechainDepth', parseFloat(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer h-1 bg-gray-900 rounded"
          />
        </div>

        {/* Kick Synth Layer */}
        <div className="bg-[#0E0E11] p-2.5 rounded-lg border border-[#2A2A2E] space-y-1">
          <div className="flex justify-between font-mono text-[11px] font-bold">
            <span className="text-gray-300 font-sans">Kick Synth</span>
            <span className="text-violet-400 font-extrabold">{Math.round(fx.kickVolume * 100)}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={1.5}
            step={0.05}
            value={fx.kickVolume}
            onChange={(e) => handleSlider('kickVolume', parseFloat(e.target.value))}
            className="w-full accent-violet-400 cursor-pointer h-1 bg-gray-900 rounded"
          />
        </div>

        {/* Bass Drive */}
        <div className="bg-[#0E0E11] p-2.5 rounded-lg border border-[#2A2A2E] space-y-1">
          <div className="flex justify-between font-mono text-[11px] font-bold">
            <span className="text-gray-300 font-sans">Bass Saturation</span>
            <span className="text-amber-400 font-extrabold">{Math.round(fx.bassDrive * 100)}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={fx.bassDrive}
            onChange={(e) => handleSlider('bassDrive', parseFloat(e.target.value))}
            className="w-full accent-amber-400 cursor-pointer h-1 bg-gray-900 rounded"
          />
        </div>

        {/* Reverb Wet */}
        <div className="bg-[#0E0E11] p-2.5 rounded-lg border border-[#2A2A2E] space-y-1">
          <div className="flex justify-between font-mono text-[11px] font-bold">
            <span className="text-gray-300 font-sans">Reverb Wet</span>
            <span className="text-cyan-400 font-extrabold">{Math.round(fx.reverbWet * 100)}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={fx.reverbWet}
            onChange={(e) => handleSlider('reverbWet', parseFloat(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer h-1 bg-gray-900 rounded"
          />
        </div>

        {/* Delay Wet */}
        <div className="bg-[#0E0E11] p-2.5 rounded-lg border border-[#2A2A2E] space-y-1">
          <div className="flex justify-between font-mono text-[11px] font-bold">
            <span className="text-gray-300 font-sans">Delay Throw</span>
            <span className="text-cyan-400 font-extrabold">{Math.round(fx.delayWet * 100)}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={fx.delayWet}
            onChange={(e) => handleSlider('delayWet', parseFloat(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer h-1 bg-gray-900 rounded"
          />
        </div>

        {/* Pitch Shift */}
        <div className="bg-[#0E0E11] p-2.5 rounded-lg border border-[#2A2A2E] space-y-1">
          <div className="flex justify-between font-mono text-[11px] font-bold">
            <span className="text-gray-300 font-sans">Pitch Shift</span>
            <span className="text-violet-400 font-extrabold">
              {fx.pitchShift > 0 ? `+${fx.pitchShift}` : fx.pitchShift} st
            </span>
          </div>
          <input
            type="range"
            min={-12}
            max={12}
            step={1}
            value={fx.pitchShift}
            onChange={(e) => handleSlider('pitchShift', parseInt(e.target.value, 10))}
            className="w-full accent-violet-400 cursor-pointer h-1 bg-gray-900 rounded"
          />
        </div>
      </div>
    </div>
  );
};
