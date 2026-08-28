import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", app: "SPELLBOOK" });
  });

  // AI Story Branch Generator endpoint
  app.post("/api/gemini/branch", async (req, res) => {
    try {
      const { storyContext, arLevel, currentChoice } = req.body;
      const ai = getAI();

      if (!ai) {
        // Fallback realistic response if GEMINI_API_KEY not configured
        return res.json({
          nextScene: `You step forward through the enchanted clearing. The light shines brighter, revealing a hidden stone altar.`,
          nextSceneKo: `당신은 마법이 깃든 공터를 향해 발걸음을 옮깁니다. 빛이 더 밝아지며 숨겨진 돌 제단이 모습을 드러냅니다.`,
          choices: [
            { textEn: "Touch the glowing crystal on the altar", textKo: "제단 위의 빛나는 크리스털을 만진다" },
            { textEn: "Chant a protective spell with your wand", textKo: "지팡이로 보호 마법의 주문을 외친다" }
          ]
        });
      }

      const prompt = `You are the creative storytelling engine for SPELLBOOK, an interactive English reader for children (AR Level: ${arLevel || '2.0'}).
Current Story Context: "${storyContext}"
Child's choice: "${currentChoice}"

Generate the next 2-sentence narrative and 2 simple, engaging interactive decision branches in English suited for this AR level, along with natural Korean translations. Return JSON matching:
{
  "nextScene": "...",
  "nextSceneKo": "...",
  "choices": [
    { "textEn": "...", "textKo": "..." },
    { "textEn": "...", "textKo": "..." }
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      const parsed = JSON.parse(response.text || "{}");
      res.json(parsed);
    } catch (error: any) {
      console.error("AI Branch Error:", error);
      res.status(500).json({ error: "Story branch generation failed" });
    }
  });

  // AI Pronunciation Coaching Tip endpoint
  app.post("/api/gemini/pronunciation-tip", async (req, res) => {
    try {
      const { targetWord, spokenText, phonemes } = req.body;
      const ai = getAI();

      if (!ai) {
        return res.json({
          feedback: `Great try! Focus on making the /${phonemes?.[0]?.phoneme || 'r'}/ sound crisp and round.`,
          coachingKo: `잘했어요! 혀끝이 입천장에 닿지 않도록 살짝 굴려보세요.`
        });
      }

      const prompt = `Child English Learner pronounced '${spokenText}' when the target word is '${targetWord}' (Phonemes: ${JSON.stringify(phonemes)}).
Give a 1-sentence warm, encouraging tip in English and Korean focusing on child phonological feedback.
Return JSON: { "feedback": "...", "coachingKo": "..." }`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      res.json(JSON.parse(response.text || "{}"));
    } catch (error: any) {
      console.error("AI Coaching Error:", error);
      res.status(500).json({ error: "Coaching tip generation failed" });
    }
  });

  // Vite Middleware integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SPELLBOOK Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
