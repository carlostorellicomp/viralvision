export interface AnalysisResult {
  viralScore: number;
  hook: {
    detected: boolean;
    description: string;
    effectiveness: 'Baixa' | 'Média' | 'Alta';
    hookType: string; // ex: "Visual Disruption", "Statement of Fact", "Question"
  };
  emotionalTriggers: string[];
  psychologicalArchitecture: {
    biasesUsed: string[]; // ex: "FOMO", "Authority Bias", "Scarcity"
    emotionalArc: string; // ex: "Confusion -> Clarity -> Satisfaction"
  };
  narrativeStructure: {
    type: string;
    pacing: string; // ex: "Fast (0.5s cuts)"
    keyMoments: { timestamp: string; description: string }[];
  };
  visuals: {
    quality: string;
    editingStyle: string;
    colors: string[];
    textOverlays: string; // Analysis of on-screen text strategy
  };
  audioVibe: string; // Inferred audio style (Trending music, Voiceover, ASMR)
  cta: {
    present: boolean;
    text: string;
    placement: 'Middle' | 'End' | 'Throughout';
  };
  replicationFormula: {
    blueprint: string[]; // Step-by-step logic: "Step 1: Show problem. Step 2..."
    fillInTheBlankTemplate: string; // A script template for other products
    nicheApplicability: string[]; // Where else this works
  };
  audiencePersona: string;
}

export interface VideoMetadata {
  duration: number;
  width: number;
  height: number;
  frameCount: number;
}