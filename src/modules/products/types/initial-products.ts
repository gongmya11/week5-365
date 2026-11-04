import type { Product } from "./product.ts"

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "iPhone 15 Pro",
    category: "Điện thoại",
    price: 28990000,
    quantity: 15,
    status: "Còn hàng",
    description:
      "Khung titan siêu bền nhẹ, chip Apple A17 Pro mạnh mẽ, camera 48MP zoom quang học 5x.",
    imageUrl:
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=300&q=80",
    createdAt: "2024-04-10T08:30:00.000Z",
  },
  {
    id: "2",
    name: "MacBook Air M2",
    category: "Laptop",
    price: 24990000,
    quantity: 8,
    status: "Còn hàng",
    description:
      "Thiết kế siêu mỏng nhẹ thời thượng, màn hình Liquid Retina 13.6 inch rực rỡ, pin lên đến 18 giờ.",
    imageUrl:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&q=80",
    createdAt: "2024-04-09T14:15:00.000Z",
  },
  {
    id: "3",
    name: "Tai nghe AirPods Pro",
    category: "Phụ kiện",
    price: 6490000,
    quantity: 20,
    status: "Còn hàng",
    description:
      "Chống ồn chủ động đỉnh cao gấp 2 lần, âm thanh thích ứng thông minh, sạc MagSafe tiện lợi.",
    imageUrl:
      "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=300&q=80",
    createdAt: "2024-04-08T09:20:00.000Z",
  },
  {
    id: "4",
    name: "iPad Gen 10",
    category: "Máy tính bảng",
    price: 10990000,
    quantity: 12,
    status: "Sắp hết",
    description:
      "Màn hình tràn viền Liquid Retina 10.9 inch, chip A14 Bionic nhanh nhạy, cổng USB-C tiện dụng.",
    imageUrl:
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&q=80",
    createdAt: "2024-04-07T11:45:00.000Z",
  },
  {
    id: "5",
    name: "Apple Watch Series 9",
    category: "Đồng hồ",
    price: 10490000,
    quantity: 0,
    status: "Hết hàng",
    description:
      "Thao tác Chạm Hai Lần đột phá, màn hình sáng gấp đôi, theo dõi sức khỏe và thể chất chuyên sâu.",
    imageUrl:
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=300&q=80",
    createdAt: "2024-04-06T16:00:00.000Z",
  },
  {
    id: "6",
    name: "Samsung Galaxy S24 Ultra",
    category: "Điện thoại",
    price: 31990000,
    quantity: 14,
    status: "Còn hàng",
    description:
      "Trải nghiệm quyền năng Galaxy AI vượt trội, bút S-Pen tích hợp, camera mắt thần bóng đêm 200MP.",
    imageUrl:
      "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=300&q=80",
    createdAt: "2024-04-05T10:10:00.000Z",
  },
  {
    id: "7",
    name: "Dell XPS 13 Plus",
    category: "Laptop",
    price: 35500000,
    quantity: 4,
    status: "Sắp hết",
    description:
      "Bàn phím tràn cạnh không viền, touchpad tàng hình bằng kính phản hồi rung, màn hình 3.5K OLED.",
    imageUrl:
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=300&q=80",
    createdAt: "2024-04-04T13:40:00.000Z",
  },
  {
    id: "8",
    name: "Bàn phím cơ Keychron K2 Pro",
    category: "Phụ kiện",
    price: 2290000,
    quantity: 28,
    status: "Còn hàng",
    description:
      "Bàn phím cơ không dây QMK/VIA tùy biến toàn diện, hỗ trợ kết nối 3 thiết bị đồng thời.",
    imageUrl:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300&q=80",
    createdAt: "2024-04-03T09:00:00.000Z",
  },
  {
    id: "9",
    name: "Chuột Logitech MX Master 3S",
    category: "Phụ kiện",
    price: 2490000,
    quantity: 22,
    status: "Còn hàng",
    description:
      "Cảm biến 8K DPI lướt trên mọi bề mặt kể cả kính, cuộn siêu tốc MagSpeed, click yên tĩnh giảm 90% ồn.",
    imageUrl:
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=300&q=80",
    createdAt: "2024-04-02T15:20:00.000Z",
  },
  {
    id: "10",
    name: "Samsung Galaxy Tab S9",
    category: "Máy tính bảng",
    price: 19990000,
    quantity: 7,
    status: "Sắp hết",
    description:
      "Màn hình Dynamic AMOLED 2X 120Hz sắc nét, chuẩn kháng bụi nước IP68 đầu tiên trên tablet.",
    imageUrl:
      "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=300&q=80",
    createdAt: "2024-04-01T08:50:00.000Z",
  },
  {
    id: "11",
    name: "Garmin Fenix 7 Pro",
    category: "Đồng hồ",
    price: 21990000,
    quantity: 5,
    status: "Sắp hết",
    description:
      "Đồng hồ thể thao GPS đa năng cao cấp sạc bằng năng lượng mặt trời, tích hợp đèn pin LED.",
    imageUrl:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80",
    createdAt: "2024-03-31T17:15:00.000Z",
  },
  {
    id: "12",
    name: "Sony WH-1000XM5",
    category: "Phụ kiện",
    price: 7990000,
    quantity: 16,
    status: "Còn hàng",
    description:
      "Chống ồn hàng đầu ngành với bộ xử lý kép, âm thanh Hi-Res Audio chuẩn phòng thu.",
    imageUrl:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80",
    createdAt: "2024-03-30T10:30:00.000Z",
  },
  {
    id: "13",
    name: "Xiaomi 14 Ultra",
    category: "Điện thoại",
    price: 29990000,
    quantity: 0,
    status: "Hết hàng",
    description:
      "Hệ thống 4 camera quang học Leica đỉnh cao, cảm biến 1 inch thế hệ mới, chip Snapdragon 8 Gen 3.",
    imageUrl:
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=300&q=80",
    createdAt: "2024-03-29T14:40:00.000Z",
  },
  {
    id: "14",
    name: "Asus ROG Zephyrus G14",
    category: "Laptop",
    price: 42990000,
    quantity: 6,
    status: "Sắp hết",
    description:
      "Laptop gaming mỏng nhẹ màn hình ROG Nebula OLED 3K, GPU RTX 4070 mạnh mẽ.",
    imageUrl:
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=300&q=80",
    createdAt: "2024-03-28T16:10:00.000Z",
  },
  {
    id: "15",
    name: "Màn hình LG UltraFine 4K",
    category: "Phụ kiện",
    price: 13990000,
    quantity: 11,
    status: "Còn hàng",
    description:
      "Tấm nền IPS Nano chuẩn màu 98% DCI-P3, tích hợp cổng Thunderbolt 3 sạc máy tính lên đến 85W.",
    imageUrl:
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300&q=80",
    createdAt: "2024-03-27T09:25:00.000Z",
  },
  {
    id: "16",
    name: "iPad Pro 11 M2",
    category: "Máy tính bảng",
    price: 22490000,
    quantity: 9,
    status: "Sắp hết",
    description:
      "Sức mạnh bứt phá từ vi xử lý M2, tính năng lướt Apple Pencil thông minh, quay video ProRes.",
    imageUrl:
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&q=80",
    createdAt: "2024-03-26T11:05:00.000Z",
  },
  {
    id: "17",
    name: "Galaxy Watch 6 Classic",
    category: "Đồng hồ",
    price: 7990000,
    quantity: 18,
    status: "Còn hàng",
    description:
      "Vòng xoay bezel vật lý sang trọng kinh điển, phân tích điện tâm đồ ECG và giấc ngủ chuyên sâu.",
    imageUrl:
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=300&q=80",
    createdAt: "2024-03-25T13:30:00.000Z",
  },
  {
    id: "18",
    name: "Google Pixel 8 Pro",
    category: "Điện thoại",
    price: 21990000,
    quantity: 13,
    status: "Còn hàng",
    description:
      "Thuật toán nhiếp ảnh AI Google Tensor G3 độc quyền, hỗ trợ cập nhật Android đến 7 năm.",
    imageUrl:
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=300&q=80",
    createdAt: "2024-03-24T15:00:00.000Z",
  },
  {
    id: "19",
    name: "Lenovo ThinkPad X1 Carbon Gen 11",
    category: "Laptop",
    price: 38990000,
    quantity: 0,
    status: "Hết hàng",
    description:
      "Trọng lượng chỉ 1.12kg từ sợi carbon chuẩn quân đội, bàn phím gõ êm nhất thế giới doanh nhân.",
    imageUrl:
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=300&q=80",
    createdAt: "2024-03-23T08:15:00.000Z",
  },
  {
    id: "20",
    name: "Loa Marshall Stanmore III",
    category: "Phụ kiện",
    price: 8990000,
    quantity: 17,
    status: "Còn hàng",
    description:
      "Chất âm stereo rộng mở đặc trưng phong cách vintage Rock 'n' Roll, kết nối Bluetooth 5.2.",
    imageUrl:
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=300&q=80",
    createdAt: "2024-03-22T10:45:00.000Z",
  },
  {
    id: "21",
    name: "iPad Air 5 M1",
    category: "Máy tính bảng",
    price: 14990000,
    quantity: 19,
    status: "Còn hàng",
    description:
      "Nhiều màu sắc tươi sáng, camera trước 12MP Ultra Wide hỗ trợ Center Stage căn giữa thông minh.",
    imageUrl:
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&q=80",
    createdAt: "2024-03-21T12:00:00.000Z",
  },
  {
    id: "22",
    name: "Huawei Watch GT 4",
    category: "Đồng hồ",
    price: 4990000,
    quantity: 21,
    status: "Còn hàng",
    description:
      "Thời lượng pin ấn tượng lên đến 14 ngày, thiết kế mặt bát giác thời trang cao cấp.",
    imageUrl:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80",
    createdAt: "2024-03-20T14:10:00.000Z",
  },
  {
    id: "23",
    name: "iPhone 13 128GB",
    category: "Điện thoại",
    price: 13990000,
    quantity: 24,
    status: "Còn hàng",
    description:
      "Lựa chọn kinh tế với chip A15 Bionic bền bỉ, thời lượng pin cả ngày, camera kép chụp đêm xuất sắc.",
    imageUrl:
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=300&q=80",
    createdAt: "2024-03-19T09:30:00.000Z",
  },
  {
    id: "24",
    name: "Acer Swift Go 14 OLED",
    category: "Laptop",
    price: 18990000,
    quantity: 7,
    status: "Sắp hết",
    description:
      "Màn hình 2.8K OLED 90Hz màu sắc rực rỡ, trang bị chip Intel Core Ultra thế hệ mới hỗ trợ AI.",
    imageUrl:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&q=80",
    createdAt: "2024-03-18T16:20:00.000Z",
  },
  {
    id: "25",
    name: "Ổ cứng di động SanDisk Extreme 1TB",
    category: "Phụ kiện",
    price: 2990000,
    quantity: 35,
    status: "Còn hàng",
    description:
      "Tốc độ đọc ghi NVMe lên tới 1050MB/s, chuẩn chống rơi vỡ bụi nước IP55 bền bỉ.",
    imageUrl:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300&q=80",
    createdAt: "2024-03-17T11:15:00.000Z",
  },
  {
    id: "26",
    name: "Samsung Galaxy Z Fold 5",
    category: "Điện thoại",
    price: 36990000,
    quantity: 3,
    status: "Sắp hết",
    description:
      "Màn hình gập thế hệ mới bản lề Flex khít hoàn hảo, đa nhiệm 3 ứng dụng cùng lúc dễ dàng.",
    imageUrl:
      "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=300&q=80",
    createdAt: "2024-03-16T13:50:00.000Z",
  },
  {
    id: "27",
    name: "Mac mini M2 512GB",
    category: "Laptop",
    price: 19490000,
    quantity: 10,
    status: "Còn hàng",
    description:
      "Chiếc máy tính để bàn nhỏ gọn nhưng đầy uy lực từ chip Apple M2, đầy đủ cổng kết nối.",
    imageUrl:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&q=80",
    createdAt: "2024-03-15T15:10:00.000Z",
  },
  {
    id: "28",
    name: "Xiaomi Smart Band 8",
    category: "Đồng hồ",
    price: 890000,
    quantity: 40,
    status: "Còn hàng",
    description:
      "Vòng đeo tay thông minh màn hình AMOLED 60Hz, hỗ trợ hơn 150 chế độ thể thao, pin 16 ngày.",
    imageUrl:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80",
    createdAt: "2024-03-14T08:00:00.000Z",
  },
]
