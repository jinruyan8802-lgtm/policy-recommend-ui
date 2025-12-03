import { GoogleGenAI, Type, Schema } from "@google/genai";
import { PolicyConfig } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const policySchema: Schema = {
  type: Type.OBJECT,
  properties: {
    storageName: { type: Type.STRING, description: "Enterprise FQDN of storage system (e.g., dpswl057.drm.lab.emc.com)" },
    storageUnit: { type: Type.STRING, description: "Internal storage unit identifier" },
    spaceUsedPercent: { type: Type.NUMBER, description: "Percentage of space used (0-100)" },
    totalSpaceGB: { type: Type.NUMBER, description: "Total capacity in GB" },
    location: { type: Type.STRING, description: "Physical or logical location (e.g., Boston DC, AWS East)" },
    networkInterface: { type: Type.STRING, description: "Network interface name or FQDN" },
    retentionLock: { type: Type.BOOLEAN, description: "Whether retention lock is enabled for compliance" },
    sla: { type: Type.STRING, description: "Service Level Agreement tier (Gold, Silver, Bronze)", nullable: true },
    schedule: {
      type: Type.OBJECT,
      properties: {
        type: { type: Type.STRING, description: "Backup type (e.g., Synthetic full, Incremental)" },
        frequency: { type: Type.STRING, description: "Frequency text (e.g., 'every Day')" },
        retentionDays: { type: Type.NUMBER, description: "Number of days to retain data" },
        windowStart: { type: Type.STRING, description: "Start time (e.g., 9:44 AM)" },
        windowEnd: { type: Type.STRING, description: "End time (e.g., 9:46 AM)" },
        description: { type: Type.STRING, description: "A natural language summary of the schedule policy" },
      },
      required: ["type", "frequency", "retentionDays", "windowStart", "windowEnd", "description"]
    }
  },
  required: ["storageName", "storageUnit", "spaceUsedPercent", "totalSpaceGB", "schedule"]
};

export const getPolicyRecommendation = async (userPrompt: string): Promise<PolicyConfig> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are an expert Data Protection Administrator. 
      Generate a realistic Data Protection Policy configuration JSON based on the user's requirement. 
      Use enterprise-sounding server names (like 'dpswl057.drm.lab.emc.com') and realistic values.
      
      User Requirement: "${userPrompt}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: policySchema,
        systemInstruction: "You are a backend configuration engine for an enterprise backup solution. Your goal is to translate business intent into technical configuration settings."
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as PolicyConfig;
    }
    throw new Error("No data returned from AI");
  } catch (error) {
    console.error("Error generating policy:", error);
    throw error;
  }
};