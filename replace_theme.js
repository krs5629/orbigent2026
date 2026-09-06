import fs from 'fs';
import path from 'path';

const directories = ['src/pages', 'src/components'];

const replacements = [
  // Backgrounds
  { regex: /bg-slate-50/g, replacement: 'bg-black/50' },
  { regex: /bg-white/g, replacement: 'bg-zinc-950/80 backdrop-blur-sm' },
  { regex: /bg-slate-100/g, replacement: 'bg-zinc-900/50' },
  { regex: /bg-slate-900/g, replacement: 'bg-black' },
  { regex: /bg-slate-800/g, replacement: 'bg-zinc-900' },
  { regex: /bg-slate-700/g, replacement: 'bg-zinc-800' },
  
  // Borders
  { regex: /border-slate-200/g, replacement: 'border-[#50C878]/30' },
  { regex: /border-slate-100/g, replacement: 'border-[#50C878]/20' },
  { regex: /border-slate-800/g, replacement: 'border-[#50C878]/30' },
  { regex: /border-slate-700/g, replacement: 'border-[#50C878]/40' },
  
  // Text colors
  { regex: /text-slate-900/g, replacement: 'text-white' },
  { regex: /text-slate-800/g, replacement: 'text-gray-100' },
  { regex: /text-slate-700/g, replacement: 'text-gray-300' },
  { regex: /text-slate-600/g, replacement: 'text-gray-400' },
  { regex: /text-slate-500/g, replacement: 'text-gray-500' },
  { regex: /text-slate-400/g, replacement: 'text-gray-500' },
  { regex: /text-slate-300/g, replacement: 'text-gray-400' },
  
  // Accents (Indigo -> Emerald)
  { regex: /bg-indigo-500/g, replacement: 'bg-[#50C878] text-black shadow-[0_0_15px_rgba(80,200,120,0.5)]' },
  { regex: /bg-indigo-600/g, replacement: 'bg-[#50C878]' },
  { regex: /bg-indigo-50/g, replacement: 'bg-[#50C878]/10' },
  { regex: /text-indigo-600/g, replacement: 'text-[#50C878]' },
  { regex: /text-indigo-500/g, replacement: 'text-[#50C878]' },
  { regex: /text-indigo-400/g, replacement: 'text-[#50C878]' },
  { regex: /hover:text-indigo-600/g, replacement: 'hover:text-[#50C878] hover:drop-shadow-[0_0_8px_rgba(80,200,120,0.8)]' },
  { regex: /hover:text-indigo-500/g, replacement: 'hover:text-[#50C878] hover:drop-shadow-[0_0_8px_rgba(80,200,120,0.8)]' },

  // Buttons specifics
  { regex: /bg-black text-white/g, replacement: 'bg-[#50C878] text-black shadow-[0_0_10px_rgba(80,200,120,0.4)] hover:shadow-[0_0_20px_rgba(80,200,120,0.8)]' },
];

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Keep a backup of the original
      for (const { regex, replacement } of replacements) {
        content = content.replace(regex, replacement);
      }
      
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`Processed: ${fullPath}`);
    }
  }
}

for (const dir of directories) {
  processDirectory(dir);
}
