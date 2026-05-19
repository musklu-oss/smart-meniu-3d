import { createCanvas, loadImage } from 'canvas';
import { Compiler } from 'mind-ar/src/image-target/compiler-base.js';
import fs from 'fs';
import path from 'path';

class NodeCompiler extends Compiler {
  createProcessCanvas(img) {
    return createCanvas(img.width, img.height);
  }
  compileTrack({ progressCallback, targetImages, basePercent }) {
    return this._compileOneTrack({ progressCallback, targetImages, basePercent });
  }
}

const imagePath = path.resolve('assets/images/target.jpg');
const outputPath = path.resolve('assets/targets/targets.mind');

const img = await loadImage(imagePath);
const canvas = createCanvas(img.width, img.height);
const ctx = canvas.getContext('2d');
ctx.drawImage(img, 0, 0);

const compiler = new NodeCompiler();
await compiler.compileImageTargets([canvas], (progress) => {
  process.stdout.write(`\rCompiling: ${progress.toFixed(1)}%`);
});

const buffer = await compiler.exportData();
fs.mkdirSync('assets/targets', { recursive: true });
fs.writeFileSync(outputPath, Buffer.from(buffer));
console.log('\nDone: targets.mind saved');
