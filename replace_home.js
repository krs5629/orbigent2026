import fs from 'fs';
import path from 'path';

const homePath = path.join('src/pages', 'Home.tsx');
let content = fs.readFileSync(homePath, 'utf8');

content = content.replace(/bg-zinc-950\/80 backdrop-blur-sm\/10/g, 'bg-black/20 backdrop-blur-sm');
content = content.replace(/bg-indigo-400\/30/g, 'bg-black/20');
content = content.replace(/bg-indigo-100 text-\[#50C878\]/g, 'bg-zinc-900 text-[#50C878]');
content = content.replace(/bg-teal-100 text-teal-600/g, 'bg-zinc-900 text-[#50C878]');

fs.writeFileSync(homePath, content, 'utf8');
