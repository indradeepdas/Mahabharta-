// @google/genai guidelines: Use gemini-3-pro-preview for complex reasoning and gemini-3-flash-preview for standard generation.
// gemini-2.5-flash-image is correct for image generation.
import { GoogleGenAI, Type } from "@google/genai";
import { RetrievalResponse, DiscoveryResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION_RETRIEVAL = `
You are an expert scholar of the Mahabharata. 
Your task is to act as a retrieval engine for a comic book generator.
You will be provided with text from the Mahabharata.
1. Search the provided text for the user's requested scene/story.
2. If found (or if a very similar event exists), break the scene down into 4 to 8 sequential comic panels.
3. If the specific event is NOT in the text, but is a well-known Mahabharata event that fits the context of the characters present in the text, you may generate it based on general knowledge, BUT prefer the text.
4. If the request is completely unrelated to the epic, return found: false.
5. For each panel:
   - title: Short title.
   - visualDescription: Detailed visual instructions for an artist. Describe the setting, characters' appearance (based on text), emotions, and action. Style: Ancient Indian epic, authentic attire.
   - narration: The dialogue or caption text (max 20 words). DIRECTLY QUOTE or closely paraphrase the source.
   - sourceReference: The specific Page Number or Chapter from the text where this occurs.
`;

// Define schemas as plain objects using the Type enum as per guidelines.
const STORYBOARD_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    found: { type: Type.BOOLEAN },
    reason: { type: Type.STRING },
    panels: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          visualDescription: { type: Type.STRING },
          narration: { type: Type.STRING },
          sourceReference: { type: Type.STRING }
        },
        required: ["title", "visualDescription", "narration", "sourceReference"]
      }
    }
  },
  required: ["found"]
};

const BATCH_DISCOVERY_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    characters: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          name: { type: Type.STRING },
          role: { type: Type.STRING },
          color: { type: Type.STRING, description: "A tailwind background color like 'bg-orange-100'" },
          stories: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                tagline: { type: Type.STRING },
                prompt: { type: Type.STRING }
              },
              required: ["title", "tagline", "prompt"]
            }
          }
        },
        required: ["id", "name", "role", "color", "stories"]
      }
    }
  },
  required: ["characters"]
};

const cleanJson = (text: string) => {
  return text.replace(/```json/g, '').replace(/```/g, '').trim();
};

export const performFullBookDiscovery = async (
  bookContext: string
): Promise<DiscoveryResponse> => {
  try {
    const safeContext = bookContext.slice(0, 150000); // Use a healthy chunk for analysis
    
    // Using gemini-3-pro-preview for complex analysis of epic text.
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `
        ANALYZE THIS TEXT:
        ${safeContext}
        
        TASK:
        1. Identify the 8-10 most prominent characters mentioned in this specific text.
        2. For EACH character, generate exactly 10 distinct story episodes found in the text.
        3. Ensure the prompts are descriptive enough for a storyboard generator.
      `,
      config: {
        systemInstruction: "You are an archivist. Index the characters and their story arcs from the provided Mahabharata text. Be thorough and ensure every character has a unique set of 10 stories.",
        responseMimeType: "application/json",
        responseSchema: BATCH_DISCOVERY_SCHEMA,
      },
    });

    const text = response.text;
    if (!text) throw new Error("Indexing failed");
    return JSON.parse(cleanJson(text)) as DiscoveryResponse;
  } catch (error) {
    console.error("Discovery error:", error);
    throw error;
  }
};

export const generateStoryboardPlan = async (
  bookContext: string,
  userPrompt: string
): Promise<RetrievalResponse> => {
  try {
    const safeContext = bookContext.slice(0, 300000); 
    // Using gemini-3-flash-preview for storyboard generation task.
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `CONTEXT:\n${safeContext}\n\nSTORY TO VISUALIZE: ${userPrompt}`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_RETRIEVAL,
        responseMimeType: "application/json",
        responseSchema: STORYBOARD_SCHEMA,
      },
    });
    // Accessing .text property directly as it returns the string output.
    return JSON.parse(cleanJson(response.text || "")) as RetrievalResponse;
  } catch (error) {
    throw error;
  }
};

export const generatePanelImage = async (
  visualDescription: string
): Promise<string | null> => {
  try {
    // gemini-2.5-flash-image is used for image generation via generateContent.
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image', 
      contents: `Mahabharata comic panel, hand-drawn Indian epic style, earth tones: ${visualDescription}`,
    });

    // Iterate through response parts to find image data as per guidelines.
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
    return null;
  } catch (error) {
    return null;
  }
};