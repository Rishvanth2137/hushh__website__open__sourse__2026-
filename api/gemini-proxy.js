import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { model, contents, config } = req.body;

  if (!model || !contents) {
    return res.status(400).json({ error: 'Missing model or contents' });
  }

  const keys = [
    process.env.GEMINI_API_KEY,
    process.env.GEMINI_API_KEY_1,
    process.env.GEMINI_API_KEY_2,
    process.env.GEMINI_API_KEY_3,
    process.env.GEMINI_API_KEY_4
  ].filter(Boolean);

  if (keys.length === 0) {
    return res.status(500).json({ error: 'Server configuration error: API keys missing' });
  }

  for (let i = 0; i < keys.length; i++) {
    const apiKey = keys[i];
    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model,
        contents,
        config
      });

      // We extract the text so the frontend doesn't need the SDK
      return res.status(200).json({ text: response.text });

    } catch (error) {
      const isQuotaError = error?.status === 429 || 
                           error?.code === 429 || 
                           error?.message?.includes('429') || 
                           error?.message?.includes('quota') ||
                           error?.message?.includes('RESOURCE_EXHAUSTED');
                           
      const isForbidden = error?.status === 403 || error?.code === 403 || error?.message?.includes('403');

      if ((isQuotaError || isForbidden) && i < keys.length - 1) {
        console.warn(`Gemini API key ${i} failed. Retrying with next key...`);
        continue;
      }

      console.error(`Gemini API error with key ${i}:`, error.message || error);
      return res.status(500).json({ error: 'Analysis failed due to an internal API error.' });
    }
  }

  return res.status(503).json({ error: 'Analysis failed due to high demand. Please try again shortly.' });
}
