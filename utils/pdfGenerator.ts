import { jsPDF } from "jspdf";
import { AnalysisResult } from "../types";

export const generatePDF = (data: AnalysisResult) => {
  const doc = new jsPDF();
  
  // Configuration
  const pageHeight = doc.internal.pageSize.height;
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  
  // Colors
  const primaryColor = [192, 38, 211]; // Fuchsia 600
  const secondaryColor = [71, 85, 105]; // Slate 600
  const headerColor = [30, 41, 59]; // Slate 800
  const accentColor = [14, 165, 233]; // Sky 500

  // Helper to check page break
  let yPos = 20;
  const checkPageBreak = (heightNeeded: number) => {
    if (yPos + heightNeeded > pageHeight - margin) {
      doc.addPage();
      yPos = margin;
      return true;
    }
    return false;
  };

  // Helper: Section Header
  const addSectionHeader = (title: string, isMain: boolean = false) => {
    checkPageBreak(20);
    if (isMain) {
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.rect(margin, yPos, contentWidth, 10, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text(title.toUpperCase(), margin + 5, yPos + 7);
      yPos += 18;
    } else {
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text(title.toUpperCase(), margin, yPos);
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, yPos + 2, pageWidth - margin, yPos + 2);
      yPos += 10;
    }
    doc.setTextColor(headerColor[0], headerColor[1], headerColor[2]);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
  };

  // Helper: Key-Value pair
  const addKeyValue = (key: string, value: string) => {
    const keyWidth = 50;
    const valueLines = doc.splitTextToSize(value, contentWidth - keyWidth);
    checkPageBreak(valueLines.length * 5 + 2);
    
    doc.setFont("helvetica", "bold");
    doc.text(`${key}:`, margin, yPos);
    
    doc.setFont("helvetica", "normal");
    doc.text(valueLines, margin + keyWidth, yPos);
    
    yPos += (valueLines.length * 5) + 3;
  };

  // Helper: Text Block
  const addTextBlock = (text: string) => {
    const lines = doc.splitTextToSize(text, contentWidth);
    checkPageBreak(lines.length * 5 + 5);
    doc.text(lines, margin, yPos);
    yPos += (lines.length * 5) + 5;
  };

  // --- TITLE PAGE ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text("DOSSIÊ TÉCNICO", margin, yPos + 10);
  
  doc.setFontSize(14);
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.text("ENGENHARIA REVERSA DE CONTEÚDO VIRAL", margin, yPos + 20);

  yPos += 40;
  
  // Executive Summary Box
  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setLineWidth(1);
  doc.rect(margin, yPos, contentWidth, 50);
  
  doc.setFontSize(16);
  doc.setTextColor(headerColor[0], headerColor[1], headerColor[2]);
  doc.text("PONTUAÇÃO DE VIRALIZAÇÃO", margin + 10, yPos + 15);
  
  doc.setFontSize(40);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text(`${data.viralScore}/100`, margin + 10, yPos + 35);
  
  doc.setFontSize(10);
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, margin + 120, yPos + 15);
  doc.text(`Perfil: ${data.audiencePersona}`, margin + 120, yPos + 25);
  
  yPos += 70;

  // --- SECTION 1: ESTRUTURA E ARQUITETURA ---
  addSectionHeader("1. Arquitetura Lógica e Estrutural", true);
  
  addKeyValue("Gancho (Hook)", data.hook.description);
  addKeyValue("Tipo de Gancho", data.hook.hookType);
  addKeyValue("Efetividade", data.hook.effectiveness);
  addKeyValue("Arco Emocional", data.psychologicalArchitecture.emotionalArc);
  addKeyValue("Ritmo (Pacing)", data.narrativeStructure.pacing);
  
  yPos += 5;
  addSectionHeader("Momentos Chave");
  data.narrativeStructure.keyMoments.forEach(moment => {
    addKeyValue(moment.timestamp, moment.description);
  });

  // --- SECTION 2: PSICOLOGIA E ENGAJAMENTO ---
  addSectionHeader("2. Engenharia Psicológica", true);
  
  addKeyValue("Gatilhos Emocionais", data.emotionalTriggers.join(", "));
  addKeyValue("Vieses Cognitivos", data.psychologicalArchitecture.biasesUsed.join(", "));
  addKeyValue("Estratégia de CTA", `${data.cta.text} (Posição: ${data.cta.placement})`);
  addKeyValue("Estratégia Visual", data.visuals.textOverlays);
  addKeyValue("Vibe de Áudio", data.audioVibe);

  // --- SECTION 3: BASE DE CONHECIMENTO PARA AGENTE ---
  addSectionHeader("3. BASE DE CONHECIMENTO PARA AGENTE (REPLICAÇÃO)", true);
  
  doc.setFont("courier", "normal");
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.setFillColor(240, 240, 240); // Light gray background for code/template
  
  // Calculate height for blueprint
  const blueprintLines = data.replicationFormula.blueprint.map(step => `[ ] ${step}`);
  const blueprintText = blueprintLines.join("\n");
  const splitBlueprint = doc.splitTextToSize(blueprintText, contentWidth - 10);
  
  // Draw box for Blueprint
  checkPageBreak(splitBlueprint.length * 5 + 30);
  doc.rect(margin, yPos, contentWidth, (splitBlueprint.length * 5) + 20, 'F');
  
  doc.setFont("helvetica", "bold");
  doc.text("ALGORITMO PASSO A PASSO (BLUEPRINT):", margin + 5, yPos + 10);
  doc.setFont("courier", "normal");
  doc.text(splitBlueprint, margin + 5, yPos + 20);
  
  yPos += (splitBlueprint.length * 5) + 30;

  // Template Fill-in-the-blank
  addSectionHeader("Template Genérico (Prompt para LLM)");
  doc.setFont("courier", "normal");
  doc.setFontSize(9);
  
  const templateText = data.replicationFormula.fillInTheBlankTemplate;
  const splitTemplate = doc.splitTextToSize(templateText, contentWidth);
  
  checkPageBreak(splitTemplate.length * 4 + 10);
  doc.text(splitTemplate, margin, yPos);
  
  yPos += (splitTemplate.length * 4) + 15;

  addKeyValue("Aplicabilidade em Nichos", data.replicationFormula.nicheApplicability.join(", "));

  // --- FOOTER ---
  const pageCount = doc.getNumberOfPages();
  for(let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(150);
    doc.text(`ViralVision Agent Dossier • ID: ${Math.random().toString(36).substr(2, 9).toUpperCase()}`, margin, pageHeight - 10);
    doc.text(`Página ${i} de ${pageCount}`, pageWidth - margin, pageHeight - 10, { align: "right" });
  }

  doc.save("viralvision-dossie-tecnico.pdf");
};