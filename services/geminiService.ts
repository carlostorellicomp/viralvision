import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult } from "../types";

const ANALYSIS_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    viralScore: { type: Type.NUMBER, description: "Pontuação 0-100 do potencial viral." },
    hook: {
      type: Type.OBJECT,
      properties: {
        detected: { type: Type.BOOLEAN },
        description: { type: Type.STRING },
        effectiveness: { type: Type.STRING, enum: ["Baixa", "Média", "Alta"] },
        hookType: { type: Type.STRING, description: "O tipo técnico do gancho (ex: Quebra de Padrão, Pergunta Retórica, Choque Visual)." }
      },
      required: ["detected", "description", "effectiveness", "hookType"],
    },
    emotionalTriggers: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    psychologicalArchitecture: {
      type: Type.OBJECT,
      properties: {
        biasesUsed: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Vieses cognitivos (ex: Escassez, Prova Social, Aversão à Perda)." },
        emotionalArc: { type: Type.STRING, description: "A jornada emocional do espectador (ex: Curiosidade -> Tensão -> Alívio)." }
      },
      required: ["biasesUsed", "emotionalArc"]
    },
    narrativeStructure: {
      type: Type.OBJECT,
      properties: {
        type: { type: Type.STRING },
        pacing: { type: Type.STRING },
        keyMoments: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              timestamp: { type: Type.STRING, description: "Tempo aproximado (ex: '0-3s')" },
              description: { type: Type.STRING }
            }
          }
        }
      },
      required: ["type", "pacing", "keyMoments"],
    },
    visuals: {
      type: Type.OBJECT,
      properties: {
        quality: { type: Type.STRING },
        editingStyle: { type: Type.STRING },
        colors: { type: Type.ARRAY, items: { type: Type.STRING } },
        textOverlays: { type: Type.STRING, description: "Estratégia de texto na tela (legendas, títulos chamativos)." }
      },
      required: ["quality", "editingStyle", "colors", "textOverlays"],
    },
    audioVibe: { type: Type.STRING, description: "Estilo de áudio inferido/sugerido (ex: Música Trending Upbeat, Voiceover Sério, ASMR)." },
    cta: {
      type: Type.OBJECT,
      properties: {
        present: { type: Type.BOOLEAN },
        text: { type: Type.STRING },
        placement: { type: Type.STRING, enum: ["Middle", "End", "Throughout"] }
      },
      required: ["present", "text", "placement"],
    },
    replicationFormula: {
      type: Type.OBJECT,
      properties: {
        blueprint: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Passo a passo lógico da estrutura do vídeo para replicação." },
        fillInTheBlankTemplate: { type: Type.STRING, description: "Um roteiro genérico baseado neste vídeo onde posso inserir outro produto." },
        nicheApplicability: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Outros nichos onde este estilo funcionaria." }
      },
      required: ["blueprint", "fillInTheBlankTemplate", "nicheApplicability"]
    },
    audiencePersona: { type: Type.STRING },
  },
  required: ["viralScore", "hook", "emotionalTriggers", "psychologicalArchitecture", "narrativeStructure", "visuals", "audioVibe", "cta", "replicationFormula", "audiencePersona"],
};

export const analyzeVideoFrames = async (
  frames: string[]
): Promise<AnalysisResult> => {
  if (!process.env.API_KEY) {
    throw new Error("Missing API Key. Please configure process.env.API_KEY.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Construct parts: Text Prompt + Images
  const parts: any[] = [
    {
      text: `Você é um Analista de Engenharia Reversa de Conteúdo Viral Sênior e Cientista de Dados.
      
      Seu objetivo: Criar um 'Dossiê Técnico' deste vídeo para que um Agente de IA possa estudar sua estrutura e replicá-la para vender OUTROS produtos.
      
      Analise os frames fornecidos e extraia o DNA do vídeo:
      1. A Métrica Viral: Por que o algoritmo impulsionou isso? (Retenção, compartilhamento, salvamento?)
      2. A Arquitetura Psicológica: Que vieses cognitivos estão sendo explorados?
      3. O Template de Replicação: Crie um roteiro abstrato (blueprint) que funcione se eu trocar o produto do vídeo por um tênis, um software ou um suplemento.
      4. Análise Visual/Texto: Como o texto na tela segura a atenção?
      
      Responda ESTRITAMENTE em Português do Brasil.
      Seja extremamente técnico e detalhista na seção 'replicationFormula'.
      Retorne a análise estritamente no formato JSON baseado no schema.`
    }
  ];

  // Add frames as inline data
  frames.forEach(base64Data => {
    parts.push({
      inlineData: {
        mimeType: "image/jpeg",
        data: base64Data
      }
    });
  });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", 
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: ANALYSIS_SCHEMA,
        systemInstruction: "Você é o ViralVision Master Architect. Você desconstrói vídeos virais em algoritmos replicáveis.",
        temperature: 0.2, // Low temperature for precise, analytical output
      }
    });

    const text = response.text;
    if (!text) throw new Error("Sem resposta da IA");

    return JSON.parse(text) as AnalysisResult;

  } catch (error) {
    console.error("Falha na análise Gemini:", error);
    throw error;
  }
};