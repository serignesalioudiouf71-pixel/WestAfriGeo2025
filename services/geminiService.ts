
import { GoogleGenAI, Type } from "@google/genai";
import { MineralAnalysis } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    rockName: {
      type: Type.STRING,
      description: "The primary name of the rock type (e.g., Granite, Basalt, Sandstone)."
    },
    description: {
      type: Type.STRING,
      description: "A brief geological description of the rock sample, including texture and general characteristics."
    },
    identifiedMinerals: {
      type: Type.ARRAY,
      description: "A list of minerals identified in the rock sample.",
      items: {
        type: Type.OBJECT,
        properties: {
          name: {
            type: Type.STRING,
            description: "The name of the mineral (e.g., Quartz, Feldspar)."
          },
          percentage: {
            type: Type.NUMBER,
            description: "The estimated percentage of this mineral in the sample."
          },
          description: {
            type: Type.STRING,
            description: "A short description of the mineral's appearance or properties."
          }
        },
        required: ["name", "percentage", "description"]
      }
    },
    economicPotential: {
      type: Type.STRING,
      description: "A brief analysis of the potential economic significance or use of this rock and its minerals."
    }
  },
  required: ["rockName", "description", "identifiedMinerals", "economicPotential"]
};


function fileToGenerativePart(base64Data: string, mimeType: string) {
  return {
    inlineData: {
      data: base64Data,
      mimeType
    },
  };
}

export const analyzeMineralSample = async (base64Data: string, mimeType: string): Promise<MineralAnalysis> => {
  const imagePart = fileToGenerativePart(base64Data, mimeType);
  const prompt = `You are an expert field geologist with experience in West African geology. Analyze the provided rock sample image. Identify the primary rock type, list the visible minerals with their estimated percentages, and provide a brief description of each. Finally, comment on the potential economic significance. Provide the output in the specified JSON format.`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, { text: prompt }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.2,
      },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as MineralAnalysis;
  } catch (error) {
    console.error("Error analyzing mineral sample:", error);
    throw new Error("Failed to get a valid analysis from the AI. The model may have returned an unexpected format.");
  }
};

export const generateDashboardSummary = async (analyses: MineralAnalysis[]): Promise<string> => {
  const prompt = `
    You are a senior geological consultant preparing a high-level summary for a project manager.
    Based on the following geological sample analysis data, provide a concise executive summary.

    The summary should include:
    1.  An overview of the dominant rock types found.
    2.  A list of the most significant minerals discovered and their average concentrations.
    3.  An analysis of the overall economic potential, highlighting any valuable minerals.
    4.  Any potential trends or anomalies worth investigating further.

    Keep the language clear, direct, and focused on actionable insights for a non-expert. Format the output using markdown with headings.

    Analysis Data:
    ${JSON.stringify(analyses, null, 2)}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.3,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Error generating dashboard summary:", error);
    throw new Error("Failed to generate a valid summary from the AI.");
  }
};
