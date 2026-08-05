/**
 * Generates a high-quality demo audio track using Web Audio API synthesis.
 * Allows instant testing of EDM Remix Studio features without uploading a local file.
 */
export async function generateDemoTrack(): Promise<AudioBuffer> {
  const sampleRate = 44100;
  const duration = 12; // 12-second groove loop
  const offlineCtx = new OfflineAudioContext(2, sampleRate * duration, sampleRate);

  const masterGain = offlineCtx.createGain();
  masterGain.gain.value = 0.8;
  masterGain.connect(offlineCtx.destination);

  const bpm = 124;
  const beatTime = 60 / bpm;
  const sixteenth = beatTime / 4;

  // Chord progression: Am -> F -> C -> G (Classic EDM Progression)
  const chordFreqs = [
    [220.0, 261.63, 329.63], // Am
    [174.61, 220.0, 261.63], // F
    [261.63, 329.63, 392.0], // C
    [196.0, 246.94, 293.66], // G
  ];

  // 1. Synthesize Chord Pads
  chordFreqs.forEach((freqs, chordIdx) => {
    const startTime = chordIdx * (beatTime * 8); // 2 bars per chord
    const chordDuration = beatTime * 7.8;

    freqs.forEach((freq) => {
      const osc = offlineCtx.createOscillator();
      const osc2 = offlineCtx.createOscillator();
      const gain = offlineCtx.createGain();
      const filter = offlineCtx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc2.type = 'square';
      osc.frequency.value = freq;
      osc2.frequency.value = freq * 1.005; // Subtle detune for width

      filter.type = 'lowpass';
      filter.frequency.value = 1400;

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.exponentialRampToValueAtTime(0.18, startTime + 0.1);
      gain.gain.setValueAtTime(0.18, startTime + chordDuration - 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + chordDuration);

      osc.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);

      osc.start(startTime);
      osc2.start(startTime);
      osc.stop(startTime + chordDuration);
      osc2.stop(startTime + chordDuration);
    });
  });

  // 2. Synthesize Bassline
  const bassNotes = [110, 110, 87.31, 87.31, 130.81, 130.81, 98.0, 98.0];
  bassNotes.forEach((freq, idx) => {
    const startTime = idx * (beatTime * 4);
    const noteDuration = beatTime * 3.5;

    const osc = offlineCtx.createOscillator();
    const gain = offlineCtx.createGain();
    const filter = offlineCtx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.value = freq / 2; // Sub octave

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, startTime);
    filter.frequency.exponentialRampToValueAtTime(200, startTime + noteDuration);

    gain.gain.setValueAtTime(0.35, startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + noteDuration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);

    osc.start(startTime);
    osc.stop(startTime + noteDuration);
  });

  // 3. Arpeggiator Lead
  const arpNotes = [440, 523.25, 659.25, 880, 523.25, 659.25, 783.99, 1046.5];
  const totalSteps = Math.floor(duration / sixteenth);

  for (let step = 0; step < totalSteps; step++) {
    const startTime = step * sixteenth;
    const freq = arpNotes[step % arpNotes.length];

    const osc = offlineCtx.createOscillator();
    const gain = offlineCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.value = freq;

    gain.gain.setValueAtTime(0.12, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + sixteenth * 0.8);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(startTime);
    osc.stop(startTime + sixteenth);
  }

  return await offlineCtx.startRendering();
}
