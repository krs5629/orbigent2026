import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'public', 'wave-animation.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Update gradient_2 (the colorful one)
if (data.slots && data.slots.gradient_2) {
  data.slots.gradient_2.p.k.k = [
    0.25, 0.117, 0.000, 0.231,
    0.375, 0.290, 0.000, 0.878,
    0.500, 0.556, 0.176, 0.886,
    0.625, 0.780, 0.141, 0.694,
    0.750, 0.941, 0.184, 0.760,
    0.875, 0.600, 0.200, 1.000,
    1.000, 0.000, 0.900, 1.000
  ];
}

fs.writeFileSync(filePath, JSON.stringify(data), 'utf8');
console.log("Lottie updated!");
