/**
 * Định nghĩa các generic types và utility types dùng chung cho tầng API
 */

// Generic API Response chuẩn
export interface ApiResponse<TData> {
  success: boolean
  data: TData
  message?: string
  status: number
  timestamp?: string
}

// Generic Paginated Response cho các API danh sách phân trang
export interface PaginatedResponse<TItem> {
  items: TItem[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Generic query parameters cho lọc, tìm kiếm, phân trang và sắp xếp
export interface BaseQueryParams {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

// Utility type kết hợp BaseQueryParams với bộ lọc đặc thù của từng module
export type FilterParams<TFilter extends object = object> = BaseQueryParams &
  TFilter

// Interface mô tả cấu trúc chi tiết của lỗi API trả về từ server
export interface ApiErrorPayload {
  message?: string
  errors?: Record<string, string[]>
  statusCode?: number
  error?: string
}
