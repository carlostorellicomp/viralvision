import React, { useState, useEffect } from 'react';
import { UploadSection } from './components/UploadSection';
import { AnalysisDashboard } from './components/AnalysisDashboard';
import { extractFramesFromVideo } from './utils/videoProcessor';
import { analyzeVideoFrames } from './services/geminiService';
import { AnalysisResult } from './types';
import { Sparkles, BarChart2, Video } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<'upload' | 'processing' | 'results'>('upload');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState<string>('');

  useEffect(() => {
    if (!process.env.API_KEY) {
      setError("API_KEY não encontrado no ambiente. Por favor configure process.env.API_KEY.");
    }
  }, []);

  const handleFileSelect = async (file: File) => {
    setView('processing');
    setError(null);

    try {
      // Step 1: Extract Frames
      setLoadingStep('Dividindo vídeo em frames...');
      const { frames, metadata } = await extractFramesFromVideo(file);
      
      console.log(`Extracted ${frames.length} frames. Duration: ${metadata.duration}s`);

      // Step 2: Send to Gemini
      setLoadingStep('IA Vision está analisando padrões virais...');
      const result = await analyzeVideoFrames(frames);
      
      setAnalysisResult(result);
      setView('results');

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Ocorreu um erro inesperado durante a análise.");
      setView('upload');
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setView('upload');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-96 bg-fuchsia-900/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-full h-96 bg-blue-900/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Navbar */}
      <nav className="relative z-10 w-full px-6 py-6 border-b border-slate-800/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
             <div className="bg-gradient-to-tr from-fuchsia-500 to-purple-600 p-2 rounded-lg neon-glow">
                <Video className="w-6 h-6 text-white" />
             </div>
             <div>
               <h1 className="text-2xl font-bold tracking-tight text-white">ViralVision<span className="text-fuchsia-500">.</span></h1>
               <p className="text-xs text-slate-400 hidden sm:block">Decifre o algoritmo</p>
             </div>
          </div>
          <div className="flex space-x-4">
             {/* Nav items could go here */}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[80vh]">
        
        {view === 'upload' && (
          <div className="w-full animate-fade-in-up">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-6xl font-bold mb-6">
                Por que alguns vídeos <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-purple-400">explodem online?</span>
              </h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                Envie seu TikTok, Reel ou Short. Nossa IA analisa os ganchos visuais, gatilhos emocionais e ritmo para te dar uma Pontuação Viral.
              </p>
            </div>
            
            <UploadSection 
              onFileSelect={handleFileSelect} 
              isProcessing={false}
              error={error}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-5xl mx-auto">
               <FeatureCard 
                 icon={<Sparkles className="w-6 h-6 text-yellow-400" />}
                 title="Detecção de Gancho"
                 desc="Analisamos os primeiros 3 segundos para garantir que você pare a rolagem imediatamente."
               />
               <FeatureCard 
                 icon={<BarChart2 className="w-6 h-6 text-blue-400" />}
                 title="Ritmo Narrativo"
                 desc="A IA mede a frequência de cortes e estratégias de retenção visual."
               />
               <FeatureCard 
                 icon={<Video className="w-6 h-6 text-fuchsia-400" />}
                 title="Guia de Replicação"
                 desc="Receba passos práticos para recriar o efeito viral específico."
               />
            </div>
          </div>
        )}

        {view === 'processing' && (
          <div className="flex flex-col items-center justify-center space-y-8 animate-pulse">
             <div className="relative w-32 h-32">
                <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-fuchsia-500 rounded-full border-t-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Video className="w-10 h-10 text-slate-500" />
                </div>
             </div>
             <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-2">Analisando DNA do Vídeo</h3>
                <p className="text-fuchsia-400">{loadingStep}</p>
             </div>
          </div>
        )}

        {view === 'results' && analysisResult && (
          <AnalysisDashboard 
            data={analysisResult} 
            onReset={handleReset} 
          />
        )}

      </main>

      {/* Footer */}
      <footer className="relative z-10 py-8 text-center text-slate-600 text-sm">
        <p>&copy; 2024 ViralVision Labs. Desenvolvido com Gemini 2.5 Flash.</p>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="p-6 bg-slate-800/30 border border-slate-700/50 rounded-2xl hover:bg-slate-800/50 transition-colors">
    <div className="mb-4 bg-slate-900 w-12 h-12 rounded-xl flex items-center justify-center border border-slate-700">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-slate-400 leading-relaxed">{desc}</p>
  </div>
);

export default App;