import { GoogleGenAI } from "@google/genai";
import { removeBackground as imglyRemoveBackground } from "@imgly/background-removal";

const primaryKey = process.env.GEMINI_API_KEY;
const fallbackKey = import.meta.env.VITE_MY_GEMINI_KEY || process.env.MY_GEMINI_KEY;

const getAI = (useFallback = false) => {
  const key = useFallback ? (fallbackKey || primaryKey) : primaryKey;
  return new GoogleGenAI({ apiKey: key! });
};

async function executeWithFallback<T>(operation: (ai: any) => Promise<T>): Promise<T> {
  try {
    // Try with Primary (Free Tier)
    return await operation(getAI(false));
  } catch (error: any) {
    // If quota exceeded or other error, and we have a fallback key
    if (fallbackKey && fallbackKey !== primaryKey) {
      console.warn("Primary Gemini key failed or exhausted. Trying fallback key...");
      try {
        return await operation(getAI(true));
      } catch (fallbackError) {
        console.error("Fallback Gemini key also failed:", fallbackError);
        throw fallbackError;
      }
    }
    throw error;
  }
}

export const removeBackground = async (imageBase64: string): Promise<string | null> => {
  // Primary Strategy: Specialized local AI model (WASM)
  // Why? It's free (unlimited users), runs locally, and excels at transparency.
  try {
    const blob = await imglyRemoveBackground(imageBase64, {
      model: 'isnet_fp16',
      output: {
        format: 'image/png',
        quality: 0.95
      }
    });

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  } catch (err) {
    console.warn("Local AI removal failed, trying Gemini backup:", err);
  }

  // Fallback: Gemini (last resort)
  return executeWithFallback(async (ai) => {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: {
          parts: [
            {
              inlineData: {
                data: imageBase64.split(',')[1],
                mimeType: 'image/png',
              },
            },
            {
              text: 'Carefully remove the background from this image. You MUST return ONLY the subject on a TRUE transparent background (alpha = 0). Ensure the edges are clean, antialiased, and sharp, specifically mimicking the professional output of the img.ly background removal SDK.',
            },
          ],
        },
      });

      if (!response.candidates?.[0]?.content?.parts) return null;

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
      return null;
    } catch (error) {
      console.error('Gemini BG Remove Error:', error);
      return null;
    }
  });
};

export const generateAsset = async (prompt: string, style: string, aspectRatio: string = "1:1"): Promise<string | null> => {
  return executeWithFallback(async (ai) => {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-image-preview',
        contents: {
          parts: [{ text: `${prompt} in ${style} style. Professional quality asset for a slide presentation. Clean, high-resolution output.` }],
        },
        config: {
          imageConfig: {
            aspectRatio: aspectRatio as any,
            imageSize: "1K"
          },
        },
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
      return null;
    } catch (error) {
      console.error('Gemini Generation Error:', error);
      return null;
    }
  });
};

export const enhanceImage = async (imageBase64: string, mimeType: string, instruction: string): Promise<string | null> => {
  return executeWithFallback(async (ai) => {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-image-preview',
        contents: {
          parts: [
            {
              inlineData: {
                data: imageBase64.split(',')[1],
                mimeType: mimeType,
              },
            },
            {
              text: instruction,
            },
          ],
        },
        config: {
          imageConfig: {
            imageSize: "1K"
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
      console.error('Gemini Enhance Error:', error);
      return null;
    }
  });
};
