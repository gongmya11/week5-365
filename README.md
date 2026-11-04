# TUẦN 5: THỰC HÀNH REACT ROUTER & API (QUẢN LÝ SẢN PHẨM)

Dự án độc lập được xây dựng cho **Tuần 5: Thực hành Router & API** theo tiêu chuẩn kiến trúc Shell - Core - Module, sử dụng React 19, TypeScript strict, Vite, React Router v7, Tailwind CSS v4 và Axios.

---

## 1. Mục tiêu và yêu cầu đạt được

- [x] **Hệ thống Routing nhiều cấp (Nested Route):** Thiết lập cấu trúc cha - con (`ProductsLayout` bọc `<Outlet />`), truyền và nhận tham số động qua URL (`useParams<{ id: string }>()`).
- [x] **API Service & Axios Interceptor tập trung:**
  - Khởi tạo Axios instance cấu hình `baseURL`, `timeout` từ biến môi trường.
  - **Request Interceptor:** Tự động đính kèm `Authorization: Bearer <token>` từ `localStorage` hoặc `.env`.
  - **Response Interceptor:** Xử lý và chuẩn hóa toàn bộ lỗi HTTP (400, 401, 403, 404, 500, Timeout, Network error) thành đối tượng `ApiError`.
- [x] **TypeScript nâng cao (Generics & Utility Types):**
  - **Generics:** `ApiResponse<T>`, `PaginatedResponse<T>`, `FilterParams<T>`, các hàm HTTP `get<T>`, `post<T, B>`, `put<T, B>`, `deleteRequest<T>`.
  - **Utility Types:** `Omit<Product, "id" | "createdAt" | "updatedAt">`, `Partial<ProductInput>`, `Pick<Product, ...>`, `Record<ProductStatus, ...>`.
- [x] **Cấu hình môi trường (.env):** Sử dụng `.env`, `.env.example`, `.env.production` để cấu hình `VITE_API_BASE_URL` cho từng môi trường, có hàm validate URL nghiêm ngặt, không hard-code URL/token trong code.
- [x] **Hoàn thành đầy đủ luồng CRUD thực tế:**
  - **List:** Bảng danh sách sản phẩm khớp 100% hình mẫu thiết kế (STT, Hình ảnh, Tên sản phẩm, Danh mục, Giá VNĐ, Số lượng, Trạng thái badge, Ngày tạo, Thao tác), hỗ trợ tìm kiếm theo tên, lọc danh mục, lọc trạng thái, phân trang tùy chỉnh số bản ghi (5, 10, 20...), xuất Excel (CSV UTF-8).
  - **Detail:** Route `/products/:id`, xem chi tiết đầy đủ sản phẩm, ảnh lớn, thông số, ngày tạo, breadcrumb, nút Sửa, nút Xóa, nút Quay lại.
  - **Create:** Hỗ trợ cả tạo nhanh tại trang chủ qua card "Thêm sản phẩm mới" lẫn trang tạo riêng biệt `/products/create`.
  - **Edit:** Route `/products/:id/edit`, fetch dữ liệu sản phẩm theo `id`, pre-fill form, validate và cập nhật qua API PUT.
  - **Delete:** Nút xóa có modal dialog xác nhận hiển thị thông tin sản phẩm cần xóa, gọi API DELETE, cập nhật danh sách và hiển thị thông báo Toast Sonner.
- [x] **Xử lý trọn vẹn 3 trạng thái cho từng màn hình:**
  - **Đang tải (Loading):** Skeleton table loader, Skeleton detail loader, nút thao tác có spinner và disable.
  - **Lỗi (Error):** Hiển thị banner lỗi trực quan, thân thiện kèm nút **Thử lại (Retry)**, không bao giờ để trắng trang hoặc crash ứng dụng.
  - **Không có dữ liệu (Empty):** Hiển thị empty state có minh họa trực quan, gợi ý và nút "Xóa bộ lọc".

---

## 2. Cấu trúc thư mục dự án

```text
Week5/
├── .env                             # Cấu hình môi trường hiện tại
├── .env.example                     # File cấu hình mẫu
├── .env.production                  # Cấu hình môi trường production
├── package.json                     # Quản lý dependencies (React 19, Axios, Lucide, Tailwind v4...)
├── tsconfig.json                    # Cấu hình TypeScript
├── vite.config.ts                   # Cấu hình Vite & Mock REST API dev server
├── index.html                       # Entry HTML
├── scripts/
│   └── check-module-boundaries.mjs  # Kiểm tra ranh giới kiến trúc module độc lập
└── src/
    ├── main.tsx                     # Entry point React
    ├── App.tsx                      # Root component
    ├── index.css                    # Tailwind v4, Theme tokens & font Inter
    ├── assets/
    │   └── logos/                   # Logo thương hiệu
    ├── core/                        # Tầng Core độc lập nghiệp vụ
    │   ├── api/
    │   │   ├── config.ts            # Đọc và validate URL từ .env
    │   │   ├── client.ts            # Axios instance + Request/Response Interceptors + Generic methods
    │   │   └── types.ts             # Generic types: ApiResponse<T>, PaginatedResponse<T>, FilterParams<T>
    │   ├── components/
    │   │   ├── site-header.tsx      # Header điều hướng hệ thống
    │   │   ├── header-navigation.tsx
    │   │   ├── app-states.tsx       # 404 NotFound & EmptyModules
    │   │   ├── page-loading.tsx     # Loading fallback cho Lazy routes
    │   │   └── ui/                  # Button, Input, Textarea, Dialog, Sonner, Command...
    │   ├── providers/
    │   │   └── theme-provider.tsx   # Context Light/Dark theme
    │   └── types/
    │       └── module.ts            # Định nghĩa AppModule, ModuleRoute
    ├── router/                      # Tầng Router
    │   ├── registry.ts              # Tự động nạp modules độc lập qua import.meta.glob
    │   ├── hooks.ts                 # Hook điều hướng useRouter, usePathname
    │   └── index.tsx                # AppRouter triển khai Nested Routes động
    └── modules/
        └── products/                # Nghiệp vụ Quản lý sản phẩm
            ├── module.ts            # Đăng ký route và layout của module
            ├── types/
            │   ├── product.ts       # Zod Schema, Product, ProductInput, Utility Types
            │   └── initial-products.ts # Dữ liệu khởi tạo 28 sản phẩm mẫu
            ├── api/
            │   └── products-api.ts  # Tách biệt API service khỏi UI
            ├── hooks/
            │   ├── use-products.ts  # Hook quản lý danh sách, tìm kiếm, phân trang, xóa
            │   └── use-product.ts   # Hook quản lý chi tiết, thêm mới, chỉnh sửa
            ├── utils/
            │   ├── product-format.ts# Định dạng tiền tệ VNĐ (Intl) & ngày tháng
            │   └── export-excel.ts  # Tiện ích xuất dữ liệu ra file Excel CSV
            ├── components/
            │   ├── product-form.tsx # Form nhập liệu thêm/sửa sản phẩm
            │   ├── products-table.tsx # Bảng danh sách sản phẩm + phân trang + 3 trạng thái
            │   ├── products-filter.tsx # Thanh tìm kiếm & lọc danh mục, trạng thái
            │   ├── product-delete-dialog.tsx # Dialog xác nhận xóa an toàn
            │   └── product-status-badge.tsx  # Badge hiển thị Còn hàng / Sắp hết / Hết hàng
            └── pages/
                ├── products-layout.tsx      # Layout Nested Route bọc Breadcrumbs và <Outlet />
                ├── products-list-page.tsx   # Trang danh sách khớp 100% hình mẫu
                ├── product-detail-page.tsx  # Trang chi tiết (/products/:id)
                ├── product-create-page.tsx  # Trang tạo mới (/products/create)
                └── product-edit-page.tsx    # Trang chỉnh sửa (/products/:id/edit)
```

---

## 3. Bản đồ Routing (Nested Routes & URL Parameters)

| Đường dẫn (URL)      | Component Page      | Mô tả                                                                             |
| :------------------- | :------------------ | :-------------------------------------------------------------------------------- |
| `/`                  | `Navigate`          | Tự động chuyển hướng về `/products`                                               |
| `/products`          | `ProductsListPage`  | Quản lý sản phẩm: Form thêm nhanh, bộ lọc, bảng danh sách 28 sản phẩm, phân trang |
| `/products/create`   | `ProductCreatePage` | Trang tạo mới sản phẩm độc lập                                                    |
| `/products/:id`      | `ProductDetailPage` | Xem chi tiết sản phẩm theo tham số `:id` qua URL                                  |
| `/products/:id/edit` | `ProductEditPage`   | Chỉnh sửa sản phẩm theo tham số `:id` qua URL                                     |
| `*`                  | `NotFound`          | Trang báo lỗi 404 khi truy cập sai đường dẫn                                      |

---

## 4. Hướng dẫn chạy dự án

### 4.1. Cài đặt dependencies

```bash
npx pnpm install
# hoặc: npm install
```

### 4.2. Khởi chạy môi trường phát triển (Dev Server)

```bash
npm run dev
```

Truy cập ứng dụng tại: `http://localhost:6062`

### 4.3. Kiểm tra TypeScript & Production Build

```bash
# Kiểm tra type TypeScript
npm run typecheck

# Kiểm tra ranh giới độc lập của module theo Project Guide
node scripts/check-module-boundaries.mjs

# Build production
npm run build
```

---

## 5. Thử nghiệm các kịch bản kiểm thử

1. **Kiểm tra luồng CRUD:**
   - **Xem danh sách & tìm kiếm:** Nhập tên sản phẩm (ví dụ "iPhone", "MacBook"), lọc danh mục "Điện thoại" hoặc trạng thái "Hết hàng".
   - **Tạo mới:** Điền form "Thêm sản phẩm mới" ở trên cùng hoặc truy cập `/products/create`, bấm "Thêm sản phẩm". Sản phẩm mới sẽ xuất hiện ngay lập tức ở đầu danh sách.
   - **Xem chi tiết:** Click vào tên sản phẩm bất kỳ hoặc icon con mắt `👁️` để chuyển sang trang `/products/:id`.
   - **Chỉnh sửa:** Bấm nút Sửa màu xanh `✏️` để vào `/products/:id/edit`, chỉnh sửa thông tin và bấm "Lưu thay đổi".
   - **Xóa:** Bấm nút Xóa màu đỏ `🗑️`, modal xác nhận hiển thị tên sản phẩm, bấm "Xác nhận xóa" để xóa qua API.
   - **Xuất Excel:** Bấm nút "Xuất Excel" góc trên bên phải để tải file `.csv` danh sách sản phẩm.
2. **Kiểm tra trạng thái Lỗi (Error State) & Nút Thử lại (Retry):**
   - Truy cập `http://localhost:6062/products?mockError=1` hoặc gọi API với `?mockError=1`. Giao diện sẽ hiển thị Banner lỗi và nút "Thử lại", không hề bị crash hay trắng trang.
3. **Kiểm tra trạng thái Rỗng (Empty State):**
   - Nhập từ khóa tìm kiếm không tồn tại (ví dụ "xyz123456"). Hệ thống sẽ hiển thị Empty State với nút "Xóa bộ lọc".
