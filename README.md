# Website HCM — Công ty CP Tư vấn Thiết kế và Xây dựng HCM

Website giới thiệu công trình thiết kế kiến trúc, nội thất, cảnh quan và xây dựng trọn gói tại Nghệ An.
Build bằng **Node.js** ra **trang tĩnh** (HTML/CSS/JS), host **miễn phí** trên GitHub Pages; sau này có thể chuyển sang Hostinger (gói nào cũng chạy được).

- Trang: Trang chủ · Giới thiệu · Dịch vụ · Dự án (lọc theo loại) · Chi tiết dự án (thư viện ảnh, phóng to) · Liên hệ
- Ảnh tự nén sang WebP 3 kích thước, tải lười, đúng tỷ lệ → web nhanh trên điện thoại
- SEO: title/description từng trang, Open Graph (ảnh đẹp khi gửi link qua Zalo/Facebook), JSON-LD, sitemap.xml
- Responsive 375px → 1920px, hỗ trợ bàn phím, giảm chuyển động khi người dùng bật `reduced motion`

## Chạy trên máy

```bash
npm install
npm run dev        # http://localhost:3000 — tự build lại khi sửa file
```

## Thêm / cập nhật dự án

Mỗi dự án là **một thư mục** trong `content/projects/`, gồm ảnh + file `info.md`.

**Cách nhanh nhất** — nhập cả thư mục ảnh từ máy tính (ảnh gốc không bị sửa, ảnh được thu nhỏ còn ~2560px):

```bash
npm run import -- "D:\Anh cong trinh"
```

- Nếu `D:\Anh cong trinh` chứa nhiều thư mục con → mỗi thư mục con thành 1 dự án (tên thư mục = tên dự án).
- Sau khi nhập, mở `content/projects/<du-an>/info.md` để điền: loại, địa điểm, diện tích, năm, phong cách…

Các trường trong `info.md`:

| Trường | Ý nghĩa |
|---|---|
| `title` | Tên dự án |
| `category` | `biet-thu` · `nha-pho` · `can-ho` · `van-phong` · `khach-san` · `cong-cong` · `quoc-phong` · `khac` |
| `location`, `year`, `area`, `floors`, `style`, `service` | Thông tin hiển thị ở trang chi tiết (bỏ trống sẽ ẩn) |
| `summary` | 1 câu giới thiệu |
| `featured: true` | Hiện trên slider trang chủ (nên chọn 4–5 dự án đẹp nhất) |
| `order` | Thứ tự hiển thị, số nhỏ lên trước |
| `cover` | Tên file ảnh đại diện (mặc định ảnh đầu tiên theo tên) |

Phần sau dấu `---` thứ hai là mô tả dài (viết thường, hỗ trợ **in đậm**, xuống dòng).

> `content/projects/_mau-du-an/` chứa 6 dự án mẫu (ảnh minh họa) — thư mục bắt đầu bằng `_` sẽ bị bỏ qua khi build, có thể xóa.
> `tools/manifest-anh-cong-trinh.json` ghi lại ảnh đã chọn + cách cắt logo cho đợt nhập từ thư mục `03-ANH CONG TRINH CHUONG`.

## Sửa thông tin công ty

`src/site.js` — tên, hotline, email, địa chỉ, link Facebook/Zalo, nội dung dịch vụ, quy trình, Google Analytics.
Các dòng ghi `[CẦN BỔ SUNG]` đang là dữ liệu tạm.

Logo: thay `assets/logo-source.png` rồi chạy `npm run logo`.

## Cấu trúc

```
build.mjs              # build ra dist/
dev.mjs                # server xem thử trên máy
src/site.js            # thông tin công ty
src/projects.js        # đọc dự án + nén ảnh
src/templates/         # giao diện (EJS)
src/assets/            # main.css, main.js
content/projects/      # dự án: ảnh + info.md
public/                # logo, favicon (chép nguyên vào dist/)
tools/                 # nhập ảnh, tạo logo
design-system/         # quy chuẩn màu, font, khoảng cách
_legacy-express/       # bản Express cũ (không dùng nữa, có thể xóa)
```

Deploy: xem [DEPLOY.md](DEPLOY.md).
