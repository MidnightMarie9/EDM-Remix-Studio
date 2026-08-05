import React, { useState } from 'react';
import { Download, FileAudio, Check, Sliders, HardDrive, Sparkles } from 'lucide-react';
import { audioBufferToWavBlob } from '../utils/wavEncoder';
import { audioBufferToMp3Blob } from '../utils/mp3Encoder';
import { GenreType } from '../types';

interface ExportModalProps {
  remixedBuffer: AudioBuffer | null;
  trackName: string;
  artistName?: string;
  bpm?: number;
  genre: GenreType;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  remixedBuffer,
  trackName,
  artistName = 'Unknown Artist',
  bpm,
  genre,
}) => {
  const [exportFormat, setExportFormat] = useState<'WAV' | 'MP3'>('WAV');
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [lastDownloaded, setLastDownloaded] = useState<string | null>(null);

  const cleanName = trackName.replace(/\.[^/.]+$/, '').trim() || 'EDM_Remix';
  const cleanArtist = (artistName || 'Unknown Artist').trim();
  const bpmTag = bpm ? `_${bpm}BPM` : '';
  const baseFilename = `${cleanArtist}_-_${cleanName}${bpmTag}_${genre}_Remix`.replace(/\s+/g, '_');

  const handleDownload = (formatToUse = exportFormat) => {
    if (!remixedBuffer) return;
    setIsExporting(formatToUse);
    setTimeout(() => {
      try {
        let blob: Blob;
        let ext: string;
        if (formatToUse === 'WAV') {
          blob = audioBufferToWavBlob(remixedBuffer);
          ext = 'wav';
        } else {
          blob = audioBufferToMp3Blob(remixedBuffer, 320); // 320kbps high quality export
          ext = 'mp3';
        }
        const filename = `${baseFilename}.${ext}`;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setLastDownloaded(filename);
      } catch (err) {
        console.error(`${formatToUse} export error:`, err);
      } finally {
        setIsExporting(null);
      }
    }, 100);
  };

  return (
    <div id="export-master-section" className="bg-[#141417] border border-[#1E1E22] rounded-xl p-3.5 md:p-4 shadow-xl space-y-3.5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-800/80 pb-2.5 gap-2">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-gradient-to-tr from-violet-600/30 to-cyan-600/30 border border-violet-500/40 text-violet-300">
            <Download className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-white tracking-wide">Export Master Track</h3>
            <p className="text-[11px] text-gray-400">
              Studio-grade export engine for club & streaming distribution
            </p>
          </div>
        </div>

        {remixedBuffer && (
          <div className="flex items-center space-x-2 text-[10px] font-mono text-gray-400 bg-[#0E0E11] px-2.5 py-1 rounded-lg border border-[#2A2A2E]">
            <span>{Math.floor(remixedBuffer.duration / 60)}:{(Math.floor(remixedBuffer.duration % 60)).toString().padStart(2, '0')}</span>
            <span>•</span>
            <span className="text-cyan-400 font-bold">{(remixedBuffer.sampleRate / 1000).toFixed(1)} kHz</span>
            <span>•</span>
            <span className="text-violet-400 font-bold">
              {exportFormat === 'WAV' ? '24-Bit PCM (Lossless)' : '320 kbps MP3'}
            </span>
          </div>
        )}
      </div>

      {/* Format Toggle & Quality Option Selector */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-gray-300 flex items-center space-x-1.5">
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span>Select Export Quality & Format</span>
          </label>
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30 font-semibold">
            {exportFormat === 'WAV' ? 'Uncompressed Audio' : 'Max Bitrate Compressed'}
          </span>
        </div>

        {/* Segmented Quality Toggle Buttons */}
        <div className="grid grid-cols-2 gap-2 bg-[#0E0E11] p-1 rounded-xl border border-[#2A2A2E]">
          {/* WAV Toggle */}
          <button
            id="toggle-format-wav"
            type="button"
            onClick={() => setExportFormat('WAV')}
            className={`p-2.5 rounded-lg flex items-center justify-between transition-all cursor-pointer ${
              exportFormat === 'WAV'
                ? 'bg-gradient-to-r from-violet-800/80 to-violet-700/80 border border-violet-400/60 text-white shadow-md'
                : 'text-gray-400 hover:text-gray-200 hover:bg-[#18181D]'
            }`}
          >
            <div className="flex items-center space-x-2 text-left">
              <FileAudio className={`w-4 h-4 ${exportFormat === 'WAV' ? 'text-cyan-300' : 'text-gray-500'}`} />
              <div>
                <div className="text-xs font-black tracking-wide">WAV</div>
                <div className="text-[10px] text-gray-300 font-sans">Uncompressed</div>
              </div>
            </div>
            <span
              className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                exportFormat === 'WAV'
                  ? 'bg-violet-950 text-cyan-300 border-cyan-400/50'
                  : 'bg-gray-900 text-gray-500 border-gray-800'
              }`}
            >
              24-BIT LOSSLESS
            </span>
          </button>

          {/* MP3 Toggle */}
          <button
            id="toggle-format-mp3"
            type="button"
            onClick={() => setExportFormat('MP3')}
            className={`p-2.5 rounded-lg flex items-center justify-between transition-all cursor-pointer ${
              exportFormat === 'MP3'
                ? 'bg-gradient-to-r from-cyan-950/90 to-cyan-900/90 border border-cyan-400/60 text-white shadow-md'
                : 'text-gray-400 hover:text-gray-200 hover:bg-[#18181D]'
            }`}
          >
            <div className="flex items-center space-x-2 text-left">
              <FileAudio className={`w-4 h-4 ${exportFormat === 'MP3' ? 'text-cyan-300' : 'text-gray-500'}`} />
              <div>
                <div className="text-xs font-black tracking-wide">MP3</div>
                <div className="text-[10px] text-cyan-200/80 font-sans">320 kbps Quality</div>
              </div>
            </div>
            <span
              className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                exportFormat === 'MP3'
                  ? 'bg-cyan-950 text-cyan-300 border-cyan-400/50'
                  : 'bg-gray-900 text-gray-500 border-gray-800'
              }`}
            >
              320 KBPS
            </span>
          </button>
        </div>
      </div>

      {/* Main Download Action */}
      <div className="pt-1">
        <button
          id="export-primary-btn"
          type="button"
          disabled={!remixedBuffer || isExporting !== null}
          onClick={() => handleDownload(exportFormat)}
          className={`w-full py-3 px-4 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg transition-all cursor-pointer disabled:opacity-50 ${
            exportFormat === 'WAV'
              ? 'bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white border border-violet-400/50 shadow-violet-900/40'
              : 'bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-500 hover:from-cyan-500 hover:to-emerald-400 text-white border border-cyan-400/50 shadow-cyan-900/40'
          }`}
        >
          <Download className="w-4 h-4 text-white" />
          <span>
            {isExporting ? `Encoding ${exportFormat}...` : `Export Master as ${exportFormat === 'WAV' ? '24-Bit WAV (Uncompressed)' : '320kbps MP3'}`}
          </span>
          <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
        </button>
      </div>

      {/* Output Filename Preview */}
      <div className="flex items-center justify-between text-[11px] text-gray-400 bg-[#0E0E11] px-3 py-1.5 rounded-lg border border-[#2A2A2E]">
        <div className="flex items-center space-x-1.5 truncate">
          <HardDrive className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
          <span className="text-gray-500">Output File:</span>
          <span className="font-mono text-cyan-300 font-semibold truncate">
            {baseFilename}.{exportFormat.toLowerCase()}
          </span>
        </div>
        <span className="text-[10px] text-gray-500 hidden sm:inline flex-shrink-0 pl-2">
          Includes edited metadata
        </span>
      </div>

      {/* Export Status feedback */}
      {isExporting && (
        <div className="p-2 rounded-lg bg-violet-950/40 border border-violet-500/30 flex items-center space-x-2 text-[11px] text-violet-300">
          <div className="w-3 h-3 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <span>Encoding high-resolution master audio buffer to {isExporting}...</span>
        </div>
      )}

      {lastDownloaded && !isExporting && (
        <div className="p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/30 flex items-center space-x-2 text-[11px] text-emerald-300">
          <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
          <span className="truncate">Exported successfully: {lastDownloaded}</span>
        </div>
      )}
    </div>
  );
};
