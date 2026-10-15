// Thông tin công ty — chỉnh sửa tại đây, toàn bộ website sẽ cập nhật theo.
// LƯU Ý: số liệu, địa chỉ, điện thoại bên dưới là dữ liệu mẫu, cần thay bằng thông tin thật.
export const site = {
  name: 'HCM Construction',
  legalName: 'Công ty Cổ phần Xây dựng HCM',
  shortName: 'HCM',
  tagline: 'Kiến tạo công trình bền vững',
  description:
    'HCM Construction — tổng thầu thiết kế & thi công công trình dân dụng, công nghiệp và bất động sản cao cấp tại Việt Nam. Chất lượng, đúng tiến độ, minh bạch chi phí.',
  url: process.env.SITE_URL || 'http://localhost:3000',
  phone: '0909 000 000',
  phoneHref: '+84909000000',
  email: 'info@hcmconstruction.vn',
  address: 'Tầng 12, Tòa nhà HCM Tower, 123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
  hours: 'Thứ 2 – Thứ 7: 8:00 – 17:30',
  mapEmbed:
    'https://www.google.com/maps?q=Nguyen+Hue+Quan+1+Ho+Chi+Minh&output=embed',
  social: {
    facebook: 'https://facebook.com/',
    youtube: 'https://youtube.com/',
    linkedin: 'https://linkedin.com/',
    zalo: 'https://zalo.me/0909000000'
  },
  founded: 2008,
  stats: [
    { value: 17, suffix: '+', label: 'Năm kinh nghiệm' },
    { value: 320, suffix: '+', label: 'Công trình hoàn thành' },
    { value: 1.2, suffix: ' triệu m²', label: 'Diện tích sàn thi công', decimals: 1 },
    { value: 98, suffix: '%', label: 'Bàn giao đúng tiến độ' }
  ],
  nav: [
    { href: '/', label: 'Trang chủ' },
    { href: '/gioi-thieu', label: 'Giới thiệu' },
    { href: '/dich-vu', label: 'Dịch vụ' },
    { href: '/du-an', label: 'Dự án' },
    { href: '/tin-tuc', label: 'Tin tức' },
    { href: '/lien-he', label: 'Liên hệ' }
  ]
};
