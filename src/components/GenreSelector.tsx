import React, { useState } from 'react';
import { GENRE_PRESETS } from '../utils/audioEngine';
import { GenreType } from '../types';
import { Sliders, Zap, Disc, UserCheck, CheckCircle2 } from 'lucide-react';

interface GenreSelectorProps {
  activeGenre: GenreType;
  onGenreSelect: (genre: GenreType) => void;
  isProcessing: boolean;
}

const GENRE_PRESETS_LIST: GenreType[] = [
  'Techno',
  'House',
  'Dubstep',
  'Chillstep',
  'Trance',
  'Drum & Bass',
  'Future Bass',
  'Lo-fi House',
];

const ARTIST_PRESETS_LIST: GenreType[] = [
  'Zedd',
  'Slushii',
  'Alan Walker',
  'Skrillex',
  'Excision',
  'Zomboy',
];

export const GenreSelector: React.FC<GenreSelectorProps> = ({
  activeGenre,
  onGenreSelect,
  isProcessing,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'genres' | 'artists'>('all');

  const showGenres = activeTab === 'all' || activeTab === 'genres';
  const showArtists = activeTab === 'all' || activeTab === 'artists';

  return (
    <div id="select-genre-preset-section" className="bg-[#141417] border border-[#1E1E22] rounded-xl p-3.5 md:p-4 shadow-lg space-y-3">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-800/80 pb-3 gap-2">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 rounded-lg bg-violet-600/20 border border-violet-500/30 text-violet-400">
            <Sliders className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-white tracking-wide">Select Genre & Artist Preset</h2>
            <p className="text-[11px] text-gray-400">
              Pick from 14 Billboard EDM genres and legendary artist engines.
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-[#0E0E11] p-1 rounded-lg border border-gray-800 self-start sm:self-auto text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1 rounded-md transition-all ${
              activeTab === 'all'
                ? 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-extrabold shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            All (14)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('genres')}
            className={`px-3 py-1 rounded-md transition-all flex items-center space-x-1 ${
              activeTab === 'genres'
                ? 'bg-cyan-500 text-black font-extrabold shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Disc className="w-3.5 h-3.5" />
            <span>Billboard Genres (8)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('artists')}
            className={`px-3 py-1 rounded-md transition-all flex items-center space-x-1 ${
              activeTab === 'artists'
                ? 'bg-violet-600 text-white font-extrabold shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Artist DNA (6)</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: 8 GENRE PRESETS GRID */}
      {showGenres && (
        <div className="space-y-2">
          {activeTab === 'all' && (
            <div className="flex items-center space-x-1.5 text-[11px] font-extrabold uppercase tracking-wider text-cyan-400">
              <Disc className="w-3.5 h-3.5" />
              <span>Billboard EDM Genres (8 Presets)</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
            {GENRE_PRESETS_LIST.map((genreId) => {
              const preset = GENRE_PRESETS[genreId];
              if (!preset) return null;
              const isActive = activeGenre === genreId;

              return (
                <button
                  id={`genre-preset-card-${genreId.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  key={genreId}
                  type="button"
                  disabled={isProcessing}
                  onClick={() => onGenreSelect(genreId)}
                  className={`p-2.5 rounded-lg border text-left transition-all flex flex-col justify-between group cursor-pointer ${
                    isActive
                      ? 'border-cyan-400 bg-gradient-to-br from-violet-950/70 via-[#161424] to-cyan-950/80 shadow-md ring-1 ring-cyan-400/50 scale-[1.01]'
                      : 'border-[#2A2A2E] bg-[#0E0E11] hover:border-gray-700 hover:bg-[#16161A]'
                  } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[12px] font-extrabold ${isActive ? 'text-white' : 'text-gray-200 group-hover:text-white'}`}>
                      {genreId}
                    </span>
                    {isActive ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                    ) : (
                      <span className="text-[10px] font-mono font-bold text-gray-400 bg-gray-800/80 px-1.5 py-0.5 rounded">
                        {preset.defaultBpm} BPM
                      </span>
                    )}
                  </div>

                  <p className="text-[10px] text-gray-400 line-clamp-1 mb-1.5">
                    {preset.signature}
                  </p>

                  <div className="flex items-center justify-between text-[9px] pt-1 border-t border-gray-800/60">
                    <span className="text-cyan-400 font-mono font-bold">{preset.artistTag}</span>
                    {isActive && (
                      <span className="text-cyan-300 font-mono font-bold bg-cyan-950 px-1 rounded border border-cyan-500/30">
                        ACTIVE
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 2: 6 ARTIST PRESETS GRID */}
      {showArtists && (
        <div className="space-y-2 pt-1">
          {activeTab === 'all' && (
            <div className="flex items-center space-x-1.5 text-[11px] font-extrabold uppercase tracking-wider text-violet-400">
              <UserCheck className="w-3.5 h-3.5" />
              <span>Artist DNA Style Engines (6 Legendary Producers)</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {ARTIST_PRESETS_LIST.map((genreId) => {
              const preset = GENRE_PRESETS[genreId];
              if (!preset) return null;
              const isActive = activeGenre === genreId;

              return (
                <button
                  id={`artist-preset-card-${genreId.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  key={genreId}
                  type="button"
                  disabled={isProcessing}
                  onClick={() => onGenreSelect(genreId)}
                  className={`p-2.5 rounded-lg border text-left transition-all flex flex-col justify-between group cursor-pointer ${
                    isActive
                      ? 'border-violet-400 bg-gradient-to-br from-violet-950/90 via-[#1A1428] to-cyan-950/80 shadow-md ring-1 ring-violet-400/50 scale-[1.01]'
                      : 'border-[#2A2A2E] bg-[#0E0E11] hover:border-gray-700 hover:bg-[#16161A]'
                  } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[12px] font-extrabold ${isActive ? 'text-white' : 'text-gray-200 group-hover:text-white'}`}>
                      {genreId} Engine
                    </span>
                    {isActive ? (
                      <Zap className="w-3.5 h-3.5 text-violet-400 flex-shrink-0 animate-pulse" />
                    ) : (
                      <span className="text-[10px] font-mono font-bold text-gray-400 bg-gray-800/80 px-1.5 py-0.5 rounded">
                        {preset.defaultBpm} BPM
                      </span>
                    )}
                  </div>

                  <p className="text-[10px] text-gray-400 line-clamp-1 mb-1.5">
                    {preset.signature}
                  </p>

                  <div className="flex items-center justify-between text-[9px] pt-1 border-t border-gray-800/60">
                    <span className="text-violet-400 font-mono font-bold">{preset.name}</span>
                    {isActive && (
                      <span className="text-violet-300 font-mono font-bold bg-violet-950 px-1 rounded border border-violet-500/30">
                        SELECTED
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
