
import { GoogleGenAI, Type } from "@google/genai";

export class GeminiService {
  private static instance: GeminiService;
  private ai: GoogleGenAI;

  private constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  public static getInstance(): GeminiService {
    if (!GeminiService.instance) {
      GeminiService.instance = new GeminiService();
    }
    return GeminiService.instance;
  }

  /**
   * Generates post content based on a user prompt.
   */
  public async generatePostContent(prompt: string): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Create a concise, engaging social media post (max 280 chars) about: ${prompt}. Use a few relevant emojis but keep it professional yet trendy.`,
        config: {
          temperature: 0.7,
          maxOutputTokens: 200,
        }
      });
      return response.text || "Failed to generate content.";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Oops! AI is busy right now. Try writing it yourself?";
    }
  }

  /**
   * Generates an image based on post content.
   */
  public async generatePostImage(content: string): Promise<string | null> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: `A high quality, vibrant artistic illustration for a social media post about: ${content}` }]
        },
        config: {
          imageConfig: {
            aspectRatio: "16:9"
          }
        }
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
      return null;
    } catch (error) {
      console.error("Image Gen Error:", error);
      return null;
    }
  }

  /**
   * Suggests trending topics using search grounding.
   */
  public async getTrendingTopics(): Promise<{ topic: string, summary: string, links: string[] }[]> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: "What are the top 3 trending technology and lifestyle topics today? Provide a short 1-sentence summary for each.",
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                topic: { type: Type.STRING },
                summary: { type: Type.STRING },
                links: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ['topic', 'summary']
            }
          }
        }
      });

      const groundingLinks = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((c: any) => c.web?.uri).filter(Boolean) || [];
      
      const parsed = JSON.parse(response.text || "[]");
      return parsed.map((item: any, idx: number) => ({
        ...item,
        links: groundingLinks.slice(idx * 2, (idx + 1) * 2)
      }));
    } catch (error) {
      console.error("Trending Error:", error);
      return [
        { topic: "Blue AI", summary: "AI-integrated social media is the new frontier.", links: [] },
        { topic: "Remote Work", summary: "The debate on returning to office continues globally.", links: [] }
      ];
    }
  }
}
