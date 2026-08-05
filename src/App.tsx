import React, { useState, useEffect, useRef } from 'react';
import {
  GenreType,
  FxSettings,
  VocalSettings,
  TrackMetadata,
  AiAnalysis,
  AudioProcessingStatus,
  LayerState,
} from './types';
import { GENRE_PRESETS, renderRemixAudioBuffer, estimateBpm } from './utils/audioEngine';

import { AudioUploader } from './components/AudioUploader';
import { WaveformVisualizer } from './components/WaveformVisualizer';
import { GenreSelector } from './components/GenreSelector';
import { VocalMagicStudio } from './components/VocalMagicStudio';
import { FxControls } from './components/FxControls';
import { AiProducerPanel } from './components/AiProducerPanel';
import { AiRemixLayers } from './components/AiRemixLayers';
import { ExportModal } from './components/ExportModal';
import {
  Play,
  Pause,
  Square,
  Repeat,
  Volume2,
  VolumeX,
  UploadCloud,
  Music,
  Edit3,
  Tag,
  Check,
} from 'lucide-react';

export default function App() {
  // Category Selection on initial upload screen
  const [selectedUploadGenre, setSelectedUploadGenre] = useState<GenreType>('Zedd');

  // Audio State
  const [originalBuffer, setOriginalBuffer] = useState<AudioBuffer | null>(null);
  const [remixedBuffer, setRemixedBuffer] = useState<AudioBuffer | null>(null);
  const [trackMeta, setTrackMeta] = useState<TrackMetadata | null>(null);
  const [activeGenre, setActiveGenre] = useState<GenreType>('Zedd');
  const [isEditingMetadata, setIsEditingMetadata] = useState(false);

  // Layer State
  const [layerState, setLayerState] = useState<LayerState>(GENRE_PRESETS['Zedd'].defaultLayers);

  // FX Settings
  const [fxSettings, setFxSettings] = useState<FxSettings>({
    filterFreq: GENRE_PRESETS['Zedd'].defaultFilterFreq,
    filterResonance: GENRE_PRESETS['Zedd'].defaultResonance,
    filterType: GENRE_PRESETS['Zedd'].filterType,
    sidechainDepth: GENRE_PRESETS['Zedd'].sidechainDepth,
    kickVolume: 1.0,
    bassDrive: GENRE_PRESETS['Zedd'].drive,
    reverbWet: GENRE_PRESETS['Zedd'].reverbWet,
    delayWet: GENRE_PRESETS['Zedd'].delayWet,
    pitchShift: 0,
    tempoRate: 1.0,
  });

  // Vocal Settings - Aggressive Vocal Rebuild ON by Default
  const [vocalSettings, setVocalSettings] = useState<VocalSettings>({
    autoRebuildVocals: true,
    replaceMode: 'vocal_chops',
    mode: 'chop_hook',
    fixStrength: 85, // 85 = Aggressive Rebuild - chops vocals into rhythm instrument
    addAdLibs: true,
    repeatHookOnDrop: true,
    volume: 0.70, // 70% volume so drum/bass shines
    reverbDelay: 0.5,
    pitchKey: 'A Minor',
    speed: 1.0,
    pitchShift: 0,
    reverbType: 'hall',
    delayMix: 0.3,
    autoFitToBeat: true,
  });

  // Playback State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [isLooping, setIsLooping] = useState(true);

  // Processing & AI State
  const [processingStatus, setProcessingStatus] = useState<AudioProcessingStatus>({
    isProcessing: false,
    progress: 0,
    stage: '',
  });
  const [aiAnalysis, setAiAnalysis] = useState<AiAnalysis | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Web Audio Context Refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const startTimeRef = useRef<number>(0);
  const pauseOffsetRef = useRef<number>(0);
  const timerAnimRef = useRef<number | null>(null);

  // Initialize Web Audio Context
  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  // 1. Audio Loaded Handler
  const handleAudioLoaded = async (
    buffer: AudioBuffer,
    meta: TrackMetadata,
    selectedGenre: GenreType
  ) => {
    stopPlayback();
    const detectedBpm = estimateBpm(buffer);
    const updatedMeta: TrackMetadata = {
      ...meta,
      name: meta.name.replace(/\.[^/.]+$/, ''),
      artist: meta.artist || 'Original Artist',
      detectedBpm: meta.detectedBpm || detectedBpm || 128,
    };

    setOriginalBuffer(buffer);
    setTrackMeta(updatedMeta);
    setDuration(buffer.duration);

    const defaultGenreLayers = GENRE_PRESETS[selectedGenre].defaultLayers;
    setActiveGenre(selectedGenre);
    setLayerState(defaultGenreLayers);

    await generateRemix(selectedGenre, buffer, fxSettings, defaultGenreLayers, vocalSettings, true);
    fetchAiAnalysis(updatedMeta, selectedGenre);
  };

  // 2. Full Intelligent Remix Engine Generator
  const generateRemix = async (
    genreId: GenreType,
    srcBuffer = originalBuffer,
    customFx = fxSettings,
    customLayers = layerState,
    customVocal = vocalSettings,
    autoPlayAfterRender = true
  ) => {
    if (!srcBuffer) return;

    const wasPlayingBefore = isPlaying;
    stopPlayback();
    setProcessingStatus({ isProcessing: true, progress: 10, stage: 'Analyzing Audio Stems & Vocal Engine...' });

    const preset = GENRE_PRESETS[genreId];
    const updatedFx: FxSettings = {
      ...customFx,
      filterFreq: preset.defaultFilterFreq,
      filterResonance: preset.defaultResonance,
      filterType: preset.filterType,
      sidechainDepth: preset.sidechainDepth,
      bassDrive: preset.drive,
      reverbWet: preset.reverbWet,
      delayWet: preset.delayWet,
    };
    setFxSettings(updatedFx);

    try {
      const rendered = await renderRemixAudioBuffer(
        srcBuffer,
        preset,
        updatedFx,
        customLayers,
        customVocal,
        (progress, stage) => {
          setProcessingStatus({ isProcessing: true, progress, stage });
        }
      );

      setRemixedBuffer(rendered);
      setDuration(rendered.duration);
      pauseOffsetRef.current = 0;
      setCurrentTime(0);

      setProcessingStatus({ isProcessing: false, progress: 100, stage: 'Complete' });

      if (autoPlayAfterRender || wasPlayingBefore) {
        startPlayback(rendered, 0);
      }
    } catch (err: any) {
      console.error('Error generating remix:', err);
      setProcessingStatus({
        isProcessing: false,
        progress: 0,
        stage: '',
        error: 'Failed to process audio buffer.',
      });
    }
  };

  // 3. Genre Select Handler
  const handleGenreSelect = (genre: GenreType) => {
    setActiveGenre(genre);
    
    // FIND THE PRESET'S VOCAL CONFIG
    const preset = GENRE_PRESETS[genre];
    const newLayers = preset?.defaultLayers || layerState;
    setLayerState(newLayers);

    let newVocalSettings = vocalSettings;
    if (preset?.vocalConfig) {
      newVocalSettings = {
        ...vocalSettings,
        // Auto-apply the artist's time-stretch signature
        speed: preset.vocalConfig.speed ?? vocalSettings.speed,
        pitchShift: preset.vocalConfig.pitchShift ?? vocalSettings.pitchShift,
        reverbType: preset.vocalConfig.reverbType ?? vocalSettings.reverbType,
        reverbDelay: preset.vocalConfig.reverbDelay ?? vocalSettings.reverbDelay,
        delayMix: preset.vocalConfig.delayMix ?? vocalSettings.delayMix,
        fixStrength: preset.vocalConfig.fixStrength ?? vocalSettings.fixStrength,
        autoFitToBeat: true, // Always quantize to new BPM
      };
      setVocalSettings(newVocalSettings);
    }

    // Generate remix WITH the new time-stretched vocals
    generateRemix(genre, originalBuffer, fxSettings, newLayers, newVocalSettings, true);
    if (trackMeta) {
      fetchAiAnalysis(trackMeta, genre);
    }
  };

  // 4. Vocal Studio Handler
  const handleVocalChange = (updated: VocalSettings) => {
    setVocalSettings(updated);
    generateRemix(activeGenre, originalBuffer, fxSettings, layerState, updated, isPlaying);
  };

  // 5. Dynamic Layer Toggle Handler
  const handleLayerChange = (updatedLayers: LayerState) => {
    setLayerState(updatedLayers);
    generateRemix(activeGenre, originalBuffer, fxSettings, updatedLayers, vocalSettings, isPlaying);
  };

  // 6. FX Handler
  const handleFxChange = (updatedFx: FxSettings) => {
    setFxSettings(updatedFx);
  };

  const handleApplyFx = () => {
    generateRemix(activeGenre, originalBuffer, fxSettings, layerState, vocalSettings, isPlaying);
  };

  // 7. Fetch AI Producer Analysis
  const fetchAiAnalysis = async (meta = trackMeta, genre = activeGenre, customPrompt = '') => {
    if (!meta) return;
    setIsAiLoading(true);

    try {
      const response = await fetch('/api/ai-producer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          genre,
          fileName: meta.name,
          bpm: meta.detectedBpm,
          duration: meta.duration,
          userCustomPrompt: customPrompt,
        }),
      });

      if (!response.ok) throw new Error('API server returned error');
      const data = await response.json();
      setAiAnalysis(data);
    } catch (err) {
      console.warn('AI analysis fallback:', err);
      setAiAnalysis({
        advice: `To create a masterclass ${genre} track, drive the low end, align sidechain compression to beat drops, and rebuild vocal stems cleanly.`,
        recommendedBpm: GENRE_PRESETS[genre].defaultBpm,
        keyElements: ['Sub-Bass Drive', 'Rebuilt Vocal Chops', 'Sidechain Pump', 'Synthesized Synths'],
        presetNotes: `Tailored preset for ${genre}.`,
      });
    } finally {
      setIsAiLoading(false);
    }
  };

  // 8. Playback Controls
  const startPlayback = (bufferToPlay = remixedBuffer, offset = pauseOffsetRef.current) => {
    if (!bufferToPlay) return;

    const ctx = getAudioContext();

    if (sourceNodeRef.current) {
      try {
        sourceNodeRef.current.stop();
        sourceNodeRef.current.disconnect();
      } catch {}
    }

    const source = ctx.createBufferSource();
    source.buffer = bufferToPlay;
    source.loop = isLooping;

    const gainNode = ctx.createGain();
    const safeVol = typeof volume === 'number' && Number.isFinite(volume) ? Math.max(0, volume) : 0.9;
    gainNode.gain.value = isMuted ? 0 : safeVol;

    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;

    source.connect(gainNode);
    gainNode.connect(analyser);
    analyser.connect(ctx.destination);

    sourceNodeRef.current = source;
    gainNodeRef.current = gainNode;
    analyserRef.current = analyser;

    startTimeRef.current = ctx.currentTime - offset;
    source.start(0, offset);
    setIsPlaying(true);

    updatePlaybackProgress();
  };

  const pausePlayback = () => {
    if (sourceNodeRef.current && isPlaying) {
      const ctx = getAudioContext();
      pauseOffsetRef.current = (ctx.currentTime - startTimeRef.current) % duration;
      try {
        sourceNodeRef.current.stop();
      } catch {}
      setIsPlaying(false);
      if (timerAnimRef.current) cancelAnimationFrame(timerAnimRef.current);
    }
  };

  const stopPlayback = () => {
    if (sourceNodeRef.current) {
      try {
        sourceNodeRef.current.stop();
      } catch {}
    }
    pauseOffsetRef.current = 0;
    setCurrentTime(0);
    setIsPlaying(false);
    if (timerAnimRef.current) cancelAnimationFrame(timerAnimRef.current);
  };

  const handleSeek = (time: number) => {
    pauseOffsetRef.current = time;
    setCurrentTime(time);
    if (isPlaying && remixedBuffer) {
      startPlayback(remixedBuffer, time);
    }
  };

  const updatePlaybackProgress = () => {
    if (!audioCtxRef.current || !isPlaying) return;
    const elapsed = (audioCtxRef.current.currentTime - startTimeRef.current) % duration;
    setCurrentTime(elapsed);
    timerAnimRef.current = requestAnimationFrame(updatePlaybackProgress);
  };

  useEffect(() => {
    if (gainNodeRef.current) {
      const safeVol = typeof volume === 'number' && Number.isFinite(volume) ? Math.max(0, volume) : 0.9;
      gainNodeRef.current.gain.value = isMuted ? 0 : safeVol;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    return () => {
      stopPlayback();
      if (audioCtxRef.current) audioCtxRef.current.close();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-white flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* 1. HEADER - Single Compact Row (Reduced height by 50%) */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0A0A0C]/90 border-b border-[#1E1E22] px-4 py-2 flex items-center justify-between gap-3">
        {/* Left: Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center shadow-md">
            <Music className="w-4 h-4 text-white" />
          </div>
          <h1 className="font-extrabold text-sm flex items-center gap-1.5 text-white">
            <span>EDM Remix Studio</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-purple-600/30 text-purple-300 border border-purple-500/30 font-bold uppercase hidden sm:inline">
              AI DSP
            </span>
          </h1>
        </div>

        {/* Middle Status Pill (when audio loaded) */}
        {originalBuffer && (
          <div className="hidden md:flex items-center space-x-2 text-[11px] bg-[#141417] px-3 py-1 rounded-full border border-[#2A2A2E]">
            <span className="text-gray-400">
              Detected: <strong className="text-cyan-400 font-mono">{trackMeta?.detectedBpm} BPM</strong> |{' '}
              <strong className="text-violet-400 font-mono">{Math.round(duration)}s</strong> |{' '}
              <span className="text-emerald-400 font-semibold">Vocal Rebuild Active</span>
            </span>
            <span className="text-gray-600">|</span>
            <span className="px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-extrabold uppercase text-[10px]">
              Style: {activeGenre}
            </span>
          </div>
        )}

        {/* Right Action */}
        {originalBuffer && (
          <button
            id="change-audio-btn"
            type="button"
            onClick={() => {
              stopPlayback();
              setOriginalBuffer(null);
              setRemixedBuffer(null);
            }}
            className="text-xs bg-[#1A1A1E] hover:bg-[#25252A] border border-[#2A2A2E] px-3 py-1 rounded-full font-bold transition-all flex items-center gap-1 cursor-pointer flex-shrink-0"
          >
            <UploadCloud className="w-3.5 h-3.5 text-cyan-400" />
            <span>Load New Audio</span>
          </button>
        )}
      </header>

      {/* 2. UPLOADER OR STUDIO AREA */}
      {!originalBuffer ? (
        <div className="flex-1 flex items-center justify-center p-4">
          <AudioUploader
            onAudioLoaded={handleAudioLoaded}
            isLoading={processingStatus.isProcessing}
            selectedGenre={selectedUploadGenre}
            onSelectGenre={setSelectedUploadGenre}
          />
        </div>
      ) : (
        <main className="flex-1 max-w-7xl w-full mx-auto p-3.5 md:p-4 space-y-4">

          {/* 2. PLAYER - One Card, Two Compact Rows */}
          <div id="now-playing-section" className="bg-[#141417] border border-[#1E1E22] rounded-xl p-3.5 shadow-lg space-y-3 relative overflow-hidden">
            {/* Row 1: Controls, Volume, Track Info & Time */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-800/80 pb-2.5">
              {/* Transport Buttons */}
              <div className="flex items-center space-x-2">
                <button
                  id="play-pause-btn"
                  type="button"
                  onClick={() => {
                    if (isPlaying) pausePlayback();
                    else startPlayback();
                  }}
                  className="w-9 h-9 rounded-full bg-gradient-to-tr from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white flex items-center justify-center shadow-md transition-transform active:scale-95 cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
                </button>

                <button
                  id="stop-btn"
                  type="button"
                  onClick={stopPlayback}
                  className="p-2 rounded-full bg-[#0E0E11] hover:bg-gray-800 border border-[#2A2A2E] text-gray-300 transition-colors cursor-pointer"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                </button>

                <button
                  id="loop-toggle-btn"
                  type="button"
                  onClick={() => setIsLooping(!isLooping)}
                  className={`p-2 rounded-full border transition-colors cursor-pointer ${
                    isLooping
                      ? 'bg-cyan-950 border-cyan-500 text-cyan-400'
                      : 'bg-[#0E0E11] border-[#2A2A2E] text-gray-500'
                  }`}
                >
                  <Repeat className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Volume Slider */}
              <div className="flex items-center space-x-1.5 bg-[#0E0E11] px-3 py-1 rounded-lg border border-[#2A2A2E]">
                <button
                  type="button"
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-gray-400 hover:text-white cursor-pointer"
                >
                  {isMuted || volume === 0 ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
                </button>
                <input
                  id="master-volume-slider"
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    setVolume(parseFloat(e.target.value));
                    if (isMuted) setIsMuted(false);
                  }}
                  className="w-20 accent-cyan-400 cursor-pointer h-1 bg-gray-900 rounded"
                />
                <span className="text-[10px] font-mono text-gray-400 w-7 text-right font-bold">
                  {isMuted ? '0%' : `${Math.round(volume * 100)}%`}
                </span>
              </div>

              {/* Track Title, Artist, BPM & Edit Metadata Button */}
              <div className="flex items-center space-x-2 text-xs">
                <div className="flex items-center space-x-1.5 bg-[#0E0E11] px-2.5 py-1 rounded-lg border border-gray-800">
                  <span className="font-extrabold text-white truncate max-w-[140px] sm:max-w-[200px]" id="active-track-name">
                    {trackMeta?.artist ? `${trackMeta.artist} - ` : ''}{trackMeta?.name}
                  </span>
                  <span className="text-[10px] text-cyan-400 font-mono font-bold bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-500/40">
                    {trackMeta?.detectedBpm} BPM
                  </span>
                </div>

                <span className="text-cyan-400 font-mono font-bold text-xs bg-[#0E0E11] px-2.5 py-1 rounded-lg border border-gray-800">
                  {Math.floor(currentTime / 60)}:{(Math.floor(currentTime % 60)).toString().padStart(2, '0')} / {Math.floor(duration / 60)}:{(Math.floor(duration % 60)).toString().padStart(2, '0')}
                </span>

                <button
                  id="toggle-edit-metadata-btn"
                  type="button"
                  onClick={() => setIsEditingMetadata(!isEditingMetadata)}
                  className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                    isEditingMetadata
                      ? 'bg-cyan-950 text-cyan-300 border-cyan-400'
                      : 'bg-[#0E0E11] text-gray-300 hover:text-cyan-300 border-[#2A2A2E] hover:border-cyan-500/50'
                  }`}
                  title="Edit Song Title, Artist Name, and BPM value"
                >
                  <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="hidden sm:inline">Edit Metadata</span>
                </button>
              </div>
            </div>

            {/* Edit Metadata Section within Player Card */}
            {isEditingMetadata && (
              <div id="edit-metadata-section" className="bg-[#0E0E11] border border-cyan-500/40 rounded-xl p-3 space-y-2.5 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-gray-800/80 pb-2">
                  <div className="flex items-center space-x-2">
                    <Tag className="w-4 h-4 text-cyan-400" />
                    <h4 className="text-xs font-black text-white uppercase tracking-wider">
                      Edit Track Metadata
                    </h4>
                    <span className="text-[10px] text-gray-400 font-sans hidden sm:inline">
                      Override title, artist, and tempo for export tag & file headers
                    </span>
                  </div>
                  <button
                    id="save-metadata-btn"
                    type="button"
                    onClick={() => setIsEditingMetadata(false)}
                    className="flex items-center space-x-1 text-[11px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/40 px-2.5 py-1 rounded-lg hover:bg-cyan-900 transition-colors cursor-pointer"
                  >
                    <Check className="w-3 h-3 text-cyan-400" />
                    <span>Done Editing</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Song Title Field */}
                  <div>
                    <label className="block text-[10px] uppercase font-extrabold text-gray-300 mb-1">
                      Song Title
                    </label>
                    <input
                      id="edit-song-title-input"
                      type="text"
                      value={trackMeta?.name || ''}
                      onChange={(e) =>
                        setTrackMeta((prev) => (prev ? { ...prev, name: e.target.value } : null))
                      }
                      placeholder="e.g. Starlight Anthem"
                      className="w-full bg-[#141418] border border-gray-700 focus:border-cyan-400 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none font-medium"
                    />
                  </div>

                  {/* Artist Name Field */}
                  <div>
                    <label className="block text-[10px] uppercase font-extrabold text-gray-300 mb-1">
                      Artist Name
                    </label>
                    <input
                      id="edit-artist-name-input"
                      type="text"
                      value={trackMeta?.artist || ''}
                      onChange={(e) =>
                        setTrackMeta((prev) => (prev ? { ...prev, artist: e.target.value } : null))
                      }
                      placeholder="e.g. DJ Cosmo"
                      className="w-full bg-[#141418] border border-gray-700 focus:border-cyan-400 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none font-medium"
                    />
                  </div>

                  {/* Tempo BPM Value Field */}
                  <div>
                    <label className="block text-[10px] uppercase font-extrabold text-gray-300 mb-1">
                      Tempo (BPM Value)
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        id="edit-tempo-bpm-input"
                        type="number"
                        min={40}
                        max={220}
                        value={trackMeta?.detectedBpm || 128}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          setTrackMeta((prev) => (prev ? { ...prev, detectedBpm: isNaN(val) ? 128 : val } : null));
                        }}
                        className="w-full bg-[#141418] border border-gray-700 focus:border-cyan-400 rounded-lg px-2.5 py-1.5 text-xs text-cyan-300 font-mono font-bold outline-none"
                      />
                      <span className="text-[11px] font-mono text-cyan-400 font-bold bg-[#141418] px-2 py-1 rounded border border-gray-800">
                        BPM
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Row 2: Waveform Visualizer + Thin Progress Overlay */}
            <div className="relative">
              <WaveformVisualizer
                audioBuffer={remixedBuffer}
                analyserNode={analyserRef.current}
                currentTime={currentTime}
                duration={duration}
                isPlaying={isPlaying}
                onSeek={handleSeek}
              />

              {processingStatus.isProcessing && (
                <div className="absolute inset-0 bg-[#0A0A0C]/85 backdrop-blur-sm rounded-lg flex flex-col justify-center px-4 space-y-1 z-10">
                  <div className="flex justify-between text-xs font-bold text-cyan-300">
                    <span>{processingStatus.stage}...</span>
                    <span>{processingStatus.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-900 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-violet-500 to-cyan-400 h-1.5 transition-all duration-300"
                      style={{ width: `${processingStatus.progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 3. GENRE SELECTOR - TABS & GRID */}
          <GenreSelector
            activeGenre={activeGenre}
            onGenreSelect={handleGenreSelect}
            isProcessing={processingStatus.isProcessing}
          />

          {/* 4. STUDIO CONTROLS - Clean 3-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-1 space-y-4">
              <VocalMagicStudio
                vocalSettings={vocalSettings}
                onChange={handleVocalChange}
                onApply={() => generateRemix(activeGenre, originalBuffer, fxSettings, layerState, vocalSettings, isPlaying)}
                isProcessing={processingStatus.isProcessing}
              />
            </div>
            <div className="lg:col-span-1 space-y-4">
              <AiRemixLayers
                genreName={activeGenre}
                layers={layerState}
                onLayerChange={handleLayerChange}
                isProcessing={processingStatus.isProcessing}
              />
            </div>
            <div className="lg:col-span-1 space-y-4">
              <FxControls
                fx={fxSettings}
                onChange={handleFxChange}
                onApplyFx={handleApplyFx}
                isProcessing={processingStatus.isProcessing}
              />
            </div>
          </div>

          {/* 5. AI PRODUCER ASSISTANT - Collapsible */}
          <AiProducerPanel
            trackMeta={trackMeta}
            activeGenre={activeGenre}
            analysis={aiAnalysis}
            onFetchAnalysis={(prompt) => fetchAiAnalysis(trackMeta, activeGenre, prompt)}
            isLoading={isAiLoading}
          />

          {/* 6. EXPORT MASTER TRACK - ABSOLUTE BOTTOM FOOTER */}
          <div className="pt-4 border-t border-[#1E1E22]">
            <ExportModal
              remixedBuffer={remixedBuffer}
              trackName={trackMeta?.name || 'EDM_Remix'}
              artistName={trackMeta?.artist || 'Unknown Artist'}
              bpm={trackMeta?.detectedBpm}
              genre={activeGenre}
            />
          </div>

        </main>
      )}
    </div>
  );
}
