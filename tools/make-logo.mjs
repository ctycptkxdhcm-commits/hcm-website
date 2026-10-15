// Tạo logo nền trong suốt (bản sáng cho nền tối, bản tối cho nền sáng) từ assets/logo-source.png
// Chạy lại khi thay logo: node tools/make-logo.mjs
import sharp from 'sharp';
import fs from 'node:fs';

const src = 'assets/logo-source.png';
fs.mkdirSync('public/images', { recursive: true });

const { data, info } = await sharp(src).trim({ threshold: 12 }).greyscale().raw().toBuffer({ resolveWithObject: true });
const { width, height } = info;

async function variant(rgb, out) {
  const px = Buffer.alloc(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    // Nền trắng -> trong suốt; nét xám -> đặc
    const a = Math.max(0, Math.min(255, Math.round((255 - data[i]) * 1.6)));
    px[i * 4] = rgb[0]; px[i * 4 + 1] = rgb[1]; px[i * 4 + 2] = rgb[2]; px[i * 4 + 3] = a;
  }
  await sharp(px, { raw: { width, height, channels: 4 } }).png().toFile(out);
}

await variant([255, 255, 255], 'public/images/logo-light.png');
await variant([38, 38, 38], 'public/images/logo-dark.png');
await sharp(src).resize(64, 64).png().toFile('public/favicon.png');
console.log('Logo:', width, 'x', height);
