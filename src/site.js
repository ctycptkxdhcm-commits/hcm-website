// Thông tin công ty — sửa tại đây, toàn bộ website cập nhật theo sau khi build.
// [CẦN BỔ SUNG] = thông tin chưa có, đang để tạm.
export const site = {
  name: 'HCM',
  legalName: 'Công ty Cổ phần Tư vấn Thiết kế và Xây dựng HCM',
  tagline: 'Kiến tạo không gian sống',
  description:
    'Công ty CP Tư vấn Thiết kế và Xây dựng HCM — thiết kế kiến trúc, nội thất, cảnh quan và xây dựng trọn gói nhà phố, biệt thự, chung cư, văn phòng, khách sạn, công trình công cộng và quốc phòng tại Nghệ An.',
  // Địa chỉ website khi đã có tên miền, ví dụ 'https://hcmdesign.vn'
  url: process.env.SITE_URL || 'https://ctycptkxdhcm-commits.github.io/hcm-website',
  region: 'Nghệ An',
  phone: '0902 090 567',
  phoneHref: '+84902090567',
  phone2: '0824 331 989', // số thứ hai — để trống sẽ ẩn
  phone2Href: '+84824331989',
  email: 'ctycptkxdhcm@gmail.com',
  address: 'TP. Vinh, Nghệ An', // [CẦN BỔ SUNG] địa chỉ văn phòng đầy đủ
  hours: 'Thứ 2 – Thứ 7: 7:30 – 17:30',
  mapQuery: 'Vinh, Nghe An', // [CẦN BỔ SUNG] tên/địa chỉ trên Google Maps
  social: {
    facebook: '', // [CẦN BỔ SUNG] link fanpage, để trống sẽ ẩn
    zalo: '', // ví dụ 'https://zalo.me/0900000000'
    youtube: '',
    tiktok: ''
  },
  // Google Analytics 4, ví dụ 'G-XXXXXXXXXX'. Để trống = không gắn.
  gaId: process.env.GA_ID || '',

  nav: [
    { href: '/', label: 'Trang chủ' },
    { href: '/gioi-thieu/', label: 'Giới thiệu' },
    { href: '/dich-vu/', label: 'Dịch vụ' },
    { href: '/du-an/', label: 'Dự án' },
    { href: '/lien-he/', label: 'Liên hệ' }
  ],

  heroSlogans: ['Thiết kế độc bản', 'Không gian tinh tế', 'Bền vững theo thời gian'],

  about:
    'HCM đồng hành cùng gia chủ và chủ đầu tư từ ý tưởng đầu tiên đến ngày bàn giao. Chúng tôi lắng nghe nếp sống, gu thẩm mỹ và ngân sách của từng khách hàng để tạo nên những công trình hài hòa giữa công năng, thẩm mỹ và khí hậu đặc thù miền Trung.',

  services: [
    {
      key: 'kien-truc',
      title: 'Thiết kế kiến trúc',
      summary: 'Nhà ở, văn phòng, khách sạn, công trình công cộng và quốc phòng — công năng tối ưu, mặt đứng có bản sắc, phù hợp khí hậu miền Trung.',
      items: ['Khảo sát hiện trạng, tư vấn công năng', 'Phương án mặt bằng & phối cảnh 3D', 'Hồ sơ kỹ thuật thi công, xin phép xây dựng']
    },
    {
      key: 'noi-that',
      title: 'Thiết kế nội thất',
      summary: 'Không gian sống tinh tế, vật liệu chọn lọc, chi tiết đồng bộ từ trần, sàn đến đồ rời.',
      items: ['Concept phong cách & bảng vật liệu', 'Phối cảnh 3D từng phòng', 'Bản vẽ triển khai chi tiết đồ gỗ']
    },
    {
      key: 'canh-quan',
      title: 'Thiết kế cảnh quan',
      summary: 'Sân vườn, tiểu cảnh, hồ nước — đưa thiên nhiên vào ngôi nhà, tạo vi khí hậu mát mẻ.',
      items: ['Quy hoạch sân vườn tổng thể', 'Chọn cây xanh & vật liệu ngoại thất', 'Chiếu sáng cảnh quan']
    },
    {
      key: 'xay-dung',
      title: 'Xây dựng trọn gói',
      summary: 'Một đầu mối từ thiết kế đến bàn giao — kiểm soát chất lượng, tiến độ và chi phí minh bạch.',
      items: ['Thi công phần thô & hoàn thiện', 'Giám sát kỹ thuật thường xuyên', 'Bảo hành, bảo trì sau bàn giao']
    }
  ],

  values: [
    { title: 'Cân bằng', text: 'Hài hòa giữa công năng, thẩm mỹ và chi phí.' },
    { title: 'Cá nhân hóa', text: 'Mỗi công trình là câu chuyện riêng của gia chủ.' },
    { title: 'Tinh tế', text: 'Chăm chút từng tỷ lệ, vật liệu và ánh sáng.' },
    { title: 'Bền vững', text: 'Thông thoáng, tiết kiệm năng lượng, đẹp lâu dài.' }
  ],

  process: [
    { title: 'Trao đổi & tư vấn', text: 'Lắng nghe nhu cầu, khảo sát khu đất, định hướng phong cách và ngân sách.' },
    { title: 'Thiết kế & báo giá', text: 'Phương án mặt bằng, phối cảnh 3D, hồ sơ kỹ thuật và dự toán chi tiết.' },
    { title: 'Ký hợp đồng & thi công', text: 'Triển khai thi công theo tiến độ, giám sát và báo cáo thường xuyên.' },
    { title: 'Bàn giao & bảo hành', text: 'Nghiệm thu, bàn giao công trình và đồng hành bảo hành lâu dài.' }
  ]
};
