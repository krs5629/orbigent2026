import fs from 'fs';
import path from 'path';

const directories = ['src/pages', 'src/components'];

const replacements = [
  { regex: /#50C878/gi, replacement: '#B5F54E' },
  { regex: /#059669/gi, replacement: '#B5F54E' },
  { regex: /80,200,120/g, replacement: '181,245,78' },
  { regex: /80, 200, 120/g, replacement: '181, 245, 78' },
];

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.css')) {
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
