import fs from 'fs';
import path from 'path';

const homePath = path.join('src/pages', 'Home.tsx');
let content = fs.readFileSync(homePath, 'utf8');

content = content.replace(/bg-zinc-950\/80 backdrop-blur-sm\/10 hover:bg-zinc-950\/80 backdrop-blur-sm\/20/g, 'bg-black/20 hover:bg-black/40 backdrop-blur-sm');

fs.writeFileSync(homePath, content, 'utf8');
