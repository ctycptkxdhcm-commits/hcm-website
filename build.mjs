// Build website tĩnh vào thư mục dist/ — chạy: npm run build
// Biến môi trường: SITE_URL (địa chỉ web), BASE_PATH (vd "/hcm-website" khi chạy dưới thư mục con của GitHub Pages)
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import ejs from 'ejs';
import { site } from './src/site.js';
import { loadProjects, categories } from './src/projects.js';

const OUT = 'dist';
const TPL = 'src/templates';
const BASE = (process.env.BASE_PATH || '').replace(/\/$/, '');
const SITE_URL = site.url.replace(/\/$/, '');

const t0 = Date.now();
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

// 1. File tĩnh
fs.cpSync('public', OUT, { recursive: true });
fs.cpSync('src/assets', path.join(OUT, 'assets'), { recursive: true });
const version = crypto
  .createHash('md5')
  .update(Buffer.concat(fs.readdirSync('src/assets').map((f) => fs.readFileSync(path.join('src/assets', f)))))
  .digest('hex')
  .slice(0, 8);

// 2. Dự án + ảnh
const projects = await loadProjects({ outDir: path.join(OUT, 'images/du-an'), urlBase: `${BASE}/images/du-an` });
const featured = projects.filter((p) => p.featured);
const usedCategories = categories.filter((c) => c.key === 'all' || projects.some((p) => p.category === c.key));

// 3. Render trang
const u = (p = '/') => (/^https?:/.test(p) ? p : `${BASE}${p}`);
const common = { site, u, version, year: new Date().getFullYear(), categories: usedCategories, projectCount: projects.length };
const pages = [];

function render(view, route, data = {}) {
  const html = ejs.render(
    fs.readFileSync(path.join(TPL, 'pages', `${view}.ejs`), 'utf8'),
    { ...common, route, canonical: SITE_URL + route, ...data },
    { filename: path.join(TPL, 'pages', `${view}.ejs`), rmWhitespace: false }
  );
  const file = route.endsWith('/') ? path.join(OUT, route, 'index.html') : path.join(OUT, route);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
  if (!route.endsWith('.html')) pages.push(route);
}

render('home', '/', { projects, featured: featured.length ? featured : projects.slice(0, 6) });
render('about', '/gioi-thieu/', { title: 'Giới thiệu', projects });
render('services', '/dich-vu/', { title: 'Dịch vụ', projects });
render('projects', '/du-an/', { title: 'Dự án', projects });
projects.forEach((project, i) => {
  const related = projects.filter((p) => p.slug !== project.slug && p.category === project.category).slice(0, 3);
  render('project', `/du-an/${project.slug}/`, {
    title: project.title,
    description: project.summary || `${project.categoryLabel} ${project.location} — ${site.legalName}`,
    ogImage: project.cover.large,
    project,
    prev: projects[(i - 1 + projects.length) % projects.length],
    next: projects[(i + 1) % projects.length],
    related: related.length ? related : projects.filter((p) => p.slug !== project.slug).slice(0, 3)
  });
});
render('contact', '/lien-he/', { title: 'Liên hệ' });
render('404', '/404.html', { title: 'Không tìm thấy trang' });

// 4. SEO
fs.writeFileSync(
  path.join(OUT, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages
    .map((p) => `  <url><loc>${SITE_URL}${p}</loc></url>`)
    .join('\n')}\n</urlset>\n`
);
fs.writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${SITE_URL}/sitemap.xml\n`);
fs.writeFileSync(path.join(OUT, '.nojekyll'), '');

console.log(`✓ Build xong: ${pages.length} trang, ${projects.length} dự án (${Date.now() - t0} ms) → ${OUT}/`);
