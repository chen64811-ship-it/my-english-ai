import { GoogleGenAI, Type } from "@google/genai";
import { VocabularyItem, GrammarSuggestion, ReadingPassage, VocabQuizQuestion } from "../types";

export const getGeminiClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateVocabulary = async (topic: string): Promise<VocabularyItem[]> => {
  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate 5 English vocabulary words related to "${topic}". Provide phonetic, definition, example, and Chinese translation.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            word: { type: Type.STRING },
            phonetic: { type: Type.STRING },
            definition: { type: Type.STRING },
            example: { type: Type.STRING },
            chineseTranslation: { type: Type.STRING },
          },
          required: ["word", "phonetic", "definition", "example", "chineseTranslation"],
        },
      },
    },
  });
  return JSON.parse(response.text || "[]");
};

export const checkGrammar = async (text: string): Promise<GrammarSuggestion> => {
  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Check grammar: "${text}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: { original: { type: Type.STRING }, corrected: { type: Type.STRING }, explanation: { type: Type.STRING } },
        required: ["original", "corrected", "explanation"],
      },
    },
  });
  return JSON.parse(response.text || "{}");
};

export const generateReadingRoom = async (level: string, topic: string): Promise<ReadingPassage> => {
  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Write story for ${level} about ${topic}.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: { title: { type: Type.STRING }, content: { type: Type.STRING }, level: { type: Type.STRING }, questions: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { question: { type: Type.STRING }, options: { type: Type.ARRAY, items: { type: Type.STRING } }, answer: { type: Type.NUMBER } } } } },
      },
    },
  });
  return JSON.parse(response.text || "{}");
};

export const generateVocabQuiz = async (topic: string): Promise<VocabQuizQuestion[]> => {
  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `10 MCQs for ${topic}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { word: { type: Type.STRING }, options: { type: Type.ARRAY, items: { type: Type.STRING } }, correctIndex: { type: Type.NUMBER }, chineseMeaning: { type: Type.STRING }, exampleSentence: { type: Type.STRING } } } },
    },
  });
  return JSON.parse(response.text || "[]");
};