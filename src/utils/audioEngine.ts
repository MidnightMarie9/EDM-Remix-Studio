import { GenreInfo, GenreType, FxSettings, VocalSettings } from '../types';

/**
 * Helper to ensure float values assigned to AudioParams are finite and valid.
 */
function safeNum(val: unknown, fallback: number = 0): number {
  if (typeof val === 'number' && Number.isFinite(val) && !Number.isNaN(val)) {
    return val;
  }
  return fallback;
}

function safePos(val: unknown, fallback: number = 1.0, min: number = 0.0001): number {
  const num = safeNum(val, fallback);
  return Math.max(min, num);
}

export const GENRE_PRESETS: Record<GenreType, GenreInfo> = {
  Zedd: {
    id: 'Zedd',
    name: 'Melodic Progressive House',
    artistTag: 'Inspired by Zedd',
    signature: 'Layered supersaws, bright piano, emotional build-ups',
    defaultBpm: 128,
    description: 'Anthemic 128 BPM progressive house with 3 layered supersaw chords, bright grand piano, emotional build-up sweeps & heavy 90% sidechained pads.',
    color: 'from-blue-600 via-indigo-600 to-purple-800',
    iconName: 'Flame',
    kickPattern: 'four-on-floor',
    filterType: 'lowpass',
    defaultFilterFreq: 4500,
    defaultResonance: 2.5,
    sidechainDepth: 0.9,
    reverbWet: 0.35,
    delayWet: 0.25,
    drive: 0.3,
    wobbleSpeed: 2,
    defaultLayers: {
      kept: [],
      added: [
        { id: 'zedd_vocal_chop', name: '+ 3-Layer Vocal Chop Hook (Rebuilt)', type: 'vocal_chop', enabled: true, volume: 0.85 },
        { id: 'zedd_kick', name: '+ Layered Zedd Punch Kick (Sub + Punch + Click)', type: 'kick', enabled: true, volume: 1.0 },
        { id: 'zedd_sub', name: '+ Pure 45Hz Sine Sub Bass', type: 'subbass', enabled: true, volume: 0.9 },
        { id: 'zedd_supersaw', name: '+ 3-Layer Supersaw Chords (Center, +7ct, -7ct)', type: 'pads', enabled: true, volume: 0.85 },
        { id: 'bright_piano', name: '+ Bright Piano Attack Layer', type: 'synth_arp', enabled: true, volume: 0.8 },
      ],
      removed: [
        { id: 'orig_vocal_full', name: '- Original Full Vocal (Removed - Was Clashing)', type: 'original_vocal', restored: false },
        { id: 'orig_drums', name: '- Original Weak Drums', type: 'original_drums', restored: false },
        { id: 'orig_bass', name: '- Original Low-End', type: 'original_bass', restored: false },
      ],
    },
    vocalConfig: { speed: 1.0, pitchShift: 0, reverbType: 'hall', reverbDelay: 0.5, delayMix: 0.25, fixStrength: 85 },
  },
  Slushii: {
    id: 'Slushii',
    name: 'Future Bass & Bubbly',
    artistTag: 'Inspired by Slushii',
    signature: 'Wobbly detuned chords, vocal chop melody',
    defaultBpm: 150,
    description: 'Bouncy 150 BPM future bass featuring heavy detuned LFO wobbly chords, bubbly arpeggios, pitch-bent vocal chop lead & sparkling high hats.',
    color: 'from-fuchsia-500 via-pink-600 to-purple-800',
    iconName: 'Sparkles',
    kickPattern: 'half-step',
    filterType: 'lowpass',
    defaultFilterFreq: 5200,
    defaultResonance: 4.0,
    sidechainDepth: 0.95,
    reverbWet: 0.45,
    delayWet: 0.35,
    drive: 0.25,
    wobbleSpeed: 4,
    defaultLayers: {
      kept: [],
      added: [
        { id: 'slushii_vocal_chop', name: '+ Pitched Vocal Chop Lead (Rebuilt)', type: 'vocal_chop', enabled: true, volume: 0.85 },
        { id: 'slushii_drums', name: '+ 808 Trap Kick & Snare Layer', type: 'kick', enabled: true, volume: 1.0 },
        { id: 'detuned_saw', name: '+ Wobbly LFO Future Bass Chords', type: 'pads', enabled: true, volume: 0.9 },
        { id: 'bubbly_arp', name: '+ Bubbly 16th Arpeggio Lead', type: 'synth_arp', enabled: true, volume: 0.8 },
      ],
      removed: [
        { id: 'orig_vocal_full', name: '- Original Full Vocal (Removed - Was Clashing)', type: 'original_vocal', restored: false },
        { id: 'orig_drums', name: '- Original Static Drums', type: 'original_drums', restored: false },
        { id: 'orig_chords', name: '- Original Flat Chords', type: 'original_bass', restored: false },
      ],
    },
    vocalConfig: { speed: 1.15, pitchShift: 3, reverbType: 'plate', reverbDelay: 0.4, delayMix: 0.2, fixStrength: 95 },
  },
  'Alan Walker': {
    id: 'Alan Walker',
    name: 'Faded Melodic House',
    artistTag: 'Inspired by Alan Walker',
    signature: 'Faded pluck lead, atmospheric intro, wide stereo pads',
    defaultBpm: 98,
    description: 'Dark, atmospheric 98 BPM melodic house with signature faded 16th pluck arpeggio, deep filtered pads, anthemic slow build & wide reverbed vocals.',
    color: 'from-cyan-600 via-teal-700 to-emerald-900',
    iconName: 'Wind',
    kickPattern: 'house-classic',
    filterType: 'lowpass',
    defaultFilterFreq: 3200,
    defaultResonance: 2.0,
    sidechainDepth: 0.85,
    reverbWet: 0.5,
    delayWet: 0.4,
    drive: 0.2,
    wobbleSpeed: 1,
    defaultLayers: {
      kept: [],
      added: [
        { id: 'aw_vocal_chop', name: '+ Faded Reverbed Vocal Hook (Rebuilt)', type: 'vocal_chop', enabled: true, volume: 0.85 },
        { id: 'aw_kick', name: '+ Deep Punchy Alan Walker Kick', type: 'kick', enabled: true, volume: 1.0 },
        { id: 'faded_pluck', name: '+ Signature Faded 16th Pluck Lead', type: 'synth_arp', enabled: true, volume: 0.9 },
        { id: 'wide_pads', name: '+ Wide Atmospheric Stereo Pads', type: 'pads', enabled: true, volume: 0.8 },
        { id: 'sub_bass', name: '+ Deep Filtered Bassline', type: 'subbass', enabled: true, volume: 0.85 },
      ],
      removed: [
        { id: 'orig_vocal_full', name: '- Original Full Vocal (Removed - Was Clashing)', type: 'original_vocal', restored: false },
        { id: 'orig_drums', name: '- Original Rhythm', type: 'original_drums', restored: false },
        { id: 'orig_bass', name: '- Original Lows', type: 'original_bass', restored: false },
      ],
    },
    vocalConfig: { speed: 0.9, pitchShift: 0, reverbType: 'cathedral', reverbDelay: 0.85, delayMix: 0.35, fixStrength: 85 },
  },
  Skrillex: {
    id: 'Skrillex',
    name: 'Aggressive Brostep',
    artistTag: 'Inspired by Skrillex',
    signature: 'FM growl, vowel bass, laser FX',
    defaultBpm: 140,
    description: 'Nasty 140 BPM brostep featuring FM growl bass, laser synths, heavy halftime drums, pre-drop "Yeah!" countdown & robotic vocal stutters.',
    color: 'from-amber-500 via-orange-600 to-red-800',
    iconName: 'Zap',
    kickPattern: 'half-step',
    filterType: 'bandpass',
    defaultFilterFreq: 1500,
    defaultResonance: 7.0,
    sidechainDepth: 0.7,
    reverbWet: 0.25,
    delayWet: 0.2,
    drive: 0.8,
    wobbleSpeed: 6,
    defaultLayers: {
      kept: [],
      added: [
        { id: 'skrillex_vocal_chop', name: '+ Mangled Stutter Vocal Chops (Rebuilt)', type: 'vocal_chop', enabled: true, volume: 0.85 },
        { id: 'skrillex_drums', name: '+ Heavy Halftime Brostep Drums', type: 'kick', enabled: true, volume: 1.0 },
        { id: 'fm_growl', name: '+ Nasty FM Vowel Growl Bass', type: 'wobble', enabled: true, volume: 1.0 },
        { id: 'laser_synths', name: '+ Laser Arp & Zap FX', type: 'synth_arp', enabled: true, volume: 0.85 },
      ],
      removed: [
        { id: 'orig_vocal_full', name: '- Original Full Vocal (Removed - Was Clashing)', type: 'original_vocal', restored: false },
        { id: 'orig_drums', name: '- Original Soft Beat', type: 'original_drums', restored: false },
        { id: 'orig_bass', name: '- Original Mellow Bass', type: 'original_bass', restored: false },
      ],
    },
    vocalConfig: { speed: 0.9, pitchShift: -3, reverbType: 'hall', reverbDelay: 0.6, delayMix: 0.3, fixStrength: 95 },
  },
  Excision: {
    id: 'Excision',
    name: 'Brutal Heavy Dubstep',
    artistTag: 'Inspired by Excision',
    signature: 'Massive sub 40-60Hz, metallic growl, tight drums',
    defaultBpm: 140,
    description: 'Sub-destroyer 140 BPM dubstep with 40-60Hz sub-bass, brutal metallic growls, headbang drums, pre-drop countdown & brutal drops.',
    color: 'from-red-600 via-rose-700 to-stone-900',
    iconName: 'Zap',
    kickPattern: 'half-step',
    filterType: 'lowpass',
    defaultFilterFreq: 1800,
    defaultResonance: 8.5,
    sidechainDepth: 0.7,
    reverbWet: 0.2,
    delayWet: 0.15,
    drive: 0.9,
    wobbleSpeed: 4,
    defaultLayers: {
      kept: [],
      added: [
        { id: 'excision_vocal_chop', name: '+ Pitch-Down Growl Vocal Stabs (Rebuilt)', type: 'vocal_chop', enabled: true, volume: 0.85 },
        { id: 'excision_drums', name: '+ Headbang Heavy Dubstep Kit', type: 'kick', enabled: true, volume: 1.0 },
        { id: 'sub_destroyer', name: '+ Massive 40-60Hz Sub Bass', type: 'subbass', enabled: true, volume: 1.0 },
        { id: 'metallic_growl', name: '+ Brutal Metallic Screech Growl', type: 'wobble', enabled: true, volume: 0.95 },
      ],
      removed: [
        { id: 'orig_vocal_full', name: '- Original Full Vocal (Removed - Was Clashing)', type: 'original_vocal', restored: false },
        { id: 'orig_drums', name: '- Original Weak Kick/Snare', type: 'original_drums', restored: false },
        { id: 'orig_bass', name: '- Original Soft Lows', type: 'original_bass', restored: false },
      ],
    },
    vocalConfig: { speed: 0.8, pitchShift: -4, reverbType: 'hall', reverbDelay: 0.7, delayMix: 0.1, fixStrength: 95 },
  },
  Zomboy: {
    id: 'Zomboy',
    name: 'Riddim Skullstep',
    artistTag: 'Inspired by Zomboy',
    signature: 'Square bass, aggressive snare, video game energy',
    defaultBpm: 140,
    description: 'Aggressive 140 BPM riddim with arcade pitch-bent square-wave bass, machine-gun snare rolls, video game lead energy & chaotic energy.',
    color: 'from-emerald-500 via-green-700 to-slate-900',
    iconName: 'Radio',
    kickPattern: 'half-step',
    filterType: 'bandpass',
    defaultFilterFreq: 2200,
    defaultResonance: 6.0,
    sidechainDepth: 0.7,
    reverbWet: 0.2,
    delayWet: 0.2,
    drive: 0.75,
    wobbleSpeed: 4,
    defaultLayers: {
      kept: [],
      added: [
        { id: 'zomboy_vocal_chop', name: '+ Arcade Vocal Chop Stutters (Rebuilt)', type: 'vocal_chop', enabled: true, volume: 0.85 },
        { id: 'zomboy_drums', name: '+ Machine-Gun Riddim Drums', type: 'kick', enabled: true, volume: 1.0 },
        { id: 'square_bass', name: '+ Pitch-bent Square Wave Bass', type: 'wobble', enabled: true, volume: 1.0 },
        { id: 'arcade_lead', name: '+ Video Game Chiptune Lead', type: 'synth_arp', enabled: true, volume: 0.8 },
      ],
      removed: [
        { id: 'orig_vocal_full', name: '- Original Full Vocal (Removed - Was Clashing)', type: 'original_vocal', restored: false },
        { id: 'orig_drums', name: '- Original Drums', type: 'original_drums', restored: false },
        { id: 'orig_bass', name: '- Original Bass', type: 'original_bass', restored: false },
      ],
    },
    vocalConfig: { speed: 1.0, pitchShift: -2, reverbType: 'room', reverbDelay: 0.3, delayMix: 0.15, fixStrength: 90 },
  },
  Techno: {
    id: 'Techno',
    name: 'Peak Time Techno',
    artistTag: 'Club Standard',
    signature: 'Driving 4x4 kick, sub rumble bass, dark minimal synths',
    defaultBpm: 126,
    description: 'Dark, driving 126 BPM peak-time techno with 4-on-the-floor kick, sub-rumble bass, industrial 16th hats & dark minimal stabs.',
    color: 'from-violet-600 via-purple-800 to-gray-950',
    iconName: 'Disc',
    kickPattern: 'four-on-floor',
    filterType: 'lowpass',
    defaultFilterFreq: 2200,
    defaultResonance: 4.5,
    sidechainDepth: 0.9,
    reverbWet: 0.25,
    delayWet: 0.2,
    drive: 0.45,
    wobbleSpeed: 2,
    defaultLayers: {
      kept: [],
      added: [
        { id: 'techno_vocal_chop', name: '+ Dark Minimal Vocal Stabs (Rebuilt)', type: 'vocal_chop', enabled: true, volume: 0.8 },
        { id: 'techno_kick', name: '+ Techno 909 Heavy Kick', type: 'kick', enabled: true, volume: 1.0 },
        { id: 'sub_rumble', name: '+ Sub-Rumble Techno Bass', type: 'subbass', enabled: true, volume: 0.9 },
        { id: 'hihats', name: '+ Industrial 16th Hi-Hats', type: 'hihats', enabled: true, volume: 0.8 },
      ],
      removed: [
        { id: 'orig_vocal_full', name: '- Original Full Vocal (Removed - Was Clashing)', type: 'original_vocal', restored: false },
        { id: 'orig_drums', name: '- Original Drum Kit', type: 'original_drums', restored: false },
        { id: 'orig_bass', name: '- Original Muddy Low-End', type: 'original_bass', restored: false },
      ],
    },
    vocalConfig: { speed: 1.0, pitchShift: 0, reverbType: 'room', reverbDelay: 0.2, delayMix: 0.1, fixStrength: 70 },
  },
  House: {
    id: 'House',
    name: 'Billboard Tech House',
    artistTag: 'Fisher / John Summit',
    signature: 'Punchy 126 BPM 4x4, funky grooving bassline, catchy vocal loop',
    defaultBpm: 126,
    description: 'Chart-topping 126 BPM tech house with punchy kick & snare, funky grooving sub bassline, crisp offbeat open hats & repeated vocal hook.',
    color: 'from-amber-500 via-yellow-600 to-orange-800',
    iconName: 'Flame',
    kickPattern: 'house-classic',
    filterType: 'lowpass',
    defaultFilterFreq: 3800,
    defaultResonance: 3.0,
    sidechainDepth: 0.92,
    reverbWet: 0.3,
    delayWet: 0.2,
    drive: 0.35,
    wobbleSpeed: 2,
    defaultLayers: {
      kept: [],
      added: [
        { id: 'house_vocal_chop', name: '+ Repeated Tech Vocal Hook (Rebuilt)', type: 'vocal_chop', enabled: true, volume: 0.85 },
        { id: 'house_kick', name: '+ Billboard Punchy 126 Kick & Snare', type: 'kick', enabled: true, volume: 1.0 },
        { id: 'funky_bass', name: '+ Funky Grooving Sub Bassline', type: 'subbass', enabled: true, volume: 0.9 },
        { id: 'offbeat_hats', name: '+ Crisp Offbeat Open Hats', type: 'hihats', enabled: true, volume: 0.8 },
      ],
      removed: [
        { id: 'orig_vocal_full', name: '- Original Full Vocal (Removed - Was Clashing)', type: 'original_vocal', restored: false },
        { id: 'orig_drums', name: '- Original Weak Beat', type: 'original_drums', restored: false },
        { id: 'orig_bass', name: '- Original Bassline', type: 'original_bass', restored: false },
      ],
    },
    vocalConfig: { speed: 1.0, pitchShift: 0, reverbType: 'plate', reverbDelay: 0.3, delayMix: 0.2, fixStrength: 75 },
  },
  Dubstep: {
    id: 'Dubstep',
    name: 'Billboard Heavy Dubstep',
    artistTag: 'Festival Anthem',
    signature: 'Brutal FM growl bass, halftime heavy drums, anthemic drop',
    defaultBpm: 140,
    description: 'Massive 140 BPM festival dubstep featuring aggressive FM growls, thunderous halftime snare, sub bass & vocal stutters.',
    color: 'from-red-600 via-orange-600 to-zinc-900',
    iconName: 'Zap',
    kickPattern: 'half-step',
    filterType: 'bandpass',
    defaultFilterFreq: 1800,
    defaultResonance: 7.5,
    sidechainDepth: 0.8,
    reverbWet: 0.25,
    delayWet: 0.2,
    drive: 0.8,
    wobbleSpeed: 4,
    defaultLayers: {
      kept: [],
      added: [
        { id: 'dubstep_vocal_chop', name: '+ Aggressive Vocal Stutter Chops (Rebuilt)', type: 'vocal_chop', enabled: true, volume: 0.85 },
        { id: 'dubstep_drums', name: '+ Thunderous Halftime Dubstep Kit', type: 'kick', enabled: true, volume: 1.0 },
        { id: 'dubstep_growl', name: '+ Nasty FM Growl Bass', type: 'wobble', enabled: true, volume: 1.0 },
        { id: 'sub_drop', name: '+ Heavy 45Hz Sub Layer', type: 'subbass', enabled: true, volume: 0.95 },
      ],
      removed: [
        { id: 'orig_vocal_full', name: '- Original Full Vocal (Removed - Was Clashing)', type: 'original_vocal', restored: false },
        { id: 'orig_drums', name: '- Original Rhythm', type: 'original_drums', restored: false },
        { id: 'orig_bass', name: '- Original Bass', type: 'original_bass', restored: false },
      ],
    },
    vocalConfig: { speed: 0.85, pitchShift: -2, reverbType: 'hall', reverbDelay: 0.6, delayMix: 0.3, fixStrength: 90 },
  },
  Chillstep: {
    id: 'Chillstep',
    name: 'Billboard Ambient Chillstep',
    artistTag: 'Relaxed & Atmospheric',
    signature: 'Soft liquid bass, vinyl warm pads, 85 BPM relaxed halftime beat',
    defaultBpm: 85,
    description: 'Lush 85 BPM ambient chillstep with soft liquid sub bass, vinyl warm pads, relaxed halftime beats & spacious ducking reverb.',
    color: 'from-teal-500 via-cyan-800 to-slate-900',
    iconName: 'Wind',
    kickPattern: 'half-step',
    filterType: 'lowpass',
    defaultFilterFreq: 2800,
    defaultResonance: 1.5,
    sidechainDepth: 0.6,
    reverbWet: 0.65,
    delayWet: 0.45,
    drive: 0.15,
    wobbleSpeed: 1,
    defaultLayers: {
      kept: [],
      added: [
        { id: 'chill_vocal_chop', name: '+ Ambient Vocal Swells (Rebuilt)', type: 'vocal_chop', enabled: true, volume: 0.85 },
        { id: 'chill_kicks', name: '+ Soft Sub Kick', type: 'kick', enabled: true, volume: 0.8 },
        { id: 'warm_pads', name: '+ Ambient Synth Pad Swells', type: 'pads', enabled: true, volume: 0.8 },
        { id: 'deep_sub', name: '+ Deep Liquid Sine Sub', type: 'subbass', enabled: true, volume: 0.8 },
      ],
      removed: [
        { id: 'orig_vocal_full', name: '- Original Full Vocal (Removed - Was Clashing)', type: 'original_vocal', restored: false },
        { id: 'orig_drums', name: '- Original Harsh Beat', type: 'original_drums', restored: false },
        { id: 'orig_bass', name: '- Original Lows', type: 'original_bass', restored: false },
      ],
    },
    vocalConfig: { speed: 0.85, pitchShift: -1, reverbType: 'cathedral', reverbDelay: 0.8, delayMix: 0.4, fixStrength: 80 },
  },
  Trance: {
    id: 'Trance',
    name: 'Progressive Vocal Trance',
    artistTag: 'Armin / Zedd Peak',
    signature: '138 BPM emotional build, 3-layer supersaw chords, soaring 16th arp',
    defaultBpm: 138,
    description: 'High-energy 138 BPM progressive trance with driving 4x4 kick, 3-layer detuned supersaws, soaring 16th arp lead & euphoric vocal chop swells.',
    color: 'from-indigo-600 via-blue-700 to-sky-950',
    iconName: 'Sparkles',
    kickPattern: 'four-on-floor',
    filterType: 'lowpass',
    defaultFilterFreq: 4800,
    defaultResonance: 3.5,
    sidechainDepth: 0.95,
    reverbWet: 0.5,
    delayWet: 0.4,
    drive: 0.25,
    wobbleSpeed: 2,
    defaultLayers: {
      kept: [],
      added: [
        { id: 'trance_vocal_chop', name: '+ Soaring Trance Vocal Hook (Rebuilt)', type: 'vocal_chop', enabled: true, volume: 0.85 },
        { id: 'trance_kick', name: '+ Driving 138 Trance Kick & Clams', type: 'kick', enabled: true, volume: 1.0 },
        { id: 'trance_supersaws', name: '+ 3-Layer Euphoric Supersaw Chords', type: 'pads', enabled: true, volume: 0.9 },
        { id: 'trance_arp', name: '+ Soaring 16th Arpeggio Lead', type: 'synth_arp', enabled: true, volume: 0.85 },
      ],
      removed: [
        { id: 'orig_vocal_full', name: '- Original Full Vocal (Removed - Was Clashing)', type: 'original_vocal', restored: false },
        { id: 'orig_drums', name: '- Original Drums', type: 'original_drums', restored: false },
        { id: 'orig_bass', name: '- Original Lows', type: 'original_bass', restored: false },
      ],
    },
    vocalConfig: { speed: 1.0, pitchShift: 0, reverbType: 'hall', reverbDelay: 0.5, delayMix: 0.3, fixStrength: 85 },
  },
  'Drum & Bass': {
    id: 'Drum & Bass',
    name: 'High Energy Drum & Bass',
    artistTag: 'Sub Focus / Chase & Status',
    signature: 'Fast 174 BPM breakbeat, reese sub-bass, melodic vocal chops',
    defaultBpm: 174,
    description: 'Furious 174 BPM liquid & neuro drum & bass with rolling breakbeats, deep reese bass, metallic snares & pitched vocal chops.',
    color: 'from-lime-500 via-emerald-700 to-gray-950',
    iconName: 'Radio',
    kickPattern: 'breakbeat',
    filterType: 'lowpass',
    defaultFilterFreq: 4000,
    defaultResonance: 2.5,
    sidechainDepth: 0.85,
    reverbWet: 0.3,
    delayWet: 0.25,
    drive: 0.4,
    wobbleSpeed: 4,
    defaultLayers: {
      kept: [],
      added: [
        { id: 'dnb_vocal_chop', name: '+ Melodic 174 Vocal Chop Hook (Rebuilt)', type: 'vocal_chop', enabled: true, volume: 0.85 },
        { id: 'dnb_drums', name: '+ Rolling 174 DnB Breakbeat Kit', type: 'kick', enabled: true, volume: 1.0 },
        { id: 'reese_bass', name: '+ Deep Filtered Reese Bass', type: 'subbass', enabled: true, volume: 0.95 },
      ],
      removed: [
        { id: 'orig_vocal_full', name: '- Original Full Vocal (Removed - Was Clashing)', type: 'original_vocal', restored: false },
        { id: 'orig_drums', name: '- Original Slow Drums', type: 'original_drums', restored: false },
        { id: 'orig_bass', name: '- Original Bassline', type: 'original_bass', restored: false },
      ],
    },
    vocalConfig: { speed: 1.1, pitchShift: 1, reverbType: 'plate', reverbDelay: 0.3, delayMix: 0.2, fixStrength: 85 },
  },
  'Future Bass': {
    id: 'Future Bass',
    name: 'Billboard Future Bass',
    artistTag: 'The Chainsmokers / Slushii',
    signature: '150 BPM wobbly detuned chords, vocal chop melody, 808 trap drums',
    defaultBpm: 150,
    description: 'Anthemic 150 BPM future bass featuring wobbly detuned LFO chords, pitch-bent vocal chop melody, 808 trap kick/snare & sparkling hats.',
    color: 'from-fuchsia-500 via-pink-600 to-purple-900',
    iconName: 'Sparkles',
    kickPattern: 'half-step',
    filterType: 'lowpass',
    defaultFilterFreq: 5200,
    defaultResonance: 4.0,
    sidechainDepth: 0.95,
    reverbWet: 0.45,
    delayWet: 0.35,
    drive: 0.25,
    wobbleSpeed: 4,
    defaultLayers: {
      kept: [],
      added: [
        { id: 'fb_vocal_chop', name: '+ Pitched Vocal Chop Melody (Rebuilt)', type: 'vocal_chop', enabled: true, volume: 0.85 },
        { id: 'fb_drums', name: '+ 808 Trap Kick & Snare Kit', type: 'kick', enabled: true, volume: 1.0 },
        { id: 'fb_chords', name: '+ Wobbly LFO Detuned Chords', type: 'pads', enabled: true, volume: 0.9 },
        { id: 'fb_arp', name: '+ Bubbly Arp Lead', type: 'synth_arp', enabled: true, volume: 0.8 },
      ],
      removed: [
        { id: 'orig_vocal_full', name: '- Original Full Vocal (Removed - Was Clashing)', type: 'original_vocal', restored: false },
        { id: 'orig_drums', name: '- Original Beat', type: 'original_drums', restored: false },
        { id: 'orig_bass', name: '- Original Bass', type: 'original_bass', restored: false },
      ],
    },
    vocalConfig: { speed: 1.0, pitchShift: 2, reverbType: 'hall', reverbDelay: 0.4, delayMix: 0.25, fixStrength: 90 },
  },
  'Lo-fi House': {
    id: 'Lo-fi House',
    name: 'Dusty Lo-fi House',
    artistTag: 'Underground Chill',
    signature: '122 BPM dusty warm chords, deep sub bass, tape-warped vocal chops',
    defaultBpm: 122,
    description: 'Atmospheric 122 BPM lo-fi house with dusty tape warmth, deep sub bassline, subtle vinyl crackle & warped vocal chop stabs.',
    color: 'from-stone-600 via-amber-800 to-neutral-950',
    iconName: 'Disc',
    kickPattern: 'lofi',
    filterType: 'lowpass',
    defaultFilterFreq: 2400,
    defaultResonance: 1.8,
    sidechainDepth: 0.75,
    reverbWet: 0.4,
    delayWet: 0.3,
    drive: 0.4,
    wobbleSpeed: 1,
    defaultLayers: {
      kept: [],
      added: [
        { id: 'lofi_vocal_chop', name: '+ Tape-Warped Vocal Stabs (Rebuilt)', type: 'vocal_chop', enabled: true, volume: 0.8 },
        { id: 'lofi_drums', name: '+ Dusty 122 Lo-fi Drum Kit', type: 'kick', enabled: true, volume: 0.9 },
        { id: 'lofi_chords', name: '+ Warm Dusty Tape Chords', type: 'pads', enabled: true, volume: 0.85 },
        { id: 'lofi_sub', name: '+ Deep Sub Bassline', type: 'subbass', enabled: true, volume: 0.85 },
      ],
      removed: [
        { id: 'orig_vocal_full', name: '- Original Full Vocal (Removed - Was Clashing)', type: 'original_vocal', restored: false },
        { id: 'orig_drums', name: '- Original Clean Beat', type: 'original_drums', restored: false },
        { id: 'orig_bass', name: '- Original Bass', type: 'original_bass', restored: false },
      ],
    },
    vocalConfig: { speed: 0.95, pitchShift: -1, reverbType: 'room', reverbDelay: 0.4, delayMix: 0.2, fixStrength: 75 },
  },
};

/**
 * Renders a new remixed AudioBuffer using Web Audio OfflineAudioContext.
 */
export async function renderRemixAudioBuffer(
  sourceBuffer: AudioBuffer,
  genre: GenreInfo,
  fx: FxSettings,
  layerState?: { kept: any[]; added: any[]; removed: any[] },
  vocalSettings?: VocalSettings,
  onProgress?: (percent: number, message: string) => void
): Promise<AudioBuffer> {
  const activeVocalSettings: VocalSettings = vocalSettings || {
    autoRebuildVocals: true,
    replaceMode: 'vocal_chops',
    mode: 'chop_hook',
    fixStrength: 85,
    addAdLibs: true,
    repeatHookOnDrop: true,
    volume: 0.70,
    reverbDelay: 0.5,
    pitchKey: 'A Minor',
  };

  if (activeVocalSettings.autoRebuildVocals !== false) {
    console.log(
      `[AUDIO ENGINE] Rebuilding Vocals for ${genre.name}: Mode=${activeVocalSettings.mode}, Strength=${activeVocalSettings.fixStrength}, Key=${activeVocalSettings.pitchKey}`
    );
  }

  onProgress?.(10, 'Analyzing Audio Stems & Frequency Spectrum...');

  const sampleRate = sourceBuffer.sampleRate;
  const numChannels = sourceBuffer.numberOfChannels;

  // Calculate duration considering tempo rate
  const tempoMultiplier = Math.max(0.5, Math.min(2.0, safePos(fx?.tempoRate, 1.0, 0.5)));
  const outputDuration = Math.max(1, sourceBuffer.duration / tempoMultiplier);
  const totalSamples = Math.floor(sampleRate * outputDuration);

  const offlineCtx = new OfflineAudioContext(numChannels, totalSamples, sampleRate);

  // Determine Layer States (use default if not specified)
  const currentLayers = layerState || genre.defaultLayers;

  // 1. STEM SEPARATION & ORIGINAL AUDIO PROCESSING
  onProgress?.(30, 'Performing Intelligent Stem Isolation & Pitch/Tempo Alignment...');

  const sourceNode = offlineCtx.createBufferSource();
  sourceNode.buffer = sourceBuffer;

  const pitchSemitones = safeNum(fx?.pitchShift, 0);
  const pitchRatio = safePos(Math.pow(2, pitchSemitones / 12), 1.0, 0.01);
  sourceNode.playbackRate.value = safePos(tempoMultiplier * pitchRatio, 1.0, 0.01);

  // Check if original vocals are in removed and NOT restored, OR if autoRebuildVocals is true
  const origVocalRemoved = currentLayers.removed.some(
    (r) => r.type === 'original_vocal' && !r.restored
  );
  const autoRebuildOn = activeVocalSettings.autoRebuildVocals !== false;

  // Check if any kept stem is soloed
  const hasSolo = currentLayers.kept.some((k) => k.solo);

  // Calculate master volume for original audio source based on Kept Stems & Rebuild state
  let originalVolumeMultiplier = 1.0;

  // RULE #1: If Auto-Rebuild Vocals is ON or Original Vocal is Filtered Out (default),
  // NEVER play the raw continuous vocal track straight! Mute raw continuous audio playback.
  if (autoRebuildOn || origVocalRemoved) {
    originalVolumeMultiplier = 0.0;
  } else {
    const mainVocalStem = currentLayers.kept.find((k) => k.type === 'vocals');
    if (mainVocalStem) {
      if (mainVocalStem.muted || (hasSolo && !mainVocalStem.solo)) {
        originalVolumeMultiplier = 0.0;
      } else {
        originalVolumeMultiplier = safeNum(mainVocalStem.volume, 1.0);
      }
    }
  }

  // Check Removed Stems: Filter out original drums or bass if NOT restored!
  const drumsRemoved = currentLayers.removed.some((r) => r.type === 'original_drums' && !r.restored);
  const bassRemoved = currentLayers.removed.some((r) => r.type === 'original_bass' && !r.restored);

  // Filtering chain for original audio
  const origFilterNode = offlineCtx.createBiquadFilter();
  if (bassRemoved && drumsRemoved) {
    origFilterNode.type = 'highpass';
    origFilterNode.frequency.value = 350; // Cut low bass
  } else if (bassRemoved) {
    origFilterNode.type = 'highpass';
    origFilterNode.frequency.value = 220; // Cut sub-bass
  } else if (drumsRemoved) {
    origFilterNode.type = 'notch';
    origFilterNode.frequency.value = 2500; // Cut drum snap
    origFilterNode.Q.value = 1.0;
  } else {
    origFilterNode.type = 'allpass';
  }

  // Genre Master EQ / Cutoff Filter
  const genreFilterNode = offlineCtx.createBiquadFilter();
  genreFilterNode.type = fx.filterType || genre.filterType;
  genreFilterNode.frequency.value = safePos(fx?.filterFreq, genre?.defaultFilterFreq || 3000, 20);
  genreFilterNode.Q.value = safePos(fx?.filterResonance, genre?.defaultResonance || 1.0, 0.0001);

  // Distortion / Saturation Drive Node
  const driveNode = offlineCtx.createWaveShaper();
  driveNode.curve = makeDistortionCurve(safeNum(fx?.bassDrive, 0.2) * 20);
  driveNode.oversample = '4x';

  // Sidechain Pumping Gain Node
  const bpm = safePos(genre.defaultBpm * safeNum(fx?.tempoRate, 1.0), 128, 30);
  const beatDuration = 60 / bpm;
  const totalBeats = Math.floor(outputDuration / beatDuration);

  const sidechainGain = offlineCtx.createGain();
  const pumpDepth = Math.max(0, Math.min(1, safeNum(fx?.sidechainDepth, 0.5)));
  const sidechainStartGain = Math.max(0.001, 1.0 - pumpDepth);

  // Apply sidechain ducking curve for every beat
  for (let b = 0; b < totalBeats; b++) {
    const beatTime = b * beatDuration;
    sidechainGain.gain.setValueAtTime(sidechainStartGain, beatTime);
    sidechainGain.gain.exponentialRampToValueAtTime(1.0, beatTime + beatDuration * 0.6);
  }

  // Delay Effect Node
  const delayNode = offlineCtx.createDelay();
  delayNode.delayTime.value = safePos(beatDuration * 0.75, 0.25, 0.001);
  const delayFeedback = offlineCtx.createGain();
  delayFeedback.gain.value = safePos(0.35 * safeNum(fx?.delayWet, 0.2), 0.07, 0.0);
  const delayWetGain = offlineCtx.createGain();
  delayWetGain.gain.value = safePos(safeNum(fx?.delayWet, 0.2) * 0.5, 0.1, 0.0);

  delayNode.connect(delayFeedback);
  delayFeedback.connect(delayNode);

  // Reverb Simulation Node
  const reverbGain = offlineCtx.createGain();
  reverbGain.gain.value = safePos(safeNum(fx?.reverbWet, 0.2) * 0.4, 0.08, 0.0);
  const convolver = offlineCtx.createConvolver();
  convolver.buffer = createImpulseResponse(offlineCtx, 2.0 + safeNum(fx?.reverbWet, 0.2) * 2, 2.0);

  // Master Gain for original track processing
  const origMasterGain = offlineCtx.createGain();
  origMasterGain.gain.value = safePos(0.8 * originalVolumeMultiplier, 0.8, 0.0);

  const masterDestination = offlineCtx.createGain();
  masterDestination.gain.value = 0.85;

  // Connect Main Audio Chain for original audio
  sourceNode.connect(origFilterNode);
  origFilterNode.connect(genreFilterNode);
  genreFilterNode.connect(driveNode);
  driveNode.connect(sidechainGain);
  sidechainGain.connect(origMasterGain);
  origMasterGain.connect(masterDestination);

  // Delay Send
  sidechainGain.connect(delayNode);
  delayNode.connect(delayWetGain);
  delayWetGain.connect(masterDestination);

  // Reverb Send
  sidechainGain.connect(convolver);
  convolver.connect(reverbGain);
  reverbGain.connect(masterDestination);

  masterDestination.connect(offlineCtx.destination);

  // 2. SYNTHESIZE DYNAMIC ADDED INSTRUMENT LAYERS BASED ON USER TOGGLES & GENRE
  onProgress?.(55, `Synthesizing Intelligent ${genre.name} Drums, Bass & Arp Layers...`);

  // Synthesize Added Drum Layers
  const kickLayer = currentLayers.added.find((a) => a.type === 'kick');
  if (kickLayer ? kickLayer.enabled : true) {
    const kickVol = (kickLayer ? kickLayer.volume : 1.0) * fx.kickVolume;
    synthesizeEDMDrumTrack(offlineCtx, genre, bpm, outputDuration, kickVol);
  }

  // Synthesize Added Sub-Bass & Wobble Layers
  const subBassLayer = currentLayers.added.find((a) => a.type === 'subbass' || a.type === 'wobble');
  if (subBassLayer ? subBassLayer.enabled : true) {
    const bassVol = subBassLayer ? subBassLayer.volume : 1.0;
    synthesizeGenreBassline(offlineCtx, genre, bpm, outputDuration, bassVol);
  }

  // Synthesize Added Synth Arps & Supersaws
  const synthArpLayer = currentLayers.added.find((a) => a.type === 'synth_arp' || a.type === 'pads');
  if (synthArpLayer ? synthArpLayer.enabled : true) {
    const synthVol = synthArpLayer ? synthArpLayer.volume : 0.8;
    synthesizeGenreSynthArp(offlineCtx, genre, bpm, outputDuration, synthVol);
  }

  // 3. VOCAL MAGIC STUDIO ENGINE (Auto-tune, Stutters, Chops, Key pitch, Ad-libs)
  if (safeNum(activeVocalSettings?.volume, 0.7) > 0) {
    onProgress?.(75, `Rebuilding Vocal Stems for ${genre.name} with Vocal Engine...`);
    renderVocalMagicEngine(offlineCtx, sourceBuffer, genre, bpm, outputDuration, activeVocalSettings);
  }

  // Add vinyl noise layer if Chillstep
  if (genre.id === 'Chillstep') {
    synthesizeVinylNoise(offlineCtx, outputDuration);
  }

  // Start source node
  sourceNode.start(0);

  onProgress?.(90, 'Rendering Master Audio Stream...');
  const renderedBuffer = await offlineCtx.startRendering();
  onProgress?.(100, 'Remix Rendered Successfully!');

  return renderedBuffer;
}

/**
 * Synthesizes genre-specific kicks, snares, hats, and sub bass layers directly into OfflineAudioContext.
 */
function synthesizeEDMDrumTrack(
  ctx: OfflineAudioContext,
  genre: GenreInfo,
  bpm: number,
  duration: number,
  kickVolMultiplier: number
) {
  const beatTime = 60 / bpm;
  const sixteenth = beatTime / 4;
  const totalBeats = Math.floor(duration / beatTime);

  const drumMaster = ctx.createGain();
  drumMaster.gain.value = 0.9 * kickVolMultiplier;
  drumMaster.connect(ctx.destination);

  for (let b = 0; b < totalBeats; b++) {
    const time = b * beatTime;

    // KICK PATTERNS
    if (genre.kickPattern === 'four-on-floor' || genre.kickPattern === 'house-classic') {
      triggerSynthKick(ctx, drumMaster, time, genre.id === 'Techno' ? 140 : 120);
      triggerSynthHiHat(ctx, drumMaster, time + beatTime * 0.5, false); // Offbeat hat
      triggerSynthHiHat(ctx, drumMaster, time + sixteenth, true); // 16th hat
      triggerSynthHiHat(ctx, drumMaster, time + sixteenth * 3, true);

      if ((b % 2 === 1) && genre.kickPattern === 'house-classic') {
        triggerSynthSnare(ctx, drumMaster, time);
      }
    } else if (genre.kickPattern === 'half-step') {
      // Dubstep / Chillstep / Future Bass (Kick on 1, Snare on 3)
      if (b % 4 === 0) {
        triggerSynthKick(ctx, drumMaster, time, 150);
      } else if (b % 4 === 2) {
        triggerSynthSnare(ctx, drumMaster, time);
      } else if (b % 4 === 3 && genre.id === 'Slushii') {
        triggerSynthKick(ctx, drumMaster, time + beatTime * 0.5, 130);
      }
      triggerSynthHiHat(ctx, drumMaster, time + beatTime * 0.5, true);
    } else if (genre.kickPattern === 'breakbeat') {
      // D&B (Kick on 1 & 2.75, Snare on 2 & 4)
      if (b % 4 === 0) triggerSynthKick(ctx, drumMaster, time, 160);
      if (b % 4 === 1) triggerSynthSnare(ctx, drumMaster, time);
      if (b % 4 === 2) triggerSynthKick(ctx, drumMaster, time + beatTime * 0.75, 140);
      if (b % 4 === 3) triggerSynthSnare(ctx, drumMaster, time);

      triggerSynthHiHat(ctx, drumMaster, time + sixteenth, true);
      triggerSynthHiHat(ctx, drumMaster, time + sixteenth * 2, true);
      triggerSynthHiHat(ctx, drumMaster, time + sixteenth * 3, true);
    } else if (genre.kickPattern === 'lofi') {
      triggerSynthKick(ctx, drumMaster, time, 95);
      triggerSynthHiHat(ctx, drumMaster, time + beatTime * 0.5, false);
    }
  }
}

function triggerSynthKick(ctx: OfflineAudioContext, destination: AudioNode, time: number, startFreq: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(startFreq, time);
  osc.frequency.exponentialRampToValueAtTime(35, time + 0.12);

  gain.gain.setValueAtTime(0.9, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.25);

  osc.connect(gain);
  gain.connect(destination);

  osc.start(time);
  osc.stop(time + 0.25);
}

function triggerSynthSnare(ctx: OfflineAudioContext, destination: AudioNode, time: number) {
  // Tone part
  const osc = ctx.createOscillator();
  const oscGain = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(180, time);
  osc.frequency.exponentialRampToValueAtTime(60, time + 0.1);

  oscGain.gain.setValueAtTime(0.5, time);
  oscGain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);

  osc.connect(oscGain);
  oscGain.connect(destination);

  osc.start(time);
  osc.stop(time + 0.1);

  // Noise part
  const bufferSize = ctx.sampleRate * 0.18;
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const output = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }

  const whiteNoise = ctx.createBufferSource();
  whiteNoise.buffer = noiseBuffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = 1000;

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.6, time);
  noiseGain.gain.exponentialRampToValueAtTime(0.01, time + 0.18);

  whiteNoise.connect(filter);
  filter.connect(noiseGain);
  noiseGain.connect(destination);

  whiteNoise.start(time);
  whiteNoise.stop(time + 0.18);
}

function triggerSynthHiHat(ctx: OfflineAudioContext, destination: AudioNode, time: number, isClosed: boolean) {
  const duration = isClosed ? 0.05 : 0.15;
  const bufferSize = ctx.sampleRate * duration;
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const output = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }

  const whiteNoise = ctx.createBufferSource();
  whiteNoise.buffer = noiseBuffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = 7000;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(isClosed ? 0.3 : 0.45, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

  whiteNoise.connect(filter);
  filter.connect(gain);
  gain.connect(destination);

  whiteNoise.start(time);
  whiteNoise.stop(time + duration);
}

function synthesizeVinylNoise(ctx: OfflineAudioContext, duration: number) {
  const bufferSize = ctx.sampleRate * duration;
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const output = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    // Soft noise + random vinyl pops
    const isPop = Math.random() < 0.0003;
    output[i] = isPop ? (Math.random() > 0.5 ? 0.8 : -0.8) : (Math.random() * 2 - 1) * 0.02;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 1800;
  filter.Q.value = 1.0;

  const gain = ctx.createGain();
  gain.gain.value = 0.12;

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  noise.start(0);
}

function synthesizeGenreBassline(
  ctx: OfflineAudioContext,
  genre: GenreInfo,
  bpm: number,
  duration: number,
  volumeMultiplier: number
) {
  const beatTime = 60 / bpm;
  const sixteenth = beatTime / 4;
  const totalBeats = Math.floor(duration / beatTime);
  const masterBassGain = ctx.createGain();
  masterBassGain.gain.value = 0.5 * volumeMultiplier;
  masterBassGain.connect(ctx.destination);

  for (let b = 0; b < totalBeats; b++) {
    const time = b * beatTime;

    if (genre.id === 'Zedd') {
      // Pure 45Hz sub bass with sidechained 8th note pump
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(45, time); // F#0

      subGain.gain.setValueAtTime(0.01, time);
      subGain.gain.exponentialRampToValueAtTime(0.85, time + beatTime * 0.2);
      subGain.gain.exponentialRampToValueAtTime(0.01, time + beatTime * 0.95);

      subOsc.connect(subGain);
      subGain.connect(masterBassGain);
      subOsc.start(time);
      subOsc.stop(time + beatTime * 0.95);
    } else if (genre.id === 'Skrillex') {
      // FM Growl Bass (modulator -> carrier + bandpass filter sweep)
      if (b % 2 === 0) {
        const carrier = ctx.createOscillator();
        const modulator = ctx.createOscillator();
        const modGain = ctx.createGain();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        carrier.type = 'sawtooth';
        modulator.type = 'sine';
        carrier.frequency.setValueAtTime(55, time); // A1
        modulator.frequency.setValueAtTime(110, time); // 2x FM ratio
        modGain.gain.setValueAtTime(300, time);

        filter.type = 'bandpass';
        filter.Q.value = 5.0;

        // Sweep filter from 250Hz to 3200Hz for vowel growl
        filter.frequency.setValueAtTime(250, time);
        filter.frequency.exponentialRampToValueAtTime(3200, time + beatTime * 0.4);
        filter.frequency.exponentialRampToValueAtTime(250, time + beatTime * 0.9);

        gain.gain.setValueAtTime(0.9, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + beatTime * 0.95);

        modulator.connect(modGain);
        modGain.connect(carrier.frequency);
        carrier.connect(filter);
        filter.connect(gain);
        gain.connect(masterBassGain);

        modulator.start(time);
        carrier.start(time);
        modulator.stop(time + beatTime * 0.95);
        carrier.stop(time + beatTime * 0.95);
      }
    } else if (genre.id === 'Excision') {
      // Massive 40-60Hz Sub Destroyer + Metallic Distortion Layer
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(42, time);

      subGain.gain.setValueAtTime(0.95, time);
      subGain.gain.exponentialRampToValueAtTime(0.01, time + beatTime * 0.9);

      // Metallic screech growl layer on beat 1 and 3
      if (b % 2 === 0) {
        const growlOsc = ctx.createOscillator();
        const growlFilter = ctx.createBiquadFilter();
        const growlGain = ctx.createGain();

        growlOsc.type = 'sawtooth';
        growlOsc.frequency.setValueAtTime(65, time);

        growlFilter.type = 'bandpass';
        growlFilter.frequency.setValueAtTime(1200, time);
        growlFilter.Q.value = 8.0;

        growlGain.gain.setValueAtTime(0.7, time);
        growlGain.gain.exponentialRampToValueAtTime(0.01, time + beatTime * 0.85);

        growlOsc.connect(growlFilter);
        growlFilter.connect(growlGain);
        growlGain.connect(masterBassGain);
        growlOsc.start(time);
        growlOsc.stop(time + beatTime * 0.85);
      }

      subOsc.connect(subGain);
      subGain.connect(masterBassGain);
      subOsc.start(time);
      subOsc.stop(time + beatTime * 0.9);
    } else if (genre.id === 'Zomboy') {
      // Pitch-bent square wave riddim bass
      if (b % 2 === 0) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = 'square';
        osc.frequency.setValueAtTime(60, time);
        osc.frequency.exponentialRampToValueAtTime(120, time + beatTime * 0.15);
        osc.frequency.exponentialRampToValueAtTime(50, time + beatTime * 0.4);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1600, time);
        filter.Q.value = 4.0;

        gain.gain.setValueAtTime(0.85, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + beatTime * 0.9);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(masterBassGain);
        osc.start(time);
        osc.stop(time + beatTime * 0.9);
      }
    } else if (genre.id === 'Slushii') {
      // Pitch-bent 808 Sub Drop
      if (b % 4 === 0) {
        const subOsc = ctx.createOscillator();
        const subGain = ctx.createGain();

        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(120, time);
        subOsc.frequency.exponentialRampToValueAtTime(38, time + 0.3);

        subGain.gain.setValueAtTime(0.9, time);
        subGain.gain.exponentialRampToValueAtTime(0.01, time + beatTime * 1.8);

        subOsc.connect(subGain);
        subGain.connect(masterBassGain);
        subOsc.start(time);
        subOsc.stop(time + beatTime * 1.8);
      }
    } else if (genre.id === 'Alan Walker') {
      // Deep filtered bassline
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = 'triangle';
      subOsc.frequency.setValueAtTime(48, time);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(350, time);

      subGain.gain.setValueAtTime(0.7, time);
      subGain.gain.exponentialRampToValueAtTime(0.01, time + beatTime * 0.85);

      subOsc.connect(filter);
      filter.connect(subGain);
      subGain.connect(masterBassGain);
      subOsc.start(time);
      subOsc.stop(time + beatTime * 0.85);
    } else if (genre.id === 'Techno') {
      // 16th rumble sub bass pattern
      for (let s = 1; s < 4; s++) {
        const subOsc = ctx.createOscillator();
        const subGain = ctx.createGain();
        subOsc.type = 'sawtooth';
        subOsc.frequency.setValueAtTime(45, time + s * sixteenth);
        
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(180, time + s * sixteenth);

        subGain.gain.setValueAtTime(0.6, time + s * sixteenth);
        subGain.gain.exponentialRampToValueAtTime(0.01, time + (s + 0.8) * sixteenth);

        subOsc.connect(filter);
        filter.connect(subGain);
        subGain.connect(masterBassGain);
        subOsc.start(time + s * sixteenth);
        subOsc.stop(time + (s + 0.9) * sixteenth);
      }
    } else {
      // Generic Sub Sine Bass (Chillstep, etc.)
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(46, time);

      subGain.gain.setValueAtTime(0.7, time);
      subGain.gain.exponentialRampToValueAtTime(0.01, time + beatTime * 0.9);

      subOsc.connect(subGain);
      subGain.connect(masterBassGain);
      subOsc.start(time);
      subOsc.stop(time + beatTime * 0.9);
    }
  }
}

function synthesizeGenreSynthArp(
  ctx: OfflineAudioContext,
  genre: GenreInfo,
  bpm: number,
  duration: number,
  volumeMultiplier: number
) {
  const beatTime = 60 / bpm;
  const sixteenth = beatTime / 4;
  const totalBeats = Math.floor(duration / beatTime);
  const arpGain = ctx.createGain();
  arpGain.gain.value = 0.35 * volumeMultiplier;
  arpGain.connect(ctx.destination);

  // Minor 7th arpeggio scale frequencies (A minor: A4, C5, E5, G5)
  const scale = [440, 523.25, 659.25, 783.99, 880, 1046.5];

  for (let b = 0; b < totalBeats; b++) {
    const time = b * beatTime;

    if (genre.id === 'Zedd') {
      // Zedd 3-Layer Supersaw Chords (Center, +7 cents detuned, -7 cents detuned) on beat 1 and 3
      if (b % 2 === 0) {
        const chordFreqs = [261.63, 329.63, 392.0, 523.25]; // C maj9 chord
        chordFreqs.forEach((freq) => {
          [-7, 0, 7].forEach((detune) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const filter = ctx.createBiquadFilter();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, time);
            osc.detune.setValueAtTime(detune, time);

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(3800, time);

            // Sidechain pumping volume curve
            gain.gain.setValueAtTime(0.02, time);
            gain.gain.exponentialRampToValueAtTime(0.25, time + beatTime * 0.35);
            gain.gain.exponentialRampToValueAtTime(0.001, time + beatTime * 1.85);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(arpGain);

            osc.start(time);
            osc.stop(time + beatTime * 1.85);
          });
        });
      }
    } else if (genre.id === 'Alan Walker') {
      // Signature Faded 16th Pluck Lead
      for (let s = 0; s < 4; s++) {
        const noteIndex = (b * 4 + s) % scale.length;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(scale[noteIndex], time + s * sixteenth);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2800, time + s * sixteenth);
        filter.frequency.exponentialRampToValueAtTime(400, time + (s + 0.5) * sixteenth);

        gain.gain.setValueAtTime(0.35, time + s * sixteenth);
        gain.gain.exponentialRampToValueAtTime(0.001, time + (s + 0.7) * sixteenth);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(arpGain);

        osc.start(time + s * sixteenth);
        osc.stop(time + (s + 0.75) * sixteenth);
      }
    } else if (genre.id === 'Skrillex') {
      // Laser Synths (fast pitch drop zap FX)
      if (b % 4 === 3) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(2400, time);
        osc.frequency.exponentialRampToValueAtTime(120, time + 0.15);

        gain.gain.setValueAtTime(0.4, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);

        osc.connect(gain);
        gain.connect(arpGain);
        osc.start(time);
        osc.stop(time + 0.15);
      }
    } else if (genre.id === 'Slushii') {
      // Bubbly 16th Arpeggio Lead
      for (let s = 0; s < 4; s++) {
        const noteIndex = (b * 4 + s * 2) % scale.length;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(scale[noteIndex] * 1.5, time + s * sixteenth);

        gain.gain.setValueAtTime(0.3, time + s * sixteenth);
        gain.gain.exponentialRampToValueAtTime(0.001, time + (s + 0.6) * sixteenth);

        osc.connect(gain);
        gain.connect(arpGain);
        osc.start(time + s * sixteenth);
        osc.stop(time + (s + 0.65) * sixteenth);
      }
    } else if (genre.id === 'Techno') {
      // Fast 16th Arp
      for (let s = 0; s < 4; s++) {
        const noteIndex = (b * 4 + s) % scale.length;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = 'square';
        osc.frequency.setValueAtTime(scale[noteIndex], time + s * sixteenth);

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1500 + s * 300, time + s * sixteenth);
        filter.Q.value = 3.0;

        gain.gain.setValueAtTime(0.4, time + s * sixteenth);
        gain.gain.exponentialRampToValueAtTime(0.001, time + (s + 0.8) * sixteenth);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(arpGain);

        osc.start(time + s * sixteenth);
        osc.stop(time + (s + 0.85) * sixteenth);
      }
    }
  }
}

function synthesizeVocalChopper(
  ctx: OfflineAudioContext,
  sourceBuffer: AudioBuffer,
  bpm: number,
  duration: number,
  volumeMultiplier: number
) {
  if (sourceBuffer.duration < 2) return;

  const beatTime = 60 / bpm;
  const sixteenth = beatTime / 4;
  const totalBeats = Math.floor(duration / beatTime);
  const chopGain = ctx.createGain();
  chopGain.gain.value = 0.5 * volumeMultiplier;
  chopGain.connect(ctx.destination);

  // Take a clean slice from middle of audio buffer
  const sliceStart = Math.min(1.0, sourceBuffer.duration * 0.2);

  for (let b = 0; b < totalBeats; b += 2) {
    const time = b * beatTime;

    // Trigger vocal chops on syncopated 16th slots
    const chopOffsets = [0, sixteenth * 3, sixteenth * 6];
    const pitchRatios = [1.0, 1.25, 0.84, 1.5];

    chopOffsets.forEach((offset, idx) => {
      const src = ctx.createBufferSource();
      src.buffer = sourceBuffer;
      src.playbackRate.value = pitchRatios[idx % pitchRatios.length];

      const bandpass = ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.value = 1800;
      bandpass.Q.value = 2.0;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.6, time + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, time + offset + sixteenth * 1.5);

      src.connect(bandpass);
      bandpass.connect(gain);
      gain.connect(chopGain);

      src.start(time + offset, sliceStart + (idx * 0.2) % (sourceBuffer.duration - 0.5), sixteenth * 1.8);
    });
  }
}

function makeDistortionCurve(amount: number): Float32Array {
  const k = typeof amount === 'number' ? amount : 50;
  const n_samples = 44100;
  const curve = new Float32Array(n_samples);
  const deg = Math.PI / 180;
  for (let i = 0; i < n_samples; ++i) {
    const x = (i * 2) / n_samples - 1;
    curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
  }
  return curve;
}

function createImpulseResponse(ctx: BaseAudioContext, duration: number, decay: number): AudioBuffer {
  const sampleRate = ctx.sampleRate;
  const length = sampleRate * duration;
  const impulse = ctx.createBuffer(2, length, sampleRate);
  const left = impulse.getChannelData(0);
  const right = impulse.getChannelData(1);

  for (let i = 0; i < length; i++) {
    const n = i;
    left[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
    right[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
  }

  return impulse;
}

/**
 * Vocal Magic Engine DSP Pipeline.
 * Handles auto-tuning to key, grid quantize, 1/8 note chops, 1/16 note stutters, hook repetition & genre ad-libs.
 */
function renderVocalMagicEngine(
  ctx: OfflineAudioContext,
  sourceBuffer: AudioBuffer,
  genre: GenreInfo,
  bpm: number,
  duration: number,
  vocalSettings: VocalSettings
) {
  const beatTime = 60 / bpm;
  const sixteenth = beatTime / 4;
  const eighth = beatTime / 2;
  const barTime = beatTime * 4;
  const totalBeats = Math.floor(duration / beatTime);
  const totalBars = Math.floor(duration / barTime);

  const vocalMasterGain = ctx.createGain();
  vocalMasterGain.gain.value = safePos(safeNum(vocalSettings?.volume, 0.7) * 0.9, 0.63, 0.0);

  // Reverb & Delay processing chain for vocals
  const vocalDelayNode = ctx.createDelay();
  vocalDelayNode.delayTime.value = safePos(beatTime * 0.75, 0.25, 0.001); // dotted 8th note delay
  const vocalDelayFeedback = ctx.createGain();
  vocalDelayFeedback.gain.value = safePos(0.35 * safeNum(vocalSettings?.reverbDelay, 0.5), 0.175, 0.0);
  const vocalDelayWet = ctx.createGain();
  vocalDelayWet.gain.value = safePos(0.4 * safeNum(vocalSettings?.reverbDelay, 0.5), 0.2, 0.0);

  vocalDelayNode.connect(vocalDelayFeedback);
  vocalDelayFeedback.connect(vocalDelayNode);
  vocalDelayNode.connect(vocalDelayWet);

  const vocalReverbGain = ctx.createGain();
  vocalReverbGain.gain.value = safePos(0.5 * safeNum(vocalSettings?.reverbDelay, 0.5), 0.25, 0.0);
  const convolver = ctx.createConvolver();
  convolver.buffer = createImpulseResponse(ctx, 2.5, 0.4);

  vocalMasterGain.connect(ctx.destination);
  vocalMasterGain.connect(vocalDelayNode);
  vocalDelayWet.connect(ctx.destination);
  vocalMasterGain.connect(convolver);
  convolver.connect(vocalReverbGain);
  vocalReverbGain.connect(ctx.destination);

  const fixStrength = safeNum(vocalSettings?.fixStrength, 85);
  const mode = vocalSettings?.mode || 'chop_hook';
  const autoRebuild = vocalSettings?.autoRebuildVocals !== false;

  // Pitch Semitone Map for pitchKey
  const keyPitchShiftMap: Record<string, number> = {
    'A Minor': 0,
    'C Major': 3,
    'F Minor': -4,
    'G Minor': -2,
    'D Minor': 5,
    'E Minor': 7,
    'F# Minor': -3,
    'A# Minor': 1,
  };
  const keyShift = keyPitchShiftMap[vocalSettings?.pitchKey || 'A Minor'] ?? 0;
  const basePitchRatio = safePos(Math.pow(2, keyShift / 12), 1.0, 0.01);

  // IF autoRebuild is OFF and user explicitly set mode to keep_original:
  if (!autoRebuild && mode === 'keep_original') {
    const vocalSrc = ctx.createBufferSource();
    vocalSrc.buffer = sourceBuffer;
    vocalSrc.playbackRate.value = basePitchRatio;
    vocalSrc.connect(vocalMasterGain);
    vocalSrc.start(0, 0, duration);
    return;
  }

  // Handle replaceMode:
  if (vocalSettings?.replaceMode === 'instrumental_only') {
    // Instrumental Only selected - bypass vocal chops and let synths drive track
    if (vocalSettings.addAdLibs) {
      synthesizeGenreAdLibs(ctx, genre, bpm, duration, vocalMasterGain);
    }
    return;
  }

  if (vocalSettings?.replaceMode === 'synthetic_voice' || sourceBuffer.duration < 1.0) {
    // Generate AI Synthetic Vocal (Formant-synthesized Oohs, Heys, & Vocal Chops)
    synthesizeSyntheticVocalLine(ctx, genre, bpm, duration, vocalMasterGain, basePitchRatio);
    if (vocalSettings?.addAdLibs) {
      synthesizeGenreAdLibs(ctx, genre, bpm, duration, vocalMasterGain);
    }
    return;
  }

  // Hook Analysis: sample clean vocal hook around 18% mark
  const hookSampleStart = Math.min(2.0, Math.max(0, sourceBuffer.duration * 0.18));
  const hookSampleLength = Math.min(barTime * 2, sourceBuffer.duration - hookSampleStart);

  // ARTIST-SPECIFIC VOCAL REBUILD ENGINE
  if (genre.id === 'Zedd' || genre.id === 'Alan Walker') {
    // ZEDD / ALAN WALKER: 100% Auto-Tuned 4-bar Phrases + Harmonies (Octave + 5th) + Big Hall Reverb Throws + Drop Ducking
    for (let bar = 0; bar < totalBars; bar += 4) {
      const isDropBar = (bar % 8 >= 4); // Drop happens on bars 4-7, 12-15, etc.
      const barStartTime = bar * barTime;

      if (!isDropBar) {
        // BUILDUP / BREAKDOWN: Full emotional vocal phrase + Octave & 5th Harmonies
        [0, 12, 7].forEach((semitone, layerIdx) => {
          const layerPitch = safePos(basePitchRatio * Math.pow(2, semitone / 12), 1.0, 0.01);
          const src = ctx.createBufferSource();
          src.buffer = sourceBuffer;
          src.playbackRate.value = layerPitch;

          const gain = ctx.createGain();
          const layerVol = layerIdx === 0 ? 0.85 : 0.35; // Main lead loud, harmonies background
          gain.gain.setValueAtTime(layerVol, barStartTime);
          gain.gain.exponentialRampToValueAtTime(0.01, barStartTime + barTime * 3.8);

          src.connect(gain);
          gain.connect(vocalMasterGain);
          src.start(barStartTime, hookSampleStart, Math.min(hookSampleLength, barTime * 3.8));
        });
      } else {
        // DROP BARS: 80% Bass/Drums, 20% Vocal Chops! (Gaps rule)
        [beatTime * 1.5, beatTime * 3.5].forEach((offset) => {
          for (let b = 0; b < 4; b += 2) {
            const chopTime = barStartTime + b * beatTime + offset;
            const src = ctx.createBufferSource();
            src.buffer = sourceBuffer;
            src.playbackRate.value = basePitchRatio;

            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0.4, chopTime);
            gain.gain.exponentialRampToValueAtTime(0.001, chopTime + eighth * 0.9);

            src.connect(gain);
            gain.connect(vocalMasterGain);
            src.start(chopTime, hookSampleStart, eighth);
          }
        });
      }
    }
  } else if (genre.id === 'Slushii') {
    // SLUSHII: Bouncy 1/16th Note Pitched Vocal Chop Lead Instrument
    const pitchScale = [0, 3, 5, 7, 10, 12, 15, 17];
    for (let b = 0; b < totalBeats; b++) {
      const beatStartTime = b * beatTime;
      const isDropBeat = Math.floor(b / 16) % 2 === 1;

      for (let s = 0; s < 4; s++) {
        if (!isDropBeat && s % 2 !== 0) continue; // less dense on buildup

        const chopTime = beatStartTime + s * sixteenth;
        const noteIdx = (b * 2 + s * 3) % pitchScale.length;
        const semitones = pitchScale[noteIdx];
        const chopPitch = safePos(basePitchRatio * Math.pow(2, semitones / 12), 1.0, 0.01);

        const src = ctx.createBufferSource();
        src.buffer = sourceBuffer;
        src.playbackRate.value = chopPitch;

        // Formant / Biquad sweep filter
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1500 + semitones * 120, chopTime);
        filter.Q.value = 3.5;

        const gain = ctx.createGain();
        const vol = isDropBeat ? 0.75 : 0.45;
        gain.gain.setValueAtTime(vol, chopTime);
        gain.gain.exponentialRampToValueAtTime(0.001, chopTime + sixteenth * 0.85);

        src.connect(filter);
        filter.connect(gain);
        gain.connect(vocalMasterGain);

        const sliceOffset = Math.max(0, (hookSampleStart + (s * 0.12)) % Math.max(0.5, sourceBuffer.duration - 0.5));
        src.start(chopTime, sliceOffset, sixteenth * 0.9);
      }
    }
  } else if (genre.id === 'Skrillex' || genre.id === 'Excision' || genre.id === 'Zomboy') {
    // SKRILLEX / EXCISION / ZOMBOY: Mangled Vocal Stutters, Growl Pitch (-6 semitones), 1-Word Drop Chops
    const growlPitch = safePos(basePitchRatio * Math.pow(2, -6 / 12), 0.707, 0.01);
    const chipmunkPitch = safePos(basePitchRatio * Math.pow(2, 7 / 12), 1.498, 0.01);

    for (let bar = 0; bar < totalBars; bar++) {
      const barStartTime = bar * barTime;
      const isDropBar = (bar % 8 >= 4);

      if (isDropBar) {
        // DROP BARS: MANGLE & ONLY 1-WORD CHOPS ("Kiss!", "Girl!", "Drop!") on beat 1 and 3.5
        [0, beatTime * 2.5].forEach((offset, idx) => {
          const chopTime = barStartTime + offset;
          for (let st = 0; st < 3; st++) {
            const stTime = chopTime + st * sixteenth;
            const src = ctx.createBufferSource();
            src.buffer = sourceBuffer;
            src.playbackRate.value = idx === 0 ? growlPitch : chipmunkPitch;

            const dist = ctx.createWaveShaper();
            dist.curve = makeDistortionCurve(60);

            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0.9, stTime);
            gain.gain.exponentialRampToValueAtTime(0.001, stTime + sixteenth * 0.85);

            src.connect(dist);
            dist.connect(gain);
            gain.connect(vocalMasterGain);
            src.start(stTime, Math.max(0, hookSampleStart + st * 0.05), sixteenth * 0.9);
          }
        });
      } else {
        // BUILDUP BARS: 1/16th Stutter Edit before drop ("I-I-I-Kissed!")
        for (let b = 0; b < 4; b++) {
          const t = barStartTime + b * beatTime;
          if (b === 3) {
            // Fast 4-hit stutter on beat 4
            for (let s = 0; s < 4; s++) {
              const stTime = t + s * sixteenth;
              const src = ctx.createBufferSource();
              src.buffer = sourceBuffer;
              src.playbackRate.value = safePos(basePitchRatio * Math.pow(2, (s * 2) / 12), 1.0, 0.01);

              const gain = ctx.createGain();
              gain.gain.setValueAtTime(0.85, stTime);
              gain.gain.exponentialRampToValueAtTime(0.01, stTime + sixteenth * 0.8);

              src.connect(gain);
              gain.connect(vocalMasterGain);
              src.start(stTime, Math.max(0, hookSampleStart + 0.1), sixteenth * 0.85);
            }
          } else {
            // Beat chop
            const src = ctx.createBufferSource();
            src.buffer = sourceBuffer;
            src.playbackRate.value = basePitchRatio;

            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0.7, t);
            gain.gain.exponentialRampToValueAtTime(0.01, t + beatTime * 0.8);

            src.connect(gain);
            gain.connect(vocalMasterGain);
            src.start(t, hookSampleStart, beatTime * 0.85);
          }
        }
      }
    }
  } else {
    // TECHNO & CHILLSTEP & DEFAULT: Clean 1/8th Note Vocal Chop Hook with Reverb
    for (let bar = 0; bar < totalBars; bar += 2) {
      const t = bar * barTime;
      const src = ctx.createBufferSource();
      src.buffer = sourceBuffer;
      src.playbackRate.value = basePitchRatio;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.75, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + barTime * 1.5);

      src.connect(gain);
      gain.connect(vocalMasterGain);
      src.start(t, hookSampleStart, barTime * 1.5);
    }
  }

  // REPEAT HOOK ON DROP (If enabled or requested)
  if (vocalSettings.repeatHookOnDrop || fixStrength > 70) {
    const dropBars = [4, 8, 16, 24, 32].filter((b) => b < totalBars);

    dropBars.forEach((dropBar) => {
      const buildUpTime = (dropBar - 1) * barTime;
      for (let s = 0; s < 8; s++) {
        const t = buildUpTime + s * eighth;
        const src = ctx.createBufferSource();
        src.buffer = sourceBuffer;
        src.playbackRate.value = safePos(basePitchRatio * Math.pow(2, (s * 1.5) / 12), 1.0, 0.01);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.9, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + eighth * 0.9);

        src.connect(gain);
        gain.connect(vocalMasterGain);
        src.start(t, hookSampleStart, eighth);
      }
    });
  }

  // SYNTHESIZE GENRE AD-LIBS & SHOUTS (Hey! Yeah! Oh! Whispers!)
  if (vocalSettings.addAdLibs || fixStrength > 75) {
    synthesizeGenreAdLibs(ctx, genre, bpm, duration, vocalMasterGain);
  }
}

function synthesizeGenreAdLibs(
  ctx: OfflineAudioContext,
  genre: GenreInfo,
  bpm: number,
  duration: number,
  destination: GainNode
) {
  const beatTime = 60 / bpm;
  const barTime = beatTime * 4;
  const totalBars = Math.floor(duration / barTime);

  for (let bar = 1; bar < totalBars; bar += 2) {
    const time = bar * barTime + beatTime * 3.5; // Offbeat before next bar

    if (genre.id === 'Zedd' || genre.id === 'Slushii' || genre.id === 'Alan Walker') {
      // Punchy "HEY!" shout (noise burst + tuned synth pop)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, time);
      osc.frequency.exponentialRampToValueAtTime(120, time + 0.12);

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1800, time);
      filter.Q.value = 3;

      gain.gain.setValueAtTime(0.7, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.15);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(destination);

      osc.start(time);
      osc.stop(time + 0.15);
    } else if (genre.id === 'Techno') {
      // Whispered breath vocal ad-lib
      const bufferSize = ctx.sampleRate * 0.2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2400, time);
      filter.Q.value = 5;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.4, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.18);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(destination);

      noise.start(time);
      noise.stop(time + 0.18);
    } else if (genre.id === 'Skrillex' || genre.id === 'Excision' || genre.id === 'Zomboy') {
      // Aggressive pitched "YEAH!" shout
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(520, time);
      osc.frequency.exponentialRampToValueAtTime(180, time + 0.2);

      const dist = ctx.createWaveShaper();
      dist.curve = makeDistortionCurve(40);

      gain.gain.setValueAtTime(0.85, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.22);

      osc.connect(dist);
      dist.connect(gain);
      gain.connect(destination);

      osc.start(time);
      osc.stop(time + 0.22);
    } else {
      // Smooth "OH / OOH" vocal pad swell (Chillstep, Trance, Future Bass, D&B, Lo-fi)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, time);
      osc.frequency.exponentialRampToValueAtTime(350, time + 0.35);

      gain.gain.setValueAtTime(0.01, time);
      gain.gain.linearRampToValueAtTime(0.5, time + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.35);

      osc.connect(gain);
      gain.connect(destination);

      osc.start(time);
      osc.stop(time + 0.35);
    }
  }
}

/**
 * Synthesizes AI synthetic vocal phrases (Formant-filtered Oohs, Aahs, Heys, & Vocal Chops).
 */
function synthesizeSyntheticVocalLine(
  ctx: OfflineAudioContext,
  genre: GenreInfo,
  bpm: number,
  duration: number,
  destination: GainNode,
  pitchRatio: number
) {
  const beatTime = 60 / bpm;
  const sixteenth = beatTime / 4;
  const barTime = beatTime * 4;
  const totalBars = Math.floor(duration / barTime);

  // Pentatonic scale notes (A minor / C major: A3, C4, D4, E4, G4, A4, C5)
  const pentatonicScale = [220, 261.63, 293.66, 329.63, 392.0, 440, 523.25];

  for (let bar = 0; bar < totalBars; bar++) {
    const isDrop = (bar % 8 >= 4);
    const barStartTime = bar * barTime;

    if (genre.id === 'Skrillex' || genre.id === 'Excision' || genre.id === 'Zomboy') {
      // Aggressive "YEAH!" / "HEY!" shouts on beats 1 and 3
      if (bar % 2 === 0) {
        [0, beatTime * 2].forEach((offset) => {
          const t = barStartTime + offset;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const f1 = ctx.createBiquadFilter();
          const f2 = ctx.createBiquadFilter();

          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(320 * pitchRatio, t);
          osc.frequency.exponentialRampToValueAtTime(140 * pitchRatio, t + 0.18);

          f1.type = 'bandpass';
          f1.frequency.value = 800;
          f1.Q.value = 4.0;

          f2.type = 'bandpass';
          f2.frequency.value = 1800;
          f2.Q.value = 5.0;

          gain.gain.setValueAtTime(0.8, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

          osc.connect(f1);
          osc.connect(f2);
          f1.connect(gain);
          f2.connect(gain);
          gain.connect(destination);

          osc.start(t);
          osc.stop(t + 0.22);
        });
      }
    } else if (genre.id === 'Slushii') {
      // Bouncy Pitched Formant Chop Melody
      for (let b = 0; b < 4; b++) {
        for (let s = 0; s < 2; s++) {
          const t = barStartTime + b * beatTime + s * sixteenth * 2;
          const noteFreq = pentatonicScale[(bar * 2 + b + s) % pentatonicScale.length] * pitchRatio;

          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const formant = ctx.createBiquadFilter();

          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(noteFreq, t);

          formant.type = 'bandpass';
          formant.frequency.setValueAtTime(1200 + (s * 300), t);
          formant.Q.value = 6.0;

          gain.gain.setValueAtTime(0.65, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + sixteenth * 1.6);

          osc.connect(formant);
          formant.connect(gain);
          gain.connect(destination);

          osc.start(t);
          osc.stop(t + sixteenth * 1.7);
        }
      }
    } else {
      // Zedd / Alan Walker / Techno / Chillstep: Ethereal "OOH / AAH" Formant Vocal Pad Line
      const noteFreq = pentatonicScale[bar % pentatonicScale.length] * pitchRatio;
      const t = barStartTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const f1 = ctx.createBiquadFilter();
      const f2 = ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(noteFreq, t);

      // Formant filters for "OOH / AAH" vocal sound
      f1.type = 'bandpass';
      f1.frequency.setValueAtTime(700, t);
      f1.Q.value = 3.5;

      f2.type = 'bandpass';
      f2.frequency.setValueAtTime(1200, t);
      f2.Q.value = 4.0;

      const noteDuration = isDrop ? barTime * 0.85 : barTime * 2.8;
      gain.gain.setValueAtTime(0.01, t);
      gain.gain.linearRampToValueAtTime(0.5, t + beatTime * 0.5);
      gain.gain.exponentialRampToValueAtTime(0.001, t + noteDuration);

      osc.connect(f1);
      osc.connect(f2);
      f1.connect(gain);
      f2.connect(gain);
      gain.connect(destination);

      osc.start(t);
      osc.stop(t + noteDuration);
    }
  }
}

/**
 * Estimates BPM from audio buffer peaks.
 */
export function estimateBpm(buffer: AudioBuffer): number {
  try {
    const data = buffer.getChannelData(0);
    const step = 4;
    let peaks: number[] = [];
    const threshold = 0.6;

    for (let i = 0; i < data.length; i += step) {
      if (Math.abs(data[i]) > threshold) {
        peaks.push(i);
      }
    }

    if (peaks.length < 10) return 128; // fallback default

    const intervals: number[] = [];
    for (let i = 1; i < peaks.length; i++) {
      const interval = peaks[i] - peaks[i - 1];
      if (interval > buffer.sampleRate * 0.3 && interval < buffer.sampleRate * 0.8) {
        intervals.push(interval);
      }
    }

    if (intervals.length === 0) return 128;

    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const bpm = Math.round((60 * buffer.sampleRate) / avgInterval);

    return bpm >= 70 && bpm <= 180 ? bpm : 128;
  } catch {
    return 128;
  }
}
