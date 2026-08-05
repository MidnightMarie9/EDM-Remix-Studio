import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));

// Initialize Gemini Client server-side
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// API Health Check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// AI Producer Assistant Route
app.post('/api/ai-producer', async (req, res) => {
  const { genre, fileName, bpm, duration, userCustomPrompt } = req.body;

  const fallbackData = {
    advice: `To produce an authentic ${genre || 'EDM'} remix for "${fileName || 'your track'}": boost the sub-bass around 50Hz, auto-rebuild vocals into rhythmic chops, add sidechain compression on beat drops, and apply a sharp high-pass filter sweep!`,
    recommendedBpm: bpm || 128,
    keyElements: ['Rebuilt Vocal Chops', 'Punchy Kick Layer', 'Sidechain Pump', 'Resonant Filter Sweeps'],
    presetNotes: `Standard ${genre || 'EDM'} producer preset applied.`,
  };

  try {
    const ai = getGeminiClient();

    if (!ai) {
      return res.json(fallbackData);
    }

    const prompt = `You are a world-class Electronic Dance Music (EDM) mixing engineer and producer.
The user has loaded a track: "${fileName || 'Audio Track'}" (Duration: ${Math.round(duration || 0)}s, Detected BPM: ${bpm || 128}).
Selected Target Genre: "${genre || 'Techno'}".
User Custom Direction: "${userCustomPrompt || 'Make it dancefloor ready'}".

Provide expert producer recommendations for this remix in valid JSON format with keys:
1. "advice": A 2-3 sentence high-level mixing/production strategy for transforming this track into a authentic ${genre} remix.
2. "recommendedBpm": Suggested target BPM for this genre (number).
3. "keyElements": Array of 4 specific sonic elements to emphasize (e.g., "909 Kick drum", "Resonant LFO Wobble", "Warm Cassette Saturation").
4. "presetNotes": Brief guidance on EQ, filter cutoff, and sidechain intensity.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '';
    let parsedData;
    try {
      parsedData = JSON.parse(text);
    } catch {
      parsedData = {
        advice: text || fallbackData.advice,
        recommendedBpm: bpm || 128,
        keyElements: fallbackData.keyElements,
        presetNotes: `Customized for ${genre || 'EDM'}.`,
      };
    }

    return res.json(parsedData);
  } catch (error: any) {
    console.warn('Gemini API call error (returning fallback analysis):', error?.message || error);
    return res.json({
      advice: `For a masterclass ${genre || 'EDM'} remix of "${fileName || 'this track'}": boost sub-bass around 45Hz, auto-rebuild vocals into quantized chops, and apply ducked sidechain compression on beat drops.`,
      recommendedBpm: bpm || 128,
      keyElements: ['Rebuilt Vocal Chops', 'Sub-Bass Drive', 'Sidechain Pump', 'Filter Sweeps'],
      presetNotes: `Optimized fallback producer profile for ${genre || 'EDM'}.`,
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[EDM Remix Studio] Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
