import React, { useRef, useState } from 'react';
import { UploadCloud, FileVideo, AlertCircle } from 'lucide-react';

interface Props {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
  error?: string | null;
}

export const UploadSection: React.FC<Props> = ({ onFileSelect, isProcessing, error }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      validateAndUpload(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndUpload(e.target.files[0]);
    }
  };

  const validateAndUpload = (file: File) => {
    // Basic validation
    if (!file.type.startsWith('video/')) {
      alert("Por favor, envie um arquivo de vídeo válido.");
      return;
    }
    // Limit size for client-side processing to approx 50MB to prevent browser crash
    if (file.size > 50 * 1024 * 1024) {
      alert("Para esta demonstração no navegador, o tamanho do vídeo é limitado a 50MB.");
      return;
    }
    onFileSelect(file);
  };

  return (
    <div className="w-full max-w-2xl mx-auto text-center">
       <div 
        className={`
          relative group cursor-pointer
          border-2 border-dashed rounded-3xl p-12 transition-all duration-300
          ${isDragging ? 'border-fuchsia-500 bg-fuchsia-500/10' : 'border-slate-600 hover:border-fuchsia-400/50 hover:bg-slate-800/50'}
          ${isProcessing ? 'opacity-50 pointer-events-none' : ''}
          glass-panel
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="video/*"
          onChange={handleFileInput}
        />
        
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 neon-glow">
            {isProcessing ? (
               <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-fuchsia-500"></div>
            ) : (
               <UploadCloud className="w-10 h-10 text-fuchsia-500" />
            )}
          </div>
          
          <div className="space-y-2">
             <h3 className="text-2xl font-bold text-white">
                {isProcessing ? 'Analisando Conteúdo...' : 'Enviar Vídeo'}
             </h3>
             <p className="text-slate-400">
               {isProcessing ? 'Extraindo frames e executando modelos de IA' : 'Arraste e solte ou clique para navegar'}
             </p>
          </div>

          <div className="flex items-center space-x-2 text-xs text-slate-500 bg-slate-900/50 px-4 py-2 rounded-full">
            <FileVideo className="w-4 h-4" />
            <span>Suporta MP4, MOV (Máx 50MB)</span>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="mt-4 p-4 bg-red-900/20 border border-red-500/50 rounded-lg flex items-center justify-center text-red-200 animate-pulse">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      {!isProcessing && !error && (
        <p className="mt-8 text-sm text-slate-500">
          Desenvolvido com Gemini 2.5 Flash • Nenhum vídeo é armazenado nos servidores.
        </p>
      )}
    </div>
  );
};