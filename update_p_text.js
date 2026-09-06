import fs from 'fs';
import path from 'path';

const homePath = path.join('src/pages', 'Home.tsx');
let content = fs.readFileSync(homePath, 'utf8');
content = content.replace(/<p className="text-\[\#B5F54E\] max-w-sm">/, '<p className="text-black/80 max-w-sm">');
fs.writeFileSync(homePath, content, 'utf8');
