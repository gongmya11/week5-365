import { z } from "zod"
import type { FilterParams, PaginatedResponse } from "../../../core/api/types"

/**
 * Danh sách danh mục sản phẩm chuẩn theo hệ thống
 */
export const PRODUCT_CATEGORIES = [
  "Điện thoại",
  "Laptop",
  "Phụ kiện",
  "Máy tính bảng",
  "Đồng hồ",
] as const

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number]

/**
 * Trạng thái sản phẩm
 */
export const PRODUCT_STATUSES = ["Còn hàng", "Sắp hết", "Hết hàng"] as const

export type ProductStatus = (typeof PRODUCT_STATUSES)[number]

/**
 * Schema kiểm tra dữ liệu Product từ API trả về (Runtime validation theo Project Guide)
 */
export const productSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Tên sản phẩm không được để trống"),
  category: z.string().min(1, "Vui lòng chọn danh mục"),
  price: z.number().min(0, "Giá sản phẩm phải lớn hơn hoặc bằng 0"),
  quantity: z.number().int().min(0, "Số lượng phải lớn hơn hoặc bằng 0"),
  status: z.enum(["Còn hàng", "Sắp hết", "Hết hàng"]),
  description: z.string().default(""),
  imageUrl: z.string().default(""),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
})

// Type Product suy ra từ Schema
export type Product = z.infer<typeof productSchema>

/**
 * Áp dụng TypeScript Utility Types nâng cao:
 * - Omit: Tạo kiểu dữ liệu đầu vào cho form Tạo mới (loại bỏ id, createdAt, updatedAt do server cấp)
 * - Partial: Cho phép cập nhật từng phần (sửa sản phẩm)
 * - Pick: Trích xuất các trường tóm tắt
 * - Record: Định nghĩa metadata cho từng trạng thái hiển thị
 */
export type ProductInput = Omit<Product, "id" | "createdAt" | "updatedAt">

export type ProductUpdateInput = Partial<ProductInput>

export type ProductSummary = Pick<
  Product,
  "id" | "name" | "price" | "status" | "quantity"
>

// Kiểu dữ liệu tham số lọc và tìm kiếm sản phẩm kết hợp Generics
export type ProductFilterParams = FilterParams<{
  category?: string
  status?: string
}>

// Kiểu dữ liệu phản hồi phân trang sản phẩm
export type ProductPaginatedResponse = PaginatedResponse<Product>

// Cấu hình hiển thị badge cho từng trạng thái (sử dụng Utility Type Record)
export const PRODUCT_STATUS_CONFIG: Record<
  ProductStatus,
  { label: string; badgeClass: string }
> = {
  "Còn hàng": {
    label: "Còn hàng",
    badgeClass:
      "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800",
  },
  "Sắp hết": {
    label: "Sắp hết",
    badgeClass:
      "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800",
  },
  "Hết hàng": {
    label: "Hết hàng",
    badgeClass:
      "bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800",
  },
}
