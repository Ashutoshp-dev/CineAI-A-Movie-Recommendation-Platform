import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

const apiKeys = [
  process.env.GEMINI_API_KEY1,
  process.env.GEMINI_API_KEY2,
  process.env.GEMINI_API_KEY3,
  process.env.GEMINI_API_KEY4,
  process.env.GEMINI_API_KEY5,
];

let currentKey = 0;

// Helper: parse Gemini response into clean list
function parseResponse(data) {
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  return text
    .split("\n")
    .map((line) => line.replace(/^\d+[\).\-\s]*/, "").trim())
    .filter(Boolean);
}

// Smart Gemini API caller with failover
async function callGemini(prompt) {
  const tried = new Set();
  let lastError = null;

  while (tried.size < apiKeys.length) {
    const key = apiKeys[currentKey];
    tried.add(currentKey);

    console.log(`🔑 Trying Gemini API Key ${currentKey + 1}`);

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": key,
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      if (res.ok) {
        const data = await res.json();
        return parseResponse(data);
      }

      const errorText = await res.text();
      console.warn(`❌ API Key ${currentKey + 1} failed: ${res.status} - ${errorText}`);

      if ([400, 403, 429].includes(res.status)) {
        currentKey = (currentKey + 1) % apiKeys.length;
      } else {
        lastError = errorText;
        break;
      }
    } catch (err) {
      console.warn(`⚠️ Error with key ${currentKey + 1}: ${err.message}`);
      currentKey = (currentKey + 1) % apiKeys.length;
      lastError = err.message;
    }
  }

  throw new Error("Gemini API failed: " + lastError);
}

//ROUTES

router.post("/recommend/liked", async (req, res) => {
  try {
    const { likedMovies } = req.body;

    if (!likedMovies || likedMovies.length === 0) {
      return res.status(400).json({ error: "No liked movies provided." });
    }

    const titles = likedMovies.map((m) => m.title).slice(0, 10);
    const prompt = `Suggest 10 recommended movies similar to the following: ${titles.join(", ")}. Return a plain list, one per line.`;

    const recommendations = await callGemini(prompt);
    res.json({ recommendations });
  } catch (error) {
    console.error("Gemini error (liked):", error.message);
    res.status(500).json({ error: "Failed to generate liked recommendations." });
  }
});

router.post("/recommend/saved", async (req, res) => {
  try {
    const { savedMovies } = req.body;

    if (!savedMovies || savedMovies.length === 0) {
      return res.status(400).json({ error: "Invalid savedMovies array" });
    }

    const titles = savedMovies.map((m) => m.title).slice(0, 10);
    const prompt = `Suggest 10 recommended movies similar to the following: ${titles.join(", ")}. Return a plain list, one per line.`;

    const recommendations = await callGemini(prompt);
    res.json({ recommendations });
  } catch (error) {
    console.error("Gemini error (saved):", error.message);
    res.status(500).json({ error: "Failed to generate saved recommendations." });
  }
});

router.post("/recommend/mixed", async (req, res) => {
  try {
    const { likedMovies, savedMovies } = req.body;
    const allMovies = [...(likedMovies || []), ...(savedMovies || [])];

    if (allMovies.length === 0) {
      return res.status(400).json({ error: "No liked or saved movies provided." });
    }

    const titles = allMovies.map((m) => m.title).slice(0, 10);
    const prompt = `Suggest 10 recommended movies similar to the following: ${titles.join(", ")}. Return a plain list, one per line.`;

    const recommendations = await callGemini(prompt);
    res.json({ recommendations });
  } catch (error) {
    console.error("Gemini error (mixed):", error.message);
    res.status(500).json({ error: "Failed to generate mixed recommendations." });
  }
});

export default router;