// Tin tức đọc từ file Markdown trong content/posts — thêm bài mới chỉ cần tạo file .md.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { marked } from 'marked';

const POSTS_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '../../content/posts');
let cache = null;

function readingTime(text) {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}

function load() {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((file) => {
      const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8');
      const { data, content } = matter(raw);
      return {
        slug: data.slug || file.replace(/\.md$/, ''),
        title: data.title,
        excerpt: data.excerpt || '',
        category: data.category || 'Tin tức',
        image: data.image,
        author: data.author || 'HCM Construction',
        date: new Date(data.date),
        readingTime: readingTime(content),
        html: marked.parse(content)
      };
    })
    .filter((p) => p.title && !Number.isNaN(p.date.getTime()))
    .sort((a, b) => b.date - a.date);
}

export function getPosts() {
  // Ở môi trường dev luôn đọc lại để thấy bài mới ngay
  if (!cache || process.env.NODE_ENV !== 'production') cache = load();
  return cache;
}

export function getPost(slug) {
  return getPosts().find((p) => p.slug === slug);
}
