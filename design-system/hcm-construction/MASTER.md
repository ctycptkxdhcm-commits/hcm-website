# HCM Construction — Design System (MASTER)

Nguồn sự thật cho toàn bộ giao diện. File trong `pages/` (nếu có) ghi đè cho từng trang.

## Định hướng
- **Sản phẩm:** Website doanh nghiệp xây dựng / bất động sản — giới thiệu, dịch vụ, dự án, tin tức, liên hệ.
- **Cảm giác:** Cao cấp, vững chãi, đáng tin cậy. Nhiều khoảng trắng, ảnh lớn, chữ to rõ.
- **Pattern:** Hero-centric — hero full-bleed, 1 CTA chính ("Nhận tư vấn"), CTA phụ trên thanh điều hướng.
- **Dials:** variance 6 · motion 5 · density 3 (thoáng).

## Màu (CSS tokens trong `public/css/main.css`)
| Vai trò | Hex | Ghi chú |
|---|---|---|
| `--ink` | `#111315` | Nền tối / chữ chính |
| `--ink-2` | `#1C1F23` | Bề mặt tối thứ cấp |
| `--stone` | `#F6F4EF` | Nền sáng ấm |
| `--paper` | `#FFFFFF` | Card |
| `--gold` | `#C9A15A` | Nhấn trên nền tối (tương phản 8.4:1 với `--ink`) |
| `--gold-deep` | `#8A6420` | Nhấn/chữ trên nền sáng (5.4:1 với trắng) |
| `--muted` | `#5B6168` | Chữ phụ trên nền sáng (6.3:1) |
| `--line` | `#E4E0D7` | Viền |

Không dùng hex thô trong component — luôn qua token.

## Typography
- **Heading + body:** Be Vietnam Pro (300–800), hỗ trợ tiếng Việt.
- **Nhấn (italic serif):** Playfair Display italic — chỉ cho 1–3 từ trong tiêu đề.
- Base 17px, line-height 1.65; tiêu đề dùng `clamp()`; letter-spacing âm nhẹ cho H1/H2.

## Hiệu ứng & chuyển động
- Reveal khi cuộn: opacity + translateY 24px, 600ms, `cubic-bezier(.2,.7,.2,1)`, stagger 80ms.
- Hover: 200ms; ảnh card scale 1.04.
- `prefers-reduced-motion: reduce` → tắt toàn bộ animation, hiển thị trạng thái cuối.

## Quy tắc bắt buộc
- Icon SVG inline (stroke 1.5), không dùng emoji.
- Tương phản ≥ 4.5:1, focus ring rõ (`outline: 2px solid var(--gold)`).
- Vùng chạm ≥ 44×44px; nhãn form luôn hiển thị; lỗi hiển thị cạnh field.
- Ảnh: `loading="lazy"`, có `width/height` hoặc `aspect-ratio` để CLS < 0.1.
- Responsive: 375 / 768 / 1024 / 1440, không cuộn ngang.

## Tránh
- Ảnh chất lượng thấp, stock ảnh rời rạc → thay bằng ảnh công trình thật của công ty.
- Glassmorphism nặng, gradient sặc sỡ, quá nhiều màu nhấn.
