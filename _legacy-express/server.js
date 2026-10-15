import 'dotenv/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

import { site } from './src/config/site.js';
import { services } from './src/data/services.js';
import { projects, projectCategories } from './src/data/projects.js';
import { getPosts, getPost } from './src/lib/posts.js';
import { sendContactMail } from './src/lib/mailer.js';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

app.set('view engine', 'ejs');
app.set('views', path.join(ROOT, 'views'));
app.set('trust proxy', 1); // Hostinger/Nginx đứng trước Node
app.disable('x-powered-by');

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https://images.unsplash.com'],
        styleSrc: ["'self'", 'https://fonts.googleapis.com'],
        styleSrcAttr: ["'unsafe-inline'"], // chỉ cho biến CSS --d (độ trễ animation) trong thuộc tính style
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        scriptSrc: ["'self'"],
        frameSrc: ['https://www.google.com'],
        formAction: ["'self'"],
        upgradeInsecureRequests: isProd ? [] : null
      }
    },
    crossOriginEmbedderPolicy: false
  })
);
app.use(compression());
app.use(express.urlencoded({ extended: false, limit: '20kb' }));
app.use(
  express.static(path.join(ROOT, 'public'), {
    maxAge: isProd ? '7d' : 0,
    etag: true
  })
);

// Biến dùng chung cho mọi view
const dateFmt = new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
const img = (id, w = 1200, q = 75) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=${q}`;

app.use((req, res, next) => {
  res.locals.site = site;
  res.locals.services = services;
  res.locals.path = req.path;
  res.locals.year = new Date().getFullYear();
  res.locals.formatDate = (d) => dateFmt.format(d);
  res.locals.img = img;
  res.locals.canonical = site.url.replace(/\/$/, '') + req.path;
  next();
});

const render = (res, view, data = {}) => res.render(view, data);

// ---------- Trang ----------
app.get('/', (req, res) =>
  render(res, 'pages/home', {
    title: `${site.name} — ${site.tagline}`,
    projects: projects.slice(0, 5),
    posts: getPosts().slice(0, 3)
  })
);

app.get('/gioi-thieu', (req, res) =>
  render(res, 'pages/about', { title: `Giới thiệu | ${site.name}`, description: `Về ${site.legalName}: lịch sử, tầm nhìn, giá trị cốt lõi và đội ngũ lãnh đạo.` })
);

app.get('/dich-vu', (req, res) =>
  render(res, 'pages/services', { title: `Dịch vụ | ${site.name}`, description: 'Tổng thầu Design & Build, xây dựng dân dụng, công nghiệp, biệt thự cao cấp và phát triển bất động sản.' })
);

app.get('/dich-vu/:slug', (req, res, next) => {
  const service = services.find((s) => s.slug === req.params.slug);
  if (!service) return next();
  render(res, 'pages/service-detail', { title: `${service.title} | ${site.name}`, description: service.summary, service });
});

app.get('/du-an', (req, res) =>
  render(res, 'pages/projects', { title: `Dự án | ${site.name}`, description: 'Các công trình tiêu biểu HCM Construction đã thi công.', projects, projectCategories })
);

app.get('/du-an/:slug', (req, res, next) => {
  const project = projects.find((p) => p.slug === req.params.slug);
  if (!project) return next();
  const related = projects.filter((p) => p.slug !== project.slug).slice(0, 3);
  render(res, 'pages/project-detail', { title: `${project.title} | ${site.name}`, description: project.summary, project, related, projectCategories });
});

app.get('/tin-tuc', (req, res) =>
  render(res, 'pages/news', { title: `Tin tức | ${site.name}`, description: 'Tin tức doanh nghiệp, kiến thức xây dựng và thị trường bất động sản.', posts: getPosts() })
);

app.get('/tin-tuc/:slug', (req, res, next) => {
  const post = getPost(req.params.slug);
  if (!post) return next();
  const related = getPosts().filter((p) => p.slug !== post.slug).slice(0, 3);
  render(res, 'pages/post', { title: `${post.title} | ${site.name}`, description: post.excerpt, post, related, ogType: 'article' });
});

app.get('/lien-he', (req, res) =>
  render(res, 'pages/contact', {
    title: `Liên hệ | ${site.name}`,
    description: 'Liên hệ HCM Construction để được tư vấn và báo giá miễn phí.',
    values: { service: req.query.dich_vu || '' },
    errors: {},
    status: req.query.sent === '1' ? 'sent' : null
  })
);

// ---------- Form liên hệ ----------
const contactLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 5, standardHeaders: 'draft-7', legacyHeaders: false });

function validateContact(body) {
  const v = {
    name: String(body.name || '').trim().slice(0, 100),
    phone: String(body.phone || '').trim().slice(0, 20),
    email: String(body.email || '').trim().slice(0, 120),
    service: String(body.service || '').trim().slice(0, 100),
    message: String(body.message || '').trim().slice(0, 3000)
  };
  const errors = {};
  if (v.name.length < 2) errors.name = 'Vui lòng nhập họ tên.';
  if (!/^[0-9+\s().-]{8,20}$/.test(v.phone)) errors.phone = 'Số điện thoại chưa hợp lệ (ví dụ 0909 123 456).';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) errors.email = 'Email chưa hợp lệ (ví dụ ten@congty.vn).';
  if (v.message.length < 10) errors.message = 'Vui lòng mô tả nhu cầu (ít nhất 10 ký tự).';
  return { values: v, errors };
}

app.post('/lien-he', contactLimiter, async (req, res) => {
  // Honeypot chống spam bot: người thật không thấy trường này
  if (req.body.website) return res.redirect(303, '/lien-he?sent=1');

  const { values, errors } = validateContact(req.body);
  const base = { title: `Liên hệ | ${site.name}`, description: 'Liên hệ HCM Construction.', values };

  if (Object.keys(errors).length) {
    return res.status(422).render('pages/contact', { ...base, errors, status: 'invalid' });
  }
  try {
    await sendContactMail(values);
    res.redirect(303, '/lien-he?sent=1#form');
  } catch (err) {
    console.error('[contact] Gửi mail thất bại:', err.message);
    res.status(500).render('pages/contact', { ...base, errors: {}, status: 'error' });
  }
});

// ---------- SEO ----------
app.get('/robots.txt', (req, res) => {
  res.type('text/plain').send(`User-agent: *\nAllow: /\nSitemap: ${site.url.replace(/\/$/, '')}/sitemap.xml\n`);
});

app.get('/sitemap.xml', (req, res) => {
  const base = site.url.replace(/\/$/, '');
  const urls = [
    ...site.nav.map((n) => n.href),
    ...services.map((s) => `/dich-vu/${s.slug}`),
    ...projects.map((p) => `/du-an/${p.slug}`),
    ...getPosts().map((p) => `/tin-tuc/${p.slug}`)
  ];
  res.type('application/xml').send(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls
      .map((u) => `<url><loc>${base}${u}</loc></url>`)
      .join('')}</urlset>`
  );
});

app.get('/healthz', (req, res) => res.json({ ok: true }));

// ---------- Lỗi ----------
app.use((req, res) => res.status(404).render('pages/404', { title: `Không tìm thấy trang | ${site.name}` }));

app.use((err, req, res, _next) => {
  console.error(err);
  res.status(500).render('pages/404', { title: `Lỗi máy chủ | ${site.name}`, serverError: true });
});

app.listen(PORT, () => console.log(`HCM website đang chạy tại http://localhost:${PORT}`));
