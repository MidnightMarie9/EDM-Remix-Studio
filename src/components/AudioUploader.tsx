import React, { useRef, useState } from 'react';
import {
  Upload,
  Music,
  AlertCircle,
  Sparkles,
  FileAudio,
  Disc,
  Zap,
  Wind,
  Flame,
  Activity,
  Layers,
  Radio,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { generateDemoTrack } from '../utils/synthGenerator';
import { TrackMetadata, GenreType } from '../types';
import { GENRE_PRESETS } from '../utils/audioEngine';

interface AudioUploaderProps {
  onAudioLoaded: (buffer: AudioBuffer, fileMeta: TrackMetadata, selectedGenre: GenreType) => void;
  isLoading: boolean;
  selectedGenre: GenreType | null;
  onSelectGenre: (genre: GenreType) => void;
}

const ALLOWED_FORMATS = [
  'audio/mpeg',
  'audio/wav',
  'audio/ogg',
  'audio/x-m4a',
  'audio/flac',
  'audio/aiff',
  'audio/mp3',
  'audio/x-wav',
];
const MAX_FILE_SIZE_MB = 50;

const GENRE_ICONS: Record<GenreType, React.ReactNode> = {
  Zedd: <Flame className="w-5 h-5 text-blue-400" />,
  Slushii: <Sparkles className="w-5 h-5 text-fuchsia-400" />,
  'Alan Walker': <Wind className="w-5 h-5 text-teal-400" />,
  Skrillex: <Zap className="w-5 h-5 text-amber-400" />,
  Excision: <Layers className="w-5 h-5 text-red-500" />,
  Zomboy: <Radio className="w-5 h-5 text-emerald-400" />,
  Techno: <Disc className="w-5 h-5 text-purple-400" />,
  House: <Flame className="w-5 h-5 text-amber-400" />,
  Dubstep: <Zap className="w-5 h-5 text-orange-500" />,
  Chillstep: <Activity className="w-5 h-5 text-cyan-400" />,
  Trance: <Sparkles className="w-5 h-5 text-indigo-400" />,
  'Drum & Bass': <Radio className="w-5 h-5 text-emerald-400" />,
  'Future Bass': <Sparkles className="w-5 h-5 text-pink-400" />,
  'Lo-fi House': <Disc className="w-5 h-5 text-stone-400" />,
};

export const AudioUploader: React.FC<AudioUploaderProps> = ({
  onAudioLoaded,
  isLoading,
  selectedGenre,
  onSelectGenre,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const genresList = Object.values(GENRE_PRESETS);

  const validateAndProcessFile = async (file: File) => {
    if (!selectedGenre) {
      setErrorMessage('Please select a remix genre style first before dropping audio!');
      return;
    }

    setErrorMessage(null);

    // 1. File Size Validation (Max 50MB)
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > MAX_FILE_SIZE_MB) {
      setErrorMessage(`File size (${fileSizeMB.toFixed(1)} MB) exceeds maximum limit of 50 MB.`);
      return;
    }

    // 2. Format Validation
    const isExtensionValid = /\.(mp3|wav|ogg|m4a|flac|aiff)$/i.test(file.name);
    if (!isExtensionValid && file.type && !ALLOWED_FORMATS.includes(file.type)) {
      setErrorMessage('Unsupported audio format. Please upload an MP3, WAV, OGG, M4A, FLAC, or AIFF file.');
      return;
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

      const rawName = file.name.replace(/\.[^/.]+$/, '');
      const meta: TrackMetadata = {
        name: rawName,
        artist: 'Original Artist',
        size: file.size,
        type: file.type || 'audio/mpeg',
        duration: audioBuffer.duration,
        sampleRate: audioBuffer.sampleRate,
        numberOfChannels: audioBuffer.numberOfChannels,
        detectedBpm: 128,
      };

      onAudioLoaded(audioBuffer, meta, selectedGenre);
    } catch (err: any) {
      console.error('Audio decode error:', err);
      setErrorMessage('Failed to decode audio file. Please ensure the file is not corrupted.');
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!selectedGenre) return;

    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (!selectedGenre) {
      setErrorMessage('Please select a remix genre style first!');
      return;
    }

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const handleLoadDemo = async () => {
    if (!selectedGenre) {
      setErrorMessage('Please select a remix genre style first before loading the demo!');
      return;
    }

    setIsDemoLoading(true);
    setErrorMessage(null);
    try {
      const demoBuffer = await generateDemoTrack();
      const meta: TrackMetadata = {
        name: 'EDM Synth Groove',
        artist: 'Studio Demo',
        size: 2 * 1024 * 1024,
        type: 'audio/wav',
        duration: demoBuffer.duration,
        sampleRate: demoBuffer.sampleRate,
        numberOfChannels: demoBuffer.numberOfChannels,
        detectedBpm: 124,
      };
      onAudioLoaded(demoBuffer, meta, selectedGenre);
    } catch (err) {
      console.error('Demo track generation failed:', err);
      setErrorMessage('Failed to generate demo track.');
    } finally {
      setIsDemoLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-6 px-4 space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-br from-violet-600/20 to-cyan-500/20 border border-violet-500/30 mb-3 shadow-lg shadow-violet-900/20">
          <Music className="w-8 h-8 text-violet-400" />
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
          EDM Remix <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">Studio</span>
        </h1>
        <p className="mt-2 text-gray-400 text-sm md:text-base max-w-lg mx-auto">
          Intelligent AI producer full song editing. Select your target EDM genre style and drop any track.
        </p>
      </div>

      {/* STEP 1: CHOOSE YOUR ARTIST STYLE */}
      <div className="rounded-2xl bg-[#141418] border border-violet-500/20 p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
          <div className="flex items-center space-x-2 text-white font-bold text-base md:text-lg">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-violet-600 text-white font-black text-xs">
              1
            </span>
            <span>Choose Artist Style Engine</span>
          </div>

          <span className="text-xs text-gray-400">
            {selectedGenre ? (
              <span className="text-emerald-400 font-semibold flex items-center space-x-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Selected: {selectedGenre} Style</span>
              </span>
            ) : (
              'Required to enable uploader'
            )}
          </span>
        </div>

        {/* 8 Artist Style Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {genresList.map((g) => {
            const isSelected = selectedGenre === g.id;
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => {
                  onSelectGenre(g.id);
                  setErrorMessage(null);
                }}
                className={`group relative p-3.5 rounded-xl border text-left transition-all duration-200 ${
                  isSelected
                    ? 'bg-gradient-to-br from-violet-900/50 to-cyan-950/60 border-cyan-400 ring-2 ring-cyan-400/30 shadow-lg shadow-cyan-950/40 scale-[1.02]'
                    : 'bg-[#1A1A20] border-gray-800 hover:border-gray-700 hover:bg-[#22222a]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-[#141418] border border-gray-800 group-hover:border-gray-700">
                    {GENRE_ICONS[g.id]}
                  </div>
                  <span
                    className={`text-[11px] font-mono px-2 py-0.5 rounded-full border ${
                      isSelected
                        ? 'bg-cyan-950 text-cyan-300 border-cyan-500/50 font-bold'
                        : 'bg-gray-800 text-gray-400 border-gray-700'
                    }`}
                  >
                    {g.defaultBpm} BPM
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                  {g.id} Style
                </h3>
                <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider mt-0.5">
                  {g.artistTag}
                </p>

                {isSelected && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP 2: DROP YOUR AUDIO */}
      <div className="rounded-2xl bg-[#141418] border border-violet-500/20 p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
          <div className="flex items-center space-x-2 text-white font-bold text-base md:text-lg">
            <span
              className={`flex items-center justify-center w-7 h-7 rounded-full font-black text-xs ${
                selectedGenre ? 'bg-cyan-600 text-white' : 'bg-gray-800 text-gray-400'
              }`}
            >
              2
            </span>
            <span>Drop Your Audio</span>
          </div>

          {!selectedGenre && (
            <span className="text-xs text-amber-400 flex items-center space-x-1">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Select a genre style above to unlock</span>
            </span>
          )}
        </div>

        {/* Upload Dropzone */}
        <div
          id="audio-upload-dropzone"
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => {
            if (selectedGenre) {
              fileInputRef.current?.click();
            } else {
              setErrorMessage('Please select a genre style first in step 1!');
            }
          }}
          className={`relative rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-300 ${
            !selectedGenre
              ? 'border-gray-800 bg-[#121215] opacity-50 cursor-not-allowed'
              : dragActive
              ? 'border-cyan-400 bg-cyan-950/30 scale-[1.01] shadow-xl shadow-cyan-900/30 cursor-pointer'
              : 'border-violet-500/30 bg-[#1A1A20] hover:border-violet-400/60 hover:bg-[#222228] cursor-pointer'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".mp3,.wav,.ogg,.m4a,.flac,.aiff,audio/*"
            onChange={handleChange}
            disabled={!selectedGenre}
            className="hidden"
            id="audio-file-input"
          />

          <div className="flex flex-col items-center justify-center space-y-3">
            <div
              className={`p-4 rounded-full border transition-transform ${
                selectedGenre
                  ? 'bg-violet-950/60 border-violet-500/40 text-violet-300 group-hover:scale-110'
                  : 'bg-gray-900 border-gray-800 text-gray-600'
              }`}
            >
              {selectedGenre ? (
                <Upload className="w-8 h-8 text-cyan-400" />
              ) : (
                <Lock className="w-8 h-8 text-gray-500" />
              )}
            </div>

            <div>
              <p className="text-base md:text-lg font-semibold text-white">
                {selectedGenre ? (
                  <>
                    Drop audio to create <span className="text-cyan-400 underline underline-offset-4">{selectedGenre}</span> remix
                  </>
                ) : (
                  'Dropzone Disabled — Select a Remix Style Above'
                )}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Supports MP3, WAV, OGG, M4A, FLAC & AIFF (Max 50MB)
              </p>
            </div>
          </div>
        </div>

        {/* Error display */}
        {errorMessage && (
          <div
            id="upload-error-alert"
            className="p-4 rounded-xl bg-red-950/60 border border-red-500/50 flex items-center space-x-3 text-red-300 text-sm animate-fade-in"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Demo track option */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-[#1A1A20] border border-gray-800">
          <div className="flex items-center space-x-3 text-left">
            <FileAudio className="w-5 h-5 text-violet-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-200">Don't have an audio file ready?</p>
              <p className="text-xs text-gray-500">
                Synthesize a demo chord track instantly and auto-remix into {selectedGenre || 'your chosen style'}.
              </p>
            </div>
          </div>

          <button
            id="load-demo-btn"
            type="button"
            onClick={handleLoadDemo}
            disabled={isLoading || isDemoLoading || !selectedGenre}
            className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-white font-semibold text-sm flex items-center justify-center space-x-2 transition-all shadow-md ${
              selectedGenre
                ? 'bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 shadow-violet-900/30'
                : 'bg-gray-800 opacity-50 cursor-not-allowed'
            }`}
          >
            <Sparkles className="w-4 h-4 text-cyan-200" />
            <span>{isDemoLoading ? 'Synthesizing Demo...' : selectedGenre ? `Remix Demo as ${selectedGenre}` : 'Select Style First'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
