// Nhập ảnh công trình từ máy tính vào website, tự thu nhỏ để repo GitHub gọn nhẹ.
//
//   npm run import -- "D:\Anh cong trinh"
//       - mỗi thư mục con = 1 dự án (gồm cả ảnh trong thư mục con cấp dưới)
//       - ảnh để lẻ được gom theo tên: "VP7T (1).jpg", "VP7T (2).jpg" → dự án "VP7T"
//   npm run import -- "D:\Anh cong trinh" --manifest danh-sach.json
//       - chỉ nhập ảnh được chọn, kèm thông tin dự án và cách cắt ảnh (xem cuối file)
//
// Ảnh gốc KHÔNG bị sửa. Ảnh được chép vào content/projects/<slug>/ (cạnh dài tối đa 2560px, JPEG 85%)
// và tạo sẵn info.md. Dự án đã có sẽ chỉ được thêm ảnh mới; info.md đã có không bị ghi đè.
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const MAX = 2560;
const IMG = /\.(jpe?g|png|webp|tiff?)$/i;
const args = process.argv.slice(2);
const src = args.find((a) => !a.startsWith('--') && args[args.indexOf(a) - 1] !== '--manifest');
const manifestFile = args.includes('--manifest') ? args[args.indexOf('--manifest') + 1] : null;
if (!src || !fs.existsSync(src)) {
  console.error('Cách dùng: npm run import -- "<thư mục ảnh>" [--manifest danh-sach.json]');
  process.exit(1);
}

const slugify = (s) =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[đĐ]/g, 'd').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const byName = (a, b) => a.localeCompare(b, 'vi', { numeric: true });
const walk = (d) =>
  fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : IMG.test(e.name) ? [path.join(d, e.name)] : [])).sort(byName);
const pickEven = (list, n) => (!n || list.length <= n ? list : Array.from({ length: n }, (_, i) => list[Math.floor((i * list.length) / n)]));

const guessCategory = (name) => {
  const n = slugify(name);
  if (/biet-thu|villa|^bt-/.test(n)) return 'biet-thu';
  if (/nha-pho|nha-o|nha-vuon|lien-ke|shophouse/.test(n)) return 'nha-pho';
  if (/can-ho|chung-cu|cc-mini|nha-tro|penthouse/.test(n)) return 'can-ho';
  if (/van-phong|office|tru-so|^vp/.test(n)) return 'van-phong';
  if (/khach-san|hotel|^ks/.test(n)) return 'khach-san';
  if (/bchqs|quan-su|bdbp|bien-phong|lu-doan|truong-ban|doanh-trai/.test(n)) return 'quoc-phong';
  if (/bao-tang|truong|benh-vien|nha-da-nang|ubnd/.test(n)) return 'cong-cong';
  return 'khac';
};

// Tìm vùng ảnh thật bên trong khung viền đồng màu (trắng/đen) — bỏ khung, chú thích, logo nằm trên khung
async function detectFrame(file) {
  const W = 600;
  const { data, info } = await sharp(file).rotate().resize({ width: W }).greyscale().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const at = (x, y) => data[y * w + x];
  const border = Math.round((at(2, 2) + at(w - 3, 2) + at(2, h - 3) + at(w - 3, h - 3)) / 4);
  const isBorder = (v) => Math.abs(v - border) <= 14;
  const run = (n, isContent) => {
    let best = [0, n - 1, 0], start = -1, gap = 0;
    for (let i = 0; i <= n; i++) {
      const c = i < n && isContent(i);
      if (c) { if (start < 0) start = i; gap = 0; }
      else if (start >= 0 && i < n && ++gap <= 2) continue;
      else if (start >= 0) { const end = i - 1 - gap; if (end - start > best[2]) best = [start, end, end - start]; start = -1; gap = 0; }
    }
    return best;
  };
  const rowContent = (y) => { let n = 0; for (let x = 0; x < w; x++) if (!isBorder(at(x, y))) n++; return n / w > 0.25; };
  const [y0, y1] = run(h, rowContent);
  const colContent = (x) => { let n = 0; for (let y = y0; y <= y1; y++) if (!isBorder(at(x, y))) n++; return n / (y1 - y0 + 1) > 0.25; };
  const [x0, x1] = run(w, colContent);
  const pad = 3; // ăn vào thêm vài px để không còn viền
  return { l: (x0 + pad) / w, t: (y0 + pad) / h, r: (w - 1 - x1 + pad) / w, b: (h - 1 - y1 + pad) / h };
}

async function importImage(file, target, opt = {}) {
  let img = sharp(file).rotate();
  if (opt.frame || opt.crop) {
    const meta = await sharp(file).rotate().metadata();
    const [W, H] = (meta.orientation || 1) >= 5 ? [meta.height, meta.width] : [meta.width, meta.height];
    const f = opt.frame ? await detectFrame(file) : { l: 0, t: 0, r: 0, b: 0 };
    const c = { l: 0, t: 0, r: 0, b: 0, ...(opt.crop || {}) };
    const left = Math.round(W * f.l), top = Math.round(H * f.t);
    const innerW = W - left - Math.round(W * f.r), innerH = H - top - Math.round(H * f.b);
    const cl = Math.round(innerW * c.l), ct = Math.round(innerH * c.t);
    img = sharp(await img.toBuffer()).extract({
      left: left + cl,
      top: top + ct,
      width: innerW - cl - Math.round(innerW * c.r),
      height: innerH - ct - Math.round(innerH * c.b)
    });
  }
  await img.resize({ width: MAX, height: MAX, fit: 'inside', withoutEnlargement: true }).flatten({ background: '#ffffff' }).jpeg({ quality: 85, mozjpeg: true }).toFile(target);
}

const yaml = (v) => (typeof v === 'string' ? JSON.stringify(v) : v);
function writeInfo(dir, p) {
  const file = path.join(dir, 'info.md');
  if (fs.existsSync(file)) return;
  const fields = { title: '', category: 'khac', location: '', year: '', area: '', floors: '', style: '', service: '', summary: '', featured: false, order: 100, ...p };
  const notes = { category: 'biet-thu | nha-pho | can-ho | van-phong | khach-san | cong-cong | quoc-phong | khac', location: 'vd: TP. Vinh, Nghệ An', year: 'vd: 2024', area: 'vd: 320 m²', floors: 'vd: 3 tầng', featured: 'true = hiện ở slider trang chủ', order: 'số nhỏ hiện trước' };
  const lines = ['title', 'category', 'location', 'year', 'area', 'floors', 'style', 'service', 'summary', 'featured', 'order'].map(
    (k) => `${k}: ${fields[k] === '' ? '""' : yaml(fields[k])}${notes[k] ? `   # ${notes[k]}` : ''}`
  );
  fs.writeFileSync(file, `---\n${lines.join('\n')}\n---\n\n${p.body || ''}\n`);
}

// ---- Xác định danh sách dự án ----
let projects;
if (manifestFile) {
  projects = JSON.parse(fs.readFileSync(manifestFile, 'utf8')).map((p) => {
    let files = p.files
      ? p.files.map((f) => (typeof f === 'string' ? { f } : f))
      : pickEven(walk(path.join(src, p.dir)).map((f) => path.relative(src, f)), p.limit).map((f) => ({ f }));
    return { ...p, files: files.map((x) => ({ ...x, f: path.join(src, x.f) })) };
  });
} else {
  const groupKey = (f) => path.parse(f).name.replace(/\s*\(\d+\)$/, '').replace(/[-_ ]?\d+$/, '').replace(/[-_ ']+$/, '') || path.parse(f).name;
  const loose = {};
  for (const f of fs.readdirSync(src)) if (IMG.test(f) && fs.statSync(path.join(src, f)).isFile()) (loose[groupKey(f)] ||= []).push(path.join(src, f));
  const dirs = fs.readdirSync(src, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => [e.name, walk(path.join(src, e.name))]);
  projects = [...dirs, ...Object.entries(loose).map(([k, v]) => [k, v.sort(byName)])]
    .filter(([, files]) => files.length)
    .map(([title, files]) => ({ title, category: guessCategory(title), files: files.map((f) => ({ f })) }));
}

let total = 0;
for (const p of projects) {
  const out = path.join('content/projects', p.slug || slugify(p.title));
  fs.mkdirSync(out, { recursive: true });
  let added = 0;
  for (const [i, x] of p.files.entries()) {
    const target = path.join(out, `${String(i + 1).padStart(2, '0')}-${slugify(path.parse(x.f).name) || 'anh'}.jpg`);
    if (fs.existsSync(target)) continue;
    try {
      await importImage(x.f, target, x);
      added++;
    } catch (e) {
      console.warn(`  ! Không đọc được ${x.f}: ${e.message}`);
    }
  }
  const { files, dir, limit, slug, ...info } = p;
  writeInfo(out, info);
  total += added;
  console.log(`✓ ${p.title}: +${added} ảnh → ${out}`);
}
console.log(`\nXong: ${projects.length} dự án, ${total} ảnh mới. Mở info.md trong từng thư mục để điền/sửa thông tin.`);

/* Định dạng file --manifest (JSON):
[
  { "slug": "biet-thu-anh-ba", "title": "Biệt thự anh Bá", "category": "biet-thu", "featured": true, "order": 1,
    "files": ["A BÁ/01.jpg", { "f": "ACML (1).jpg", "frame": true, "crop": { "t": 0.12 } }] },
  { "slug": "truong-ban", "title": "Trường bắn", "category": "quoc-phong", "dir": "TRƯỜNG BẮN", "limit": 12 }
]
  frame: true  → tự bỏ khung viền đồng màu quanh ảnh
  crop         → cắt thêm theo tỷ lệ mỗi cạnh (t/b/l/r), dùng để bỏ logo/watermark sát mép
*/
