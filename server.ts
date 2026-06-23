import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { rentspreeQuestions } from "./src/data/rentspreeQuestions";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Match user query with the RentSpree 26 questions using a robust keyword overlap matcher
function findMatchingRentSpreeQuestion(userText: string) {
  if (!userText) return null;
  const clean = userText.toLowerCase().replace(/[^\w\s]/g, " ");
  // Extract words and filter out short terms/connectors
  const words = clean.split(/\s+/).filter(w => w.length > 2);
  
  const stopWords = [
    "the", "and", "you", "that", "was", "for", "are", "with", "from", "how", "what", "why", 
    "who", "where", "whom", "which", "will", "would", "should", "could", "about", "your", 
    "their", "does", "have", "need", "any", "some"
  ];
  const significantWords = words.filter(w => !stopWords.includes(w));
  
  if (significantWords.length === 0) return null;

  let bestMatch = null;
  let maxOverlap = 0;
  
  for (const item of rentspreeQuestions) {
    const itemClean = item.question.toLowerCase().replace(/[^\w\s]/g, " ");
    const itemWords = itemClean.split(/\s+/).filter(w => w.length > 2 && !stopWords.includes(w));
    
    let overlap = 0;
    for (const w of significantWords) {
      if (itemWords.includes(w)) {
        overlap++;
      }
    }
    
    if (overlap > maxOverlap) {
      maxOverlap = overlap;
      bestMatch = item;
    }
  }
  
  // Return the question info if we have strong confidence
  if (bestMatch && (maxOverlap >= 2 || (maxOverlap === 1 && significantWords.length === 1))) {
    return { item: bestMatch, score: maxOverlap };
  }
  return null;
}

// Lazy-initialize Gemini client to handle missing keys gracefully
let aiClient: GoogleGenAI | null = null;

function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not configured. Please add this key in your Settings.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// API routes FIRST
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, persona, temperature, interestsDetail } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required." });
    }

    // Lazy initialize to guarantee no startup crashes
    const ai = getGeminiClient();

    // Format messages for gemini-3.5-flash
    // Gemini expects structure: { role: 'user' | 'model', parts: [{ text: string }] }
    const contents = messages.map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }]
    }));

    const userPersona = persona || "professional";
    const userTemp = typeof temperature === "number" ? temperature : 0.7;

    let systemInstruction = "You are NestBot, the premium AI Real Estate Advisor of Urban Nest Realty. You are extremely knowledgeable about our platform's services: Buy premium properties, Rent verified landlord homes, buy Plots in RERA zones, and look for PG / Co-living hostels. You are ready to assist with real estate financial calculators (Home Loan, Rent vs Buy, ROI, Capital Gains, Property Tax) and guiding user requests. Be helpful, friendly, and speak clearly. Present numbers cleanly and make your advice highly tailored to their real estate questions. Speak directly as an integrated companion. Note: The primary contact/whatsapp number for landlords/support is +919850843447.";

    if (userPersona === "friendly") {
      systemInstruction = "You are NestBot, a friendly, casual, and enthusiastic local real estate guide. Use supportive, joyful language, playful descriptions, and warm local metaphors. Talk about Nagpur property listings with welcoming energy. Help users solve calculators simply. Mention support at +919850843447 with a lovely tone.";
    } else if (userPersona === "precise") {
      systemInstruction = "You are NestBot, an ultra-precise, crisp, bullet-oriented real estate analyst. Minimize pleasantries, greetings, or narrative descriptions. Respond strictly using direct bullet points or very brief summaries. Present Nagpur/RERA numbers cleanly. Support/whatsapp is +919850843447.";
    }

    // Append user personalization details under Cookie Consent
    if (interestsDetail) {
      systemInstruction += `\n\n[USER PERSONALIZATION ACTIVE]: The Visitor Tracking System observes the user was recently viewing properties matching: "${interestsDetail}". Dynamically customize suggestions to reflect their search footprint and recommend properties matching this preference!`;
    }

    // RentSpree Questions Matching and Dynamic Knowledge Grounding
    const lastUserMessage = [...messages].reverse().find(m => m.role === "user")?.content || "";
    const match = findMatchingRentSpreeQuestion(lastUserMessage);

    if (match) {
      systemInstruction += `\n\n[CRITICAL INTERACTION RULE]: The user is asking a standard real estate question: "${match.item.question}" from the official RentSpree Real Estate Advisor Guide. You MUST base your response entirely and directly on this verified guideline answer as your source of truth:
"${match.item.answer}"

Acknowledge these expert facts naturally, adapting the final sentence structure or greeting to match your chosen tone (${userPersona}) perfectly, but never compromising or altering the core numbers or procedures contained in this answer. Use this guide to deliver a 100% accurate, professional answer.`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction,
        temperature: userTemp,
      }
    });

    res.json({ reply: response.text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate AI response." });
  }
});

// Serve static elements or use Vite in dev mode
async function initServer() {
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
    console.log(`Server running on port ${PORT}`);
  });
}

initServer();
