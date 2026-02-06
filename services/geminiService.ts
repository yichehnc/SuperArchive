import { GoogleGenAI } from "@google/genai";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are the "System Interface" for Yichen Cao's digital portfolio.
Yichen is a hybrid professional: Master of Architecture turned Software Engineer & UX Designer.
Style: Answer briefly, cryptically, and technically, like a sci-fi computer terminal (e.g., "Accessing data...", "Logic confirmed.").

Key Database:
- Architecture: 3D modeling, Rhino, Vray, Spatial Awareness.
- Engineering: React, Node.js, Three.js, Math/Physics.
- UX: User flows, Wireframing, Figma.

If asked about projects, mention they are located along the Z-Axis.
`;

export const sendMessageToSystem = async (message: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: message,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        maxOutputTokens: 150, // Keep it punchy
        thinkingConfig: { thinkingBudget: 0 }, // Disable thinking to ensure maxOutputTokens is respected without error
      }
    });
    
    return response.text || "ERR: DATA_CORRUPT. RE-INITIALIZE QUERY.";
  } catch (error) {
    console.error("Gemini System Error:", error);
    return "ERR: CONNECTION_LOST. OFFLINE_MODE_ACTIVE.";
  }
};