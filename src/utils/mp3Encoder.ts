import lamejs from 'lamejs';
import { audioBufferToWavBlob } from './wavEncoder';

/**
 * Encodes an AudioBuffer into MP3 Blob using lamejs with fallback to WAV.
 */
export function audioBufferToMp3Blob(buffer: AudioBuffer, kbps = 192): Blob {
  try {
    const numChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const mp3encoder = new lamejs.Mp3Encoder(numChannels, sampleRate, kbps);
    const mp3Data: Uint8Array[] = [];

    const samplesLength = buffer.length;
    const leftBuffer = buffer.getChannelData(0);
    const rightBuffer = numChannels > 1 ? buffer.getChannelData(1) : leftBuffer;

    // Convert float samples to 16-bit Int16Arrays in chunks of 1152 (lame frame size)
    const chunkSize = 1152;
    const leftInt = new Int16Array(chunkSize);
    const rightInt = new Int16Array(chunkSize);

    for (let i = 0; i < samplesLength; i += chunkSize) {
      const currentChunkSize = Math.min(chunkSize, samplesLength - i);
      const lChunk = leftInt.subarray(0, currentChunkSize);
      const rChunk = rightInt.subarray(0, currentChunkSize);

      for (let j = 0; j < currentChunkSize; j++) {
        const sL = Math.max(-1, Math.min(1, leftBuffer[i + j]));
        lChunk[j] = sL < 0 ? sL * 0x8000 : sL * 0x7fff;

        if (numChannels > 1) {
          const sR = Math.max(-1, Math.min(1, rightBuffer[i + j]));
          rChunk[j] = sR < 0 ? sR * 0x8000 : sR * 0x7fff;
        } else {
          rChunk[j] = lChunk[j];
        }
      }

      let mp3buf: Int8Array;
      if (numChannels === 1) {
        mp3buf = mp3encoder.encodeBuffer(lChunk);
      } else {
        mp3buf = mp3encoder.encodeBuffer(lChunk, rChunk);
      }

      if (mp3buf.length > 0) {
        mp3Data.push(new Uint8Array(mp3buf));
      }
    }

    const mp3buf = mp3encoder.flush();
    if (mp3buf.length > 0) {
      mp3Data.push(new Uint8Array(mp3buf));
    }

    return new Blob(mp3Data, { type: 'audio/mp3' });
  } catch (error) {
    console.warn('Lamejs MP3 encoding failed or unsupported, falling back to WAV:', error);
    return audioBufferToWavBlob(buffer);
  }
}
