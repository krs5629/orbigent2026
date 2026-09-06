import React, { useRef } from 'react';
import { Upload } from 'lucide-react';

interface UploaderProps {
  onUpload: (file: File) => void;
  label: string;
  accept?: string;
}

export function Uploader({ onUpload, label, accept }: UploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUpload(e.target.files[0]);
      e.target.value = '';
    }
  };

  return (
    <div 
      onClick={() => fileInputRef.current?.click()}
      className="bg-[#0e0b18]/70 hover:bg-[#130f24]/80 rounded-2xl sm:rounded-3xl border-2 border-dashed border-white/10 hover:border-purple-500/50 hover:shadow-[0_0_25px_rgba(168,85,247,0.2)] transition-all duration-300 group flex flex-col items-center justify-center p-6 cursor-pointer min-h-[190px] h-full text-center backdrop-blur-md"
    >
      <div className="w-12 h-12 bg-purple-950/60 border border-purple-500/30 text-purple-300 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white group-hover:border-purple-400 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all shadow-md">
        <Upload size={20} />
      </div>
      <span className="text-xs font-semibold tracking-wide text-zinc-300 group-hover:text-white transition-colors">{label}</span>
      <span className="text-[11px] text-zinc-500 mt-1 font-light">Click or drag file to upload</span>
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept={accept} 
      />
    </div>
  );
}
