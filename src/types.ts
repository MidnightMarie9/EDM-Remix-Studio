export type VocalMode =
  | 'keep_original'
  | 'chop_hook'
  | 'stutter_edit'
  | 'pitched_chop'
  | 'minimal_instrumental';

export type VocalReplaceMode = 'vocal_chops' | 'synthetic_voice' | 'instrumental_only';

export interface VocalSettings {
  autoRebuildVocals: boolean; // Pro Mode: Replace Bad Vocals with AI Voice / Chops
  replaceMode: VocalReplaceMode;
  mode: VocalMode;
  fixStrength: number; // 0 to 100 (85 = Aggressive Rebuild default)
  addAdLibs: boolean;
  repeatHookOnDrop: boolean;
  volume: number; // 0 to 1 (default 0.70)
  reverbDelay: number; // 0 to 1
  pitchKey: string;
  // NEW - Time & Space Lab
  speed?: number; // 0.5x - 2.0x
  pitchShift?: number; // -12 to +12 st
  reverbType?: 'hall' | 'plate' | 'cathedral' | 'room';
  delayMix?: number; // 0 to 1
  autoFitToBeat?: boolean;
}

export type GenreType =
  | 'Zedd'
  | 'Slushii'
  | 'Alan Walker'
  | 'Skrillex'
  | 'Excision'
  | 'Zomboy'
  | 'Techno'
  | 'House'
  | 'Dubstep'
  | 'Chillstep'
  | 'Trance'
  | 'Drum & Bass'
  | 'Future Bass'
  | 'Lo-fi House';

export interface KeptStemLayer {
  id: string;
  name: string;
  type: 'vocals' | 'melody' | 'chords';
  muted: boolean;
  solo: boolean;
  volume: number;
}

export interface AddedSynthLayer {
  id: string;
  name: string;
  type: 'kick' | 'subbass' | 'synth_arp' | 'wobble' | 'pads' | 'hihats' | 'vocal_chop';
  enabled: boolean;
  volume: number;
}

export interface RemovedOriginalLayer {
  id: string;
  name: string;
  type: 'original_drums' | 'original_bass' | 'original_vocal';
  restored: boolean; // if true, original element is not filtered out
}

export interface LayerState {
  kept: KeptStemLayer[];
  added: AddedSynthLayer[];
  removed: RemovedOriginalLayer[];
}

export interface GenreInfo {
  id: GenreType;
  name: string;
  artistTag: string;
  signature: string;
  defaultBpm: number;
  description: string;
  color: string;
  iconName: string;
  kickPattern: 'four-on-floor' | 'breakbeat' | 'half-step' | 'house-classic' | 'lofi';
  filterType: BiquadFilterType;
  defaultFilterFreq: number;
  defaultResonance: number;
  sidechainDepth: number;
  reverbWet: number;
  delayWet: number;
  drive: number;
  wobbleSpeed: number; // LFO speed in Hz if applicable
  defaultLayers: LayerState;
  vocalConfig?: Partial<VocalSettings>;
}

export interface FxSettings {
  filterFreq: number;       // 100 to 20000 Hz
  filterResonance: number;  // 0 to 20 Q
  filterType: BiquadFilterType;
  sidechainDepth: number;   // 0 to 1
  kickVolume: number;       // 0 to 1.5
  bassDrive: number;        // 0 to 1 (saturation/distortion)
  reverbWet: number;        // 0 to 1
  delayWet: number;         // 0 to 1
  pitchShift: number;       // -12 to +12 semitones
  tempoRate: number;        // 0.5 to 2.0 multiplier
}

export interface TrackMetadata {
  name: string;
  artist?: string;
  size: number;
  type: string;
  duration: number;
  sampleRate: number;
  numberOfChannels: number;
  detectedBpm: number;
}

export interface AiAnalysis {
  advice: string;
  recommendedBpm: number;
  keyElements: string[];
  presetNotes: string;
}

export interface AudioProcessingStatus {
  isProcessing: boolean;
  progress: number;
  stage: string;
  error?: string;
}
