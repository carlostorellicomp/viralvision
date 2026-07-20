import React, { useState } from 'react';
import { AnalysisResult } from '../types';
import { ScoreGauge } from './ScoreGauge';
import { generatePDF } from '../utils/pdfGenerator';
import { 
  CheckCircle, 
  AlertTriangle, 
  Activity, 
  Eye, 
  MessageSquare, 
  Zap,
  Film,
  Download,
  Brain,
  Copy,
  Layers
} from 'lucide-react';

interface Props {
  data: AnalysisResult;
  onReset: () => void;
}

export const AnalysisDashboard: React.FC<Props> = ({ data, onReset }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'blueprint'>('overview');

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center glass-panel p-6 rounded-2xl border-l-4 border-fuchsia-500">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Dossiê Viral</h2>
          <p className="text-slate-400">Público Alvo: <span className="text-fuchsia-400">{data.audiencePersona}</span></p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-6">
           <ScoreGauge score={data.viralScore} />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-slate-700 pb-1">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'overview' ? 'text-fuchsia-400 border-b-2 border-fuchsia-500' : 'text-slate-400 hover:text-white'}`}
        >
          Visão Geral
        </button>
        <button 
          onClick={() => setActiveTab('blueprint')}
          className={`px-4 py-2 text-sm font-medium transition-colors flex items-center ${activeTab === 'blueprint' ? 'text-fuchsia-400 border-b-2 border-fuchsia-500' : 'text-slate-400 hover:text-white'}`}
        >
          <Brain className="w-4 h-4 mr-2" />
          Blueprint de Replicação
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
          
          {/* The Hook */}
          <div className="glass-panel p-6 rounded-2xl md:col-span-1">
            <div className="flex items-center mb-4 space-x-2 text-fuchsia-400">
              <Zap className="w-6 h-6" />
              <h3 className="text-lg font-bold">Gancho (0-3s)</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Detectado?</span>
                {data.hook.detected ? (
                  <span className="flex items-center text-green-400 text-sm font-bold"><CheckCircle className="w-4 h-4 mr-1" /> Sim</span>
                ) : (
                  <span className="flex items-center text-red-400 text-sm font-bold"><AlertTriangle className="w-4 h-4 mr-1" /> Não</span>
                )}
              </div>
              <div className="bg-slate-800/50 p-2 rounded">
                 <span className="text-xs text-slate-500 uppercase block">Tipo Técnico</span>
                 <span className="text-white font-medium text-sm">{data.hook.hookType}</span>
              </div>
              <div>
                 <span className="text-xs text-slate-500 uppercase">Efetividade</span>
                 <div className="w-full bg-slate-800 h-2 rounded-full mt-1">
                   <div 
                      className={`h-full rounded-full ${data.hook.effectiveness === 'Alta' ? 'bg-green-500 w-full' : data.hook.effectiveness === 'Média' ? 'bg-yellow-500 w-2/3' : 'bg-red-500 w-1/3'}`}
                   ></div>
                 </div>
              </div>
              <p className="text-sm text-slate-300 italic border-l-2 border-slate-600 pl-2">"{data.hook.description}"</p>
            </div>
          </div>

          {/* Narrative & Visuals */}
          <div className="glass-panel p-6 rounded-2xl md:col-span-1">
            <div className="flex items-center mb-4 space-x-2 text-blue-400">
              <Film className="w-6 h-6" />
              <h3 className="text-lg font-bold">Engenharia Visual</h3>
            </div>
            <ul className="space-y-3 text-sm">
              <li className="flex flex-col">
                <span className="text-slate-500 text-xs uppercase">Arquitetura</span>
                <span className="text-white font-medium">{data.narrativeStructure.type}</span>
              </li>
              <li className="flex flex-col">
                <span className="text-slate-500 text-xs uppercase">Cadência (Pacing)</span>
                <span className="text-white font-medium">{data.narrativeStructure.pacing}</span>
              </li>
              <li className="flex flex-col">
                <span className="text-slate-500 text-xs uppercase">Estratégia de Texto</span>
                <span className="text-white font-medium text-xs">{data.visuals.textOverlays}</span>
              </li>
              <li className="flex flex-col">
                <span className="text-slate-500 text-xs uppercase">Vibe de Áudio (Sugerido)</span>
                <span className="text-fuchsia-300 font-medium text-xs">{data.audioVibe}</span>
              </li>
            </ul>
          </div>

          {/* Triggers & CTA */}
          <div className="glass-panel p-6 rounded-2xl md:col-span-1">
            <div className="flex items-center mb-4 space-x-2 text-yellow-400">
              <Activity className="w-6 h-6" />
              <h3 className="text-lg font-bold">Psicologia</h3>
            </div>
            
            <div className="mb-4">
              <span className="text-slate-500 text-xs uppercase mb-2 block">Vieses Cognitivos</span>
              <div className="flex flex-wrap gap-2">
                {data.psychologicalArchitecture.biasesUsed.map((t, i) => (
                  <span key={i} className="px-2 py-1 bg-yellow-900/30 text-yellow-500 text-xs rounded border border-yellow-700/30">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-4">
               <span className="text-slate-500 text-xs uppercase mb-1 block">Arco Emocional</span>
               <p className="text-sm text-slate-300">{data.psychologicalArchitecture.emotionalArc}</p>
            </div>

            <div>
               <span className="text-slate-500 text-xs uppercase mb-1 block">CTA ({data.cta.placement})</span>
               {data.cta.present ? (
                  <div className="p-2 bg-slate-800 rounded border-l-2 border-green-500">
                    <p className="text-xs text-white">{data.cta.text}</p>
                  </div>
               ) : (
                  <p className="text-xs text-slate-500">Ausente</p>
               )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'blueprint' && (
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
            {/* Step by Step Algorithm */}
            <div className="glass-panel p-6 rounded-2xl">
               <div className="flex items-center mb-4 space-x-2 text-fuchsia-400">
                  <Layers className="w-6 h-6" />
                  <h3 className="text-lg font-bold">Algoritmo Passo a Passo</h3>
               </div>
               <div className="space-y-3">
                  {data.replicationFormula.blueprint.map((step, idx) => (
                     <div key={idx} className="flex items-start">
                        <div className="bg-slate-800 text-slate-400 w-6 h-6 rounded flex items-center justify-center text-xs font-mono mr-3 flex-shrink-0">
                           {idx + 1}
                        </div>
                        <p className="text-slate-300 text-sm">{step}</p>
                     </div>
                  ))}
               </div>
            </div>

            {/* Template */}
            <div className="glass-panel p-6 rounded-2xl flex flex-col">
               <div className="flex items-center mb-4 space-x-2 text-green-400">
                  <Copy className="w-6 h-6" />
                  <h3 className="text-lg font-bold">Template Genérico (Prompt)</h3>
               </div>
               <div className="flex-grow bg-slate-900/80 p-4 rounded-lg border border-slate-700 overflow-auto font-mono text-xs text-slate-400">
                  <pre className="whitespace-pre-wrap">{data.replicationFormula.fillInTheBlankTemplate}</pre>
               </div>
               <div className="mt-4">
                  <span className="text-xs text-slate-500 uppercase block mb-2">Funciona também para:</span>
                  <div className="flex flex-wrap gap-2">
                     {data.replicationFormula.nicheApplicability.map((niche, i) => (
                        <span key={i} className="text-xs px-2 py-1 bg-slate-700 rounded-full text-slate-300">{niche}</span>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      )}

      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-6 border-t border-slate-800">
        <button 
          onClick={onReset}
          className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-full font-semibold transition-all border border-slate-600 hover:border-fuchsia-500"
        >
          Analisar Outro Vídeo
        </button>
        
        <button 
          onClick={() => generatePDF(data)}
          className="px-8 py-3 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-full font-semibold transition-all shadow-lg shadow-fuchsia-900/30 flex items-center group"
        >
          <Download className="w-5 h-5 mr-2 group-hover:animate-bounce" />
          Baixar Dossiê Técnico (PDF)
        </button>
      </div>
    </div>
  );
};