# HCM — Design System (MASTER)

Nguồn chuẩn cho giao diện. Token nằm ở `:root` trong `src/assets/main.css`.

## Định hướng
- **Sản phẩm:** Portfolio công ty thiết kế kiến trúc / nội thất / cảnh quan / xây dựng trọn gói (Nghệ An).
- **Mục tiêu:** gửi link cho khách xem công trình → ảnh là nhân vật chính.
- **Phong cách:** Sang trọng tối giản (tham khảo sbsvilla.vn): nền đen xen nền giấy ấm, ảnh lớn tràn màn hình, chữ serif lớn, nhiều khoảng trống, chuyển động mượt.
- **Dials:** variance 6 · motion 7 · density 3 (thoáng).

## Màu
| Token | Hex | Dùng cho |
|---|---|---|
| `--ink` | `#111111` | Nền tối chính |
| `--ink-3` | `#262626` | Nền placeholder ảnh |
| `--paper` | `#f5f3ef` | Nền sáng ấm |
| `--text` | `#1a1a1a` | Chữ trên nền sáng |
| `--muted` | `#5c5c5c` | Chữ phụ nền sáng (6.2:1) |
| `--muted-on-dark` | `#a8a8a8` | Chữ phụ nền tối (8.2:1) |
| `--brass` | `#b89c6e` | Nhấn trên nền tối (7.4:1) |
| `--brass-deep` | `#7a5f33` | Nhấn trên nền sáng (5.3:1) |

Logo xám đơn sắc → giữ hệ màu trung tính, chỉ một màu nhấn đồng nhạt.

## Chữ
- **Tiêu đề:** Cormorant Garamond 500 (+ italic cho 1–3 từ nhấn màu đồng). Có dấu tiếng Việt.
- **Nội dung / nhãn:** Be Vietnam Pro 300–500. Nhãn: chữ hoa, `letter-spacing` 0.16–0.28em, 12–13px.
- Base 17px, line-height 1.7, số dạng lining.
- *Không dùng Cinzel/Josefin cho tiếng Việt — thiếu hoặc lỗi dấu.*

## Chuyển động
- Hiện dần khi cuộn: opacity + translateY 28px, 900ms, `cubic-bezier(.16,1,.3,1)`, stagger 70–110ms.
- Hero: crossfade 1.4s + Ken Burns 7s; tiêu đề trượt lên từng dòng.
- Hover ảnh: scale 1.06 trong 1.1s.
- `prefers-reduced-motion` → tắt toàn bộ.

## Quy tắc
- Icon SVG inline stroke 1.5, không emoji.
- Vùng chạm ≥ 44px, focus ring đồng 2px.
- Ảnh có `width/height` hoặc `aspect-ratio`, `loading="lazy"` (trừ ảnh hero đầu).
- Không cuộn ngang ở 375px.
