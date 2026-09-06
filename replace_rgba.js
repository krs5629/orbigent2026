import fs from 'fs';
import path from 'path';

const directories = ['src'];
const oldColor = 'rgba(181,245,78,';
const newColor = 'rgba(192,132,252,';

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.css') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      if (content.includes(oldColor)) {
        // Just global replace the exact color string, matching case-insensitively just in case
        const regex = new RegExp(oldColor.replace(/\(/g, '\\(').replace(/\)/g, '\\)'), 'gi');
        content = content.replace(regex, newColor);
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated rgba in: ${fullPath}`);
      }
    }
  }
}

for (const dir of directories) {
  processDirectory(dir);
}
