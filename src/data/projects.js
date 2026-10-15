// Dự án tiêu biểu (dữ liệu mẫu — thay bằng dự án và ảnh thật của công ty).
export const projectCategories = [
  { key: 'all', label: 'Tất cả' },
  { key: 'dan-dung', label: 'Dân dụng' },
  { key: 'cong-nghiep', label: 'Công nghiệp' },
  { key: 'nha-o', label: 'Nhà ở cao cấp' }
];

export const projects = [
  {
    slug: 'hcm-tower-quan-1',
    title: 'HCM Tower',
    category: 'dan-dung',
    location: 'Quận 1, TP. HCM',
    year: 2024,
    area: '42.000 m²',
    scale: '28 tầng + 4 hầm',
    client: 'HCM Land',
    image: 'photo-1486406146926-c627a92ad1ab',
    summary: 'Tòa văn phòng hạng A với mặt dựng kính Low-E, đạt chứng chỉ LEED Gold.',
    body: [
      'Dự án nằm tại trung tâm Quận 1, thi công trong điều kiện mặt bằng chật hẹp với 4 tầng hầm sâu 16 m bằng phương pháp top-down.',
      'Hệ thống MEP được mô hình hóa toàn bộ bằng BIM, giúp giảm 30% xung đột thiết kế và rút ngắn 2 tháng tiến độ.'
    ]
  },
  {
    slug: 'the-river-residence',
    title: 'The River Residence',
    category: 'dan-dung',
    location: 'Thủ Đức, TP. HCM',
    year: 2023,
    area: '85.000 m²',
    scale: '2 tháp 35 tầng',
    client: 'Riverside JSC',
    image: 'photo-1545324418-cc1a3fa10c00',
    summary: 'Khu căn hộ cao cấp ven sông với 720 căn hộ và tiện ích 5 sao.',
    body: [
      'Tổng thầu thi công phần thân, hoàn thiện và hạ tầng cảnh quan.',
      'Bàn giao sớm 45 ngày so với hợp đồng, không có sự cố an toàn lao động.'
    ]
  },
  {
    slug: 'nha-may-long-an',
    title: 'Nhà máy Điện tử Long An',
    category: 'cong-nghiep',
    location: 'KCN Phúc Long, Long An',
    year: 2024,
    area: '36.000 m²',
    scale: 'Nhà xưởng + phòng sạch',
    client: 'Tập đoàn FDI Nhật Bản',
    image: 'photo-1565008447742-97f6f38c985c',
    summary: 'Nhà máy sản xuất linh kiện điện tử với phòng sạch class 10.000.',
    body: [
      'Kết cấu thép tiền chế khẩu độ 60 m, sàn epoxy chống tĩnh điện và hệ thống HVAC kiểm soát độ ẩm.',
      'Áp dụng tiêu chuẩn an toàn và quản lý chất lượng theo yêu cầu khắt khe của chủ đầu tư Nhật Bản.'
    ]
  },
  {
    slug: 'trung-tam-logistics-binh-duong',
    title: 'Trung tâm Logistics Bình Dương',
    category: 'cong-nghiep',
    location: 'VSIP II, Bình Dương',
    year: 2022,
    area: '54.000 m²',
    scale: 'Kho Grade A',
    client: 'LogiPark Vietnam',
    image: 'photo-1581094794329-c8112a89af12',
    summary: 'Kho bãi tiêu chuẩn quốc tế với 80 dock xuất nhập hàng.',
    body: [
      'Sàn chịu tải 5 tấn/m², hệ thống chữa cháy sprinkler ESFR.',
      'Thi công hoàn thành trong 9 tháng.'
    ]
  },
  {
    slug: 'biet-thu-thao-dien',
    title: 'Biệt thự Thảo Điền',
    category: 'nha-o',
    location: 'Thảo Điền, TP. Thủ Đức',
    year: 2024,
    area: '850 m²',
    scale: '3 tầng + hồ bơi',
    client: 'Gia đình anh T.',
    image: 'photo-1613490493576-7fde63acd811',
    summary: 'Biệt thự hiện đại với không gian mở hướng sông và hồ bơi tràn.',
    body: [
      'Kiến trúc nhiệt đới hiện đại, tối ưu thông gió tự nhiên và ánh sáng.',
      'Tích hợp hệ thống nhà thông minh điều khiển ánh sáng, rèm và an ninh.'
    ]
  },
  {
    slug: 'villa-phu-my-hung',
    title: 'Villa Phú Mỹ Hưng',
    category: 'nha-o',
    location: 'Quận 7, TP. HCM',
    year: 2023,
    area: '620 m²',
    scale: '2 tầng + sân vườn',
    client: 'Gia đình chị L.',
    image: 'photo-1600607687939-ce8a6c25118c',
    summary: 'Không gian sống sang trọng, nội thất tối giản và vật liệu tự nhiên.',
    body: [
      'Thiết kế và thi công nội thất trọn gói, sử dụng gỗ óc chó và đá tự nhiên nhập khẩu.',
      'Hoàn thành trong 7 tháng.'
    ]
  }
];
