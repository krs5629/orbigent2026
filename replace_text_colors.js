import fs from 'fs';
import path from 'path';

const directories = ['src/pages', 'src/components'];

const replacements = [
  // Convert gray body text to white
  { regex: /text-gray-100/g, replacement: 'text-white' },
  { regex: /text-gray-300/g, replacement: 'text-white' },
  { regex: /text-gray-400/g, replacement: 'text-white' },
  
  // Convert secondary/label text to dark emerald green
  { regex: /text-gray-500/g, replacement: 'text-[#059669]' },
  
  // Convert bright emerald text to dark emerald green
  { regex: /text-\[\#50C878\]/g, replacement: 'text-[#059669]' },
  
  // Convert the home page subtitle
  { regex: /text-emerald-100/g, replacement: 'text-[#059669]' },
];

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      let changed = false;
      for (const { regex, replacement } of replacements) {
        if (regex.test(content)) {
          content = content.replace(regex, replacement);
          changed = true;
        }
      }
      
      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Processed: ${fullPath}`);
      }
    }
  }
}

for (const dir of directories) {
  processDirectory(dir);
}
