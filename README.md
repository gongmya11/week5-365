# TUẦN 6: THỰC HÀNH AUTHENTICATION, TANSTACK QUERY & KIẾN TRÚC

Dự án được nâng cấp toàn diện cho **Tuần 6: Thực hành Authentication, TanStack Query & Kiến trúc** trên nền tảng React 19, TypeScript strict, TanStack Query v5, Zustand v5, React Router v7, Tailwind CSS v4, Axios, ESLint, Prettier, Husky và lint-staged.

---

## 1. Mục tiêu và kết quả đạt được

- [x] **Xác thực Authentication (Đăng nhập / Đăng xuất, Lưu & Kiểm tra Token):**
  - Màn hình Đăng nhập `/login` với form xác thực, hỗ trợ 3 nút bấm **Đăng nhập nhanh theo Role**: Admin, Editor, Viewer.
  - Mock API endpoints: `POST /api/v1/auth/login`, `POST /api/v1/auth/logout`, `GET /api/v1/auth/me`.
  - Token được lưu trữ an toàn trong `localStorage` và tự động gắn vào Header `Authorization: Bearer <token>` qua Axios Interceptor.
  - Avatar, thông tin người dùng và badge Role hiển thị trên Header kèm nút Đăng xuất.
- [x] **CRUD dữ liệu qua API sử dụng TanStack Query (Cache & Invalidation):**
  - Cấu hình `QueryClientProvider` bọc toàn bộ ứng dụng và tích hợp `ReactQueryDevtools`.
  - Hook `useProductsQuery(params)` sử dụng `useQuery` và `keepPreviousData` cho phân trang mượt mà.
  - Hook `useProductQuery(id)` nạp chi tiết sản phẩm với cache 5 phút.
  - Các hooks mutation: `useCreateProductMutation`, `useUpdateProductMutation`, `useDeleteProductMutation` tự động gọi `queryClient.invalidateQueries({ queryKey: ['products'] })` để đồng bộ dữ liệu ngay lập tức sau khi thêm/sửa/xóa.
- [x] **Quản lý Global State bằng Zustand:**
  - `useAuthStore`: Quản lý trạng thái xác thực (`token`, `user`, `isAuthenticated`, `login()`, `logout()`, `hasRole()`, `hasPermission()`) tích hợp middleware `persist`.
  - `useCartStore`: Quản lý giỏ hàng toàn cầu (`items`, `addItem()`, `removeItem()`, `updateQuantity()`, `clearCart()`, `getTotalCount()`, `getTotalAmount()`) tích hợp middleware `persist`.
  - **Cart Drawer:** Trượt từ cạnh phải khi bấm vào icon giỏ hàng trên Header, hỗ trợ tăng giảm số lượng, xóa từng món, tính tổng tiền VNĐ và thanh toán.
  - Nút **+ Giỏ hàng** xuất hiện ở cả bảng sản phẩm lẫn màn hình chi tiết sản phẩm.
- [x] **Protected Route theo trạng thái đăng nhập & Phân quyền Role/Permission:**
  - Component `ProtectedRoute`: Chặn truy cập người dùng chưa đăng nhập, tự động chuyển hướng về `/login` và lưu trang đích (`state: { from }`) để redirect sau khi đăng nhập.
  - Kiểm tra quyền truy cập theo `allowedRoles` (ví dụ route `/products/create` và `/products/:id/edit` chỉ cho phép `admin` và `editor`).
  - Trang `403 Forbidden` (`/unauthorized`) hiển thị khi người dùng không đủ quyền truy cập.
- [x] **Áp dụng Design Patterns trong Refactor:**
  - **Compound Component Pattern:** Xây dựng component `Card` dùng chung (`Card`, `Card.Header`, `Card.Title`, `Card.Description`, `Card.Content`, `Card.Footer`) áp dụng xuyên suốt trang danh sách, chi tiết, tạo mới, sửa và đăng nhập.
  - **Higher-Order Component (HOC) Pattern:** Xây dựng HOC `withPermission(Component, options)` và component khai báo `<Can role={...} permission={...}>` để phân quyền hiển thị các nút hành động (nút Tạo, nút Sửa chỉ hiển thị cho Admin/Editor; nút Xóa chỉ hiển thị cho Admin).
- [x] **ESLint, Prettier, Husky & lint-staged:**
  - Cấu hình `eslint.config.js` và `.prettierrc`.
  - Cấu hình Git Pre-commit hook qua `.husky/pre-commit` chạy `npx lint-staged`.
  - Tự động lint và format code trước mỗi commit; chặn đứng các commit vi phạm.

---

## 2. Tài khoản kiểm thử phân quyền (Demo Accounts)

| Vai trò (Role)             | Email                | Mật khẩu    | Quyền hạn (Permissions)                                           |
| :------------------------- | :------------------- | :---------- | :---------------------------------------------------------------- |
| **Admin** (Quản trị viên)  | `admin@example.com`  | `admin123`  | Toàn quyền CRUD sản phẩm, xóa sản phẩm, quản lý giỏ hàng          |
| **Editor** (Biên tập viên) | `editor@example.com` | `editor123` | Xem, tạo mới, chỉnh sửa sản phẩm; **KHÔNG** có quyền xóa sản phẩm |
| **Viewer** (Người xem)     | `viewer@example.com` | `viewer123` | Chỉ xem sản phẩm, thêm vào giỏ hàng; **BỊ CHẶN** tạo/sửa/xóa      |

_(Trên màn hình Đăng nhập có sẵn 3 nút chọn nhanh tài khoản rất tiện lợi khi kiểm thử)_

---

## 3. Bản đồ Routing & Phân quyền

| Đường dẫn (URL)      | Component Page      | Phân quyền bảo vệ                                                                        |
| :------------------- | :------------------ | :--------------------------------------------------------------------------------------- |
| `/login`             | `LoginPage`         | Công khai (Đăng nhập)                                                                    |
| `/unauthorized`      | `UnauthorizedPage`  | Công khai (Báo lỗi 403 Forbidden)                                                        |
| `/products`          | `ProductsListPage`  | Đăng nhập/Khách xem; Nút tạo & sửa chỉ hiện cho Admin/Editor; Nút xóa chỉ hiện cho Admin |
| `/products/create`   | `ProductCreatePage` | **Protected:** Yêu cầu đăng nhập & Role `admin` hoặc `editor`                            |
| `/products/:id`      | `ProductDetailPage` | Công khai/Đăng nhập (Xem chi tiết + Thêm vào giỏ)                                        |
| `/products/:id/edit` | `ProductEditPage`   | **Protected:** Yêu cầu đăng nhập & Role `admin` hoặc `editor`                            |

---

## 4. Các lệnh chạy và kiểm tra

```bash
# 1. Khởi chạy ứng dụng (cổng 6062)
npm run dev

# 2. Kiểm tra type TypeScript
npm run typecheck

# 3. Kiểm tra ESLint
npm run lint

# 4. Format mã nguồn bằng Prettier
npm run format

# 5. Kiểm tra ranh giới Module theo Project Guide
npm run check:modules

# 6. Build sản phẩm production
npm run build
```
