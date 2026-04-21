import { GoogleGenerativeAI } from "@google/generative-ai";
import type { ExamConfig, Question, ChatMessage } from "../types";
import { getBranchById } from "../data/branches";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string;
const genAI = new GoogleGenerativeAI(API_KEY);

const MODEL = "gemini-2.5-flash";

// ---------- Question Generation ----------

function buildQuestionPrompt(config: ExamConfig, count: number): string {
  const branch = getBranchById(config.branch);
  return `You are an expert Thai Professional Engineering exam question generator for the Council of Engineers of Thailand (วิศวกรรมสภา).

Generate exactly ${count} multiple-choice questions for the following configuration:
- Engineering Branch: ${branch.nameEN} (${branch.nameTH})
- Subject Categories: ${config.categories.join(", ")}
- Subcategories: ${config.subcategories.join(", ")}
- Mode: ${config.mode}

Requirements:
- Each question must be realistic, at the difficulty level of the Thai กว. professional engineering exam
- Questions must be technically accurate and solvable
- Provide 4 answer options (A, B, C, D)
- Exactly one correct answer per question
- For calculation questions, include full working in the explanation
- For law/ethics questions, cite the relevant Thai engineering regulation or act
- Include a concise formula/concept reference where applicable
- Mix difficulty: 30% easy, 50% medium, 20% hard

Return ONLY a valid JSON array. No markdown, no explanation outside JSON. Format:
[
  {
    "id": "q1",
    "questionTH": "...",
    "questionEN": "...",
    "options": {
      "A": { "th": "...", "en": "..." },
      "B": { "th": "...", "en": "..." },
      "C": { "th": "...", "en": "..." },
      "D": { "th": "...", "en": "..." }
    },
    "correctAnswer": "A",
    "explanationTH": "...",
    "explanationEN": "...",
    "formula": "...",
    "reference": "...",
    "difficulty": "easy|medium|hard",
    "subcategory": "...",
    "tags": ["...", "..."]
  }
]`;
}

// Disable thinking mode: faster responses, no 400 errors
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const NO_THINKING = {
  generationConfig: { thinkingConfig: { thinkingBudget: 0 } } as any,
};

async function fetchBatch(
  config: ExamConfig,
  count: number,
  batchIndex: number,
  retries = 2,
): Promise<Question[]> {
  const model = genAI.getGenerativeModel({ model: MODEL, ...NO_THINKING });
  const prompt = buildQuestionPrompt(config, count);
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      // Strip any markdown code fences
      const cleaned = text
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      const parsed = JSON.parse(cleaned) as Question[];
      // Re-index IDs to avoid collisions across batches
      return parsed.map((q, i) => ({ ...q, id: `b${batchIndex}_q${i + 1}` }));
    } catch (err) {
      if (attempt === retries) throw err;
      await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
    }
  }
  return [];
}

export async function generateQuestions(
  config: ExamConfig,
  onProgress: (msg: string) => void,
): Promise<Question[]> {
  const BATCH_SIZE = 10;
  const total = config.questionCount;
  const numBatches = Math.ceil(total / BATCH_SIZE);
  const allQuestions: Question[] = [];

  // Check session cache
  const cacheKey = `exam_${config.branch}_${config.categories.join(",")}_${config.subcategories.join(",")}_${total}`;
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) {
    try {
      return JSON.parse(cached) as Question[];
    } catch {
      // ignore bad cache
    }
  }

  for (let i = 0; i < numBatches; i++) {
    const batchCount = Math.min(BATCH_SIZE, total - allQuestions.length);
    onProgress(`กำลังสร้างชุดที่ ${i + 1}/${numBatches}…`);
    const batch = await fetchBatch(config, batchCount, i);
    allQuestions.push(...batch);
  }

  sessionStorage.setItem(cacheKey, JSON.stringify(allQuestions));
  return allQuestions;
}

// ---------- Rate Limiting ----------
const generationTimestamps: number[] = [];

export function checkRateLimit(): boolean {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000; // 10 min
  const recent = generationTimestamps.filter((t) => now - t < windowMs);
  return recent.length >= 5;
}

export function recordGeneration(): void {
  generationTimestamps.push(Date.now());
}

// ---------- AI Chat ----------

const SYSTEM_PROMPT = `You are ENGI-Assistant, an expert AI tutor for Thai Professional Engineering License (กว.) exam preparation. 
You specialize in all 6 engineering branches: Civil, Electrical, Mechanical, Industrial, Chemical, Environmental.
You have deep knowledge of Thai engineering laws, วสท. standards, and กฎกระทรวง.
Answer in the same language the user writes in (Thai or English).
For calculations, always show step-by-step working.
For law/ethics questions, cite the specific section and act.
Keep answers focused on engineering exam preparation. If asked off-topic, politely redirect.
Format answers clearly with sections, formulas in code notation, newlines for steps.`;

export async function sendChatMessage(
  history: ChatMessage[],
  userMessage: string,
): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: MODEL,
    systemInstruction: SYSTEM_PROMPT,
    ...NO_THINKING,
  });
  const chat = model.startChat({
    history: history.slice(-10).map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    })),
  });
  const result = await chat.sendMessage(userMessage);
  return result.response.text();
}
