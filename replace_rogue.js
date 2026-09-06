import fs from 'fs';
import path from 'path';

const directories = ['src/pages', 'src/components'];

const replacements = [
  // Fix the bg-black/50 to bg-zinc-900/50 for contrast against the solid black background
  { regex: /bg-black\/50/g, replacement: 'bg-zinc-900/50' },
  // Fix the Home page indigo text
  { regex: /text-indigo-100/g, replacement: 'text-emerald-100' },
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
