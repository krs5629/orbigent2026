import fs from 'fs';
import path from 'path';

const directories = ['src/pages', 'src/components'];

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      let changed = false;
      
      // Look for bg-[#B5F54E] where it isn't transparent (doesn't have /10 or /20)
      const newContent = content.replace(/className="([^"]*bg-\[\#B5F54E\](?!\/\d+)[^"]*)"/g, (match, classNames) => {
        if (!classNames.includes('text-black')) {
          return `className="${classNames.replace(/text-white/g, '').replace(/text-gray-\d+/g, '').replace(/text-\[\#B5F54E\]/g, '')} text-black"`;
        }
        return match;
      });
      
      if (newContent !== content) {
        fs.writeFileSync(fullPath, newContent, 'utf8');
        console.log(`Processed: ${fullPath}`);
      }
    }
  }
}

for (const dir of directories) {
  processDirectory(dir);
}
