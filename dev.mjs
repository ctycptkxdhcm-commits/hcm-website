// Xem thử trên máy: npm run dev → http://localhost:3000 (tự build lại khi sửa file)
// npm run preview → chỉ phục vụ dist/ có sẵn, không build lại
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

const PORT = Number(process.env.PORT) || 3000;
const OUT = path.resolve('dist');
const watch = !process.argv.includes('--no-watch');
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.xml': 'application/xml', '.txt': 'text/plain', '.ico': 'image/x-icon' };

let building = null;
let queued = false;
function build() {
  if (building) return (queued = true);
  building = spawn(process.execPath, ['build.mjs'], { stdio: 'inherit' });
  building.on('exit', () => {
    building = null;
    if (queued) (queued = false), build();
  });
}

if (watch) {
  build();
  let timer;
  for (const dir of ['src', 'content', 'public']) {
    if (fs.existsSync(dir)) fs.watch(dir, { recursive: true }, () => (clearTimeout(timer), (timer = setTimeout(build, 200))));
  }
}

http
  .createServer((req, res) => {
    let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    let file = path.join(OUT, p);
    if (!file.startsWith(OUT)) return res.writeHead(403).end();
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    if (!fs.existsSync(file)) {
      res.writeHead(404, { 'content-type': TYPES['.html'] });
      return fs.createReadStream(path.join(OUT, '404.html')).on('error', () => res.end('404')).pipe(res);
    }
    res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream', 'cache-control': 'no-cache' });
    fs.createReadStream(file).pipe(res);
  })
  .listen(PORT, () => console.log(`Website: http://localhost:${PORT}`));
