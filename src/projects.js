// Đọc dự án từ content/projects/<thư-mục>/ : info.md (thông tin) + ảnh (.jpg/.jpeg/.png/.webp)
// Ảnh được nén sang WebP 2 kích thước, cache tại .cache/ để lần build sau nhanh hơn.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import matter from 'gray-matter';
import { marked } from 'marked';
import sharp from 'sharp';

export const categories = [
  { key: 'all', label: 'Tất cả' },
  { key: 'biet-thu', label: 'Biệt thự' },
  { key: 'nha-pho', label: 'Nhà phố' },
  { key: 'can-ho', label: 'Chung cư & căn hộ' },
  { key: 'van-phong', label: 'Văn phòng & thương mại' },
  { key: 'khach-san', label: 'Khách sạn & dịch vụ' },
  { key: 'cong-cong', label: 'Công trình công cộng' },
  { key: 'quoc-phong', label: 'Quốc phòng' },
  { key: 'khac', label: 'Công trình khác' }
];

const IMG_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const SIZES = [800, 1600, 2400];
const CACHE = '.cache/images';

const slugify = (s) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

async function processImage(file, outDir, urlBase) {
  const stat = fs.statSync(file);
  const key = crypto.createHash('md5').update(`${file}|${stat.size}|${stat.mtimeMs}`).digest('hex').slice(0, 12);
  const base = slugify(path.parse(file).name) || 'anh';
  const metaFile = path.join(CACHE, `${key}.json`);
  fs.mkdirSync(CACHE, { recursive: true });

  let meta;
  if (fs.existsSync(metaFile)) {
    meta = JSON.parse(fs.readFileSync(metaFile, 'utf8'));
  } else {
    const img = sharp(file).rotate(); // xoay theo EXIF của điện thoại/máy ảnh
    const { width, height } = await img.metadata().then((m) => ((m.orientation || 1) >= 5 ? { width: m.height, height: m.width } : m));
    meta = { width, height, files: [] };
    for (const w of SIZES) {
      const target = Math.min(w, width);
      const cached = path.join(CACHE, `${key}-${w}.webp`);
      await sharp(file).rotate().resize({ width: target, withoutEnlargement: true }).webp({ quality: 78 }).toFile(cached);
      meta.files.push({ w, cached });
    }
    fs.writeFileSync(metaFile, JSON.stringify(meta));
  }

  fs.mkdirSync(outDir, { recursive: true });
  const srcset = [];
  for (const { w, cached } of meta.files) {
    const real = Math.min(w, meta.width);
    if (srcset.some((s) => s.w === real)) continue; // ảnh nhỏ: không lặp kích thước
    const name = `${base}-${w}.webp`;
    fs.copyFileSync(cached, path.join(outDir, name));
    srcset.push({ w: real, url: `${urlBase}/${name}` });
  }
  return {
    src: srcset[0].url,
    large: (srcset[1] || srcset[0]).url, // 1600px cho lightbox
    hero: srcset[srcset.length - 1].url, // lớn nhất cho ảnh tràn màn hình
    srcset: srcset.map((s) => `${s.url} ${s.w}w`).join(', '),
    width: meta.width,
    height: meta.height
  };
}

// Ảnh minh họa từ Unsplash cho dự án mẫu (demo: true) — sẽ bị thay bằng ảnh thật
const remoteImage = (url) => {
  const u = (w) => `${url}${url.includes('?') ? '&' : '?'}auto=format&fit=crop&w=${w}&q=72`;
  return { src: u(800), large: u(1600), hero: u(2400), srcset: `${u(800)} 800w, ${u(1600)} 1600w, ${u(2400)} 2400w`, width: 1600, height: 1067, remote: true };
};

export async function loadProjects({ root = 'content/projects', outDir, urlBase }) {
  if (!fs.existsSync(root)) return [];
  const dirs = fs.readdirSync(root, { withFileTypes: true }).filter((d) => d.isDirectory() && !d.name.startsWith('_'));
  const projects = [];

  for (const d of dirs) {
    const dir = path.join(root, d.name);
    const infoFile = path.join(dir, 'info.md');
    const { data, content } = fs.existsSync(infoFile) ? matter(fs.readFileSync(infoFile, 'utf8')) : { data: {}, content: '' };

    const title = data.title || d.name;
    const slug = data.slug || slugify(d.name);
    const files = fs
      .readdirSync(dir)
      .filter((f) => IMG_EXT.has(path.extname(f).toLowerCase()))
      .sort((a, b) => a.localeCompare(b, 'vi', { numeric: true }));

    let images = [];
    if (files.length) {
      if (data.cover && files.includes(data.cover)) files.unshift(...files.splice(files.indexOf(data.cover), 1));
      for (const f of files) images.push(await processImage(path.join(dir, f), path.join(outDir, slug), `${urlBase}/${slug}`));
    } else if (Array.isArray(data.images)) {
      images = data.images.map(remoteImage);
    }
    if (!images.length) {
      console.warn(`  ! Bỏ qua "${d.name}": chưa có ảnh`);
      continue;
    }

    const category = categories.some((c) => c.key === data.category) ? data.category : 'khac';
    projects.push({
      slug,
      title,
      category,
      categoryLabel: categories.find((c) => c.key === category).label,
      location: data.location || '',
      year: data.year || '',
      area: data.area || '',
      floors: data.floors || '',
      style: data.style || '',
      service: data.service || '',
      summary: data.summary || '',
      featured: Boolean(data.featured),
      order: Number(data.order ?? 999),
      demo: Boolean(data.demo),
      body: content.trim() ? marked.parse(content) : '',
      images,
      cover: images[0]
    });
  }

  return projects.sort((a, b) => a.order - b.order || String(b.year).localeCompare(String(a.year)) || a.title.localeCompare(b.title, 'vi'));
}
