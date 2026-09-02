import { useRef } from 'react';
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
      className="bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-400 hover:bg-indigo-50/50 transition-all group flex flex-col items-center justify-center p-6 cursor-pointer min-h-[200px] h-full"
    >
      <div className="w-12 h-12 bg-indigo-100 text-indigo-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-indigo-500 group-hover:text-white transition-all shadow-sm">
        <Upload size={24} />
      </div>
      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-indigo-600 transition-colors text-center">{label}</span>
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
