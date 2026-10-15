# HCM Construction — Website doanh nghiệp

Website giới thiệu công ty xây dựng / bất động sản, viết bằng **Node.js + Express + EJS**, không cần database.

- Trang: Trang chủ · Giới thiệu · Dịch vụ (+ chi tiết) · Dự án (+ lọc, chi tiết) · Tin tức (Markdown) · Liên hệ (gửi email SMTP)
- SEO: meta/OG, canonical, JSON-LD `GeneralContractor`, `sitemap.xml`, `robots.txt`
- Bảo mật: Helmet CSP, rate-limit form, honeypot chống spam, validate cả client & server
- Hiệu năng: nén gzip, cache tĩnh 7 ngày, ảnh lazy-load, không dùng framework JS phía client
- Accessibility: skip link, focus ring, aria cho menu/form, tôn trọng `prefers-reduced-motion`

## Chạy trên máy

```bash
npm install
cp .env.example .env   # điền SMTP nếu muốn thử gửi mail
npm run dev            # http://localhost:3000 (tự reload khi sửa code)
```

Khi chưa cấu hình SMTP, yêu cầu liên hệ được in ra console thay vì gửi mail.

## Chỉnh nội dung

| Muốn sửa | File |
|---|---|
| Tên công ty, hotline, địa chỉ, số liệu thống kê, menu | `src/config/site.js` |
| Dịch vụ | `src/data/services.js` |
| Dự án | `src/data/projects.js` |
| Thêm bài tin tức | tạo file `.md` trong `content/posts/` (xem bài mẫu để biết front-matter) |
| Màu, font, khoảng cách | `public/css/main.css` (token ở `:root`) — quy chuẩn tại `design-system/hcm-construction/MASTER.md` |

> ⚠️ Số liệu, dự án, khách hàng, ban lãnh đạo, địa chỉ hiện là **dữ liệu mẫu**. Ảnh đang lấy từ Unsplash —
> nên thay bằng ảnh công trình thật (đặt vào `public/images/` và đổi đường dẫn).

## Cấu trúc

```
server.js              # Express app, routes, form liên hệ, sitemap
src/config/site.js     # thông tin công ty
src/data/              # dịch vụ, dự án
src/lib/               # đọc bài Markdown, gửi mail
views/partials|pages   # template EJS
public/                # CSS, JS, favicon
content/posts/         # bài viết Markdown
```

Deploy: xem [DEPLOY.md](DEPLOY.md).
