# Hướng dẫn đưa website lên GitHub và Hostinger

## 1. Đẩy code lên GitHub

1. Vào https://github.com/new → tạo repository (ví dụ `hcm-website`), chọn **Private**, **không** tick "Add README".
2. Trong thư mục dự án chạy:

```bash
git remote add origin https://github.com/<tai-khoan>/hcm-website.git
git push -u origin main
```

File `.env` (mật khẩu SMTP) đã nằm trong `.gitignore` nên **không** bị đẩy lên GitHub.

---

## 2A. Hostinger Business / Cloud Hosting (khuyên dùng — có mục Node.js)

Các gói **Business Web Hosting** và **Cloud Startup/Professional/Enterprise** hỗ trợ ứng dụng Node.js trực tiếp trong hPanel.
(Gói Single/Premium **không** chạy được Node.js.)

1. hPanel → **Websites** → **Add website** → chọn **Node.js Apps** (hoặc *Websites → Node.js → Create*).
2. Chọn **Import Git repository** → kết nối GitHub → chọn repo `hcm-website`, nhánh `main`.
3. Cấu hình build:
   - **Node version:** 20.x hoặc 22.x
   - **Install command:** `npm install`
   - **Build command:** *(để trống)*
   - **Start command / Entry file:** `npm start` (hoặc `server.js`)
4. **Environment variables** — thêm các biến trong `.env.example`:
   `NODE_ENV=production`, `SITE_URL=https://ten-mien-cua-ban.vn`, `SMTP_HOST=smtp.hostinger.com`, `SMTP_PORT=465`, `SMTP_USER`, `SMTP_PASS`, `CONTACT_TO`.
   *Không đặt `PORT` — Hostinger tự cấp.*
5. Bấm **Deploy**. Mỗi lần `git push` lên `main`, Hostinger sẽ tự deploy lại (có thể bật/tắt trong cài đặt app).
6. Gắn tên miền → bật **SSL** miễn phí trong hPanel → *Security → SSL*.

> Giao diện hPanel thay đổi theo thời gian; nếu tên mục khác, tìm "Node.js" trong ô tìm kiếm của hPanel.

### Tạo email SMTP cho form liên hệ
hPanel → **Emails** → tạo hộp thư `info@ten-mien.vn` → dùng chính địa chỉ & mật khẩu đó cho `SMTP_USER` / `SMTP_PASS`.

---

## 2B. Hostinger VPS (toàn quyền, Ubuntu)

```bash
# Cài Node.js 22 + PM2 + Nginx
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs nginx git
sudo npm i -g pm2

# Lấy code
cd /var/www && sudo git clone https://github.com/<tai-khoan>/hcm-website.git
cd hcm-website && npm ci --omit=dev
cp .env.example .env && nano .env      # điền SITE_URL, SMTP_...

# Chạy nền + tự khởi động lại khi reboot
pm2 start ecosystem.config.cjs && pm2 save && pm2 startup
```

Nginx `/etc/nginx/sites-available/hcm`:

```nginx
server {
  server_name ten-mien-cua-ban.vn www.ten-mien-cua-ban.vn;
  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/hcm /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo apt install -y certbot python3-certbot-nginx && sudo certbot --nginx   # SSL miễn phí
```

Cập nhật code sau này:

```bash
cd /var/www/hcm-website && git pull && npm ci --omit=dev && pm2 reload hcm-website
```

---

## 3. Kiểm tra sau khi deploy

- `https://ten-mien/healthz` trả về `{"ok":true}`
- Gửi thử form Liên hệ → kiểm tra hộp thư `CONTACT_TO`
- Khai báo `https://ten-mien/sitemap.xml` trong Google Search Console
