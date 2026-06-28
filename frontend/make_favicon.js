/**
 * Buat favicon bulat dari foto-my.jpg menggunakan Canvas API (Node.js)
 * Jalankan: node make_favicon.js
 */
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');

const INPUT  = path.join(__dirname, 'public', 'images', 'foto-my.jpg');
const OUTPUT = path.join(__dirname, 'public', 'images', 'favicon-circle.png');

async function main() {
  console.log('Loading image...');
  const img = await loadImage(INPUT);
  console.log(`Original size: ${img.width} x ${img.height}`);

  // Area crop fokus wajah (dari foto 954x1270)
  const cropX = 230, cropY = 200, cropW = 510, cropH = 480;
  const SIZE = 256;

  const canvas = createCanvas(SIZE, SIZE);
  const ctx = canvas.getContext('2d');

  // Gambar lingkaran sebagai clip
  ctx.beginPath();
  ctx.arc(SIZE / 2, SIZE / 2, SIZE / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();

  // Gambar area wajah crop ke dalam lingkaran
  ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, SIZE, SIZE);

  // Simpan sebagai PNG
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(OUTPUT, buffer);
  console.log(`[OK] Favicon bulat disimpan: ${OUTPUT}`);
}

main().catch(err => {
  console.error('[ERROR]', err.message);
  process.exit(1);
});
