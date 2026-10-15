# Đưa website lên mạng

## 1. Miễn phí với GitHub Pages (khuyên dùng lúc đầu)

Địa chỉ web sẽ có dạng `https://<tai-khoan>.github.io/<ten-repo>/`. Mỗi lần push code, GitHub tự build và cập nhật (~1–2 phút).

1. Đăng nhập https://github.com (dùng **Continue with Google**).
2. Vào https://github.com/new → tên repo, ví dụ `hcm-website` → chọn **Public** → **Create repository**.
   *(GitHub Pages miễn phí yêu cầu repo Public. Code web tĩnh không chứa mật khẩu nên public là an toàn.)*
3. Trong thư mục dự án:

   ```bash
   git remote add origin https://github.com/<tai-khoan>/hcm-website.git
   git push -u origin main
   ```

   Lần đầu push, Windows sẽ mở cửa sổ đăng nhập GitHub — chọn đăng nhập bằng trình duyệt.
4. Trên GitHub: repo → **Settings** → **Pages** → mục *Build and deployment* → **Source: GitHub Actions**.
5. Vào tab **Actions** xem tiến trình. Khi có dấu ✓ xanh, mở `https://<tai-khoan>.github.io/hcm-website/`.

### Gắn tên miền riêng (khi đã mua)
1. Repo → **Settings → Pages → Custom domain** → nhập `hcmdesign.vn` (ví dụ) → Save → tick **Enforce HTTPS**.
2. Tại nơi mua tên miền, thêm bản ghi DNS:
   - `A` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `CNAME` `www` → `<tai-khoan>.github.io`
3. Vào **Actions → Deploy GitHub Pages → Run workflow** để build lại với tên miền mới.

### Google Analytics
Repo → **Settings → Secrets and variables → Actions → Variables** → thêm `GA_ID` = `G-XXXXXXXXXX` → chạy lại workflow.

---

## 2. Hostinger (khi muốn dùng hosting trả phí + email tên miền)

Website là trang tĩnh nên **mọi gói Hostinger** (kể cả Single/Premium rẻ nhất) đều chạy được, không cần gói Node.js.

**Cách A — Git trên hPanel (tự cập nhật):**
1. Trên máy: `SITE_URL=https://ten-mien.vn npm run build`
2. Đẩy thư mục `dist/` lên một nhánh riêng, ví dụ `deploy`, rồi hPanel → **Websites → Advanced → Git** → kết nối repo, nhánh `deploy`, thư mục `public_html`.

**Cách B — tải file (đơn giản nhất):**
1. `SITE_URL=https://ten-mien.vn npm run build`
2. hPanel → **File Manager** → `public_html` → tải toàn bộ nội dung trong `dist/` lên (nén zip rồi giải nén cho nhanh).

> Trên Windows PowerShell, đặt biến bằng: `$env:SITE_URL="https://ten-mien.vn"; npm run build`

---

## 3. Kiểm tra sau khi lên mạng
- Mở web trên điện thoại, thử menu, lọc dự án, phóng to ảnh.
- Gửi link qua Zalo/Facebook để xem ảnh xem trước.
- Khai báo `https://<địa-chỉ-web>/sitemap.xml` trong Google Search Console.
