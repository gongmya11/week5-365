import { get, post, put, deleteRequest } from "@/core/api/client"
import {
  productSchema,
  type Product,
  type ProductFilterParams,
  type ProductInput,
  type ProductPaginatedResponse,
  type ProductUpdateInput,
} from "../types/product"

const PRODUCTS_ENDPOINT = "/products"

/**
 * Lấy danh sách sản phẩm có tìm kiếm, lọc danh mục, trạng thái và phân trang
 */
export async function getProducts(
  params?: ProductFilterParams
): Promise<ProductPaginatedResponse> {
  const query = new URLSearchParams()

  if (params?.page) query.append("page", String(params.page))
  if (params?.limit) query.append("limit", String(params.limit))
  if (params?.search) query.append("search", params.search)
  if (params?.category) query.append("category", params.category)
  if (params?.status) query.append("status", params.status)
  if (params?.sortBy) query.append("sortBy", params.sortBy)
  if (params?.sortOrder) query.append("sortOrder", params.sortOrder)

  const queryString = query.toString()
  const url = queryString
    ? `${PRODUCTS_ENDPOINT}?${queryString}`
    : PRODUCTS_ENDPOINT

  const response = await get<ProductPaginatedResponse | Product[]>(url)

  // Xử lý linh hoạt cả 2 trường hợp API: trả về danh sách trực tiếp Product[] hoặc object { items, total, ... }
  if (Array.isArray(response)) {
    const validatedItems = response.map((item) => productSchema.parse(item))
    return {
      items: validatedItems,
      total: validatedItems.length,
      page: params?.page ?? 1,
      limit: params?.limit ?? validatedItems.length,
      totalPages: 1,
    }
  }

  // Trường hợp backend trả về PaginatedResponse
  const validatedItems = response.items.map((item) => productSchema.parse(item))
  return {
    ...response,
    items: validatedItems,
  }
}

/**
 * Lấy chi tiết 1 sản phẩm theo ID (tham số từ URL route)
 */
export async function getProductById(id: string): Promise<Product> {
  const response = await get<unknown>(
    `${PRODUCTS_ENDPOINT}/${encodeURIComponent(id)}`
  )
  return productSchema.parse(response)
}

/**
 * Thêm mới một sản phẩm
 */
export async function createProduct(input: ProductInput): Promise<Product> {
  const payload = {
    ...input,
    createdAt: new Date().toISOString(),
  }
  const response = await post<unknown, typeof payload>(
    PRODUCTS_ENDPOINT,
    payload
  )
  return productSchema.parse(response)
}

/**
 * Cập nhật thông tin sản phẩm theo ID
 */
export async function updateProduct(
  id: string,
  input: ProductUpdateInput
): Promise<Product> {
  const payload = {
    ...input,
    updatedAt: new Date().toISOString(),
  }
  const response = await put<unknown, typeof payload>(
    `${PRODUCTS_ENDPOINT}/${encodeURIComponent(id)}`,
    payload
  )
  return productSchema.parse(response)
}

/**
 * Xóa sản phẩm theo ID
 */
export async function deleteProduct(
  id: string
): Promise<{ success: boolean; id: string }> {
  await deleteRequest<unknown>(`${PRODUCTS_ENDPOINT}/${encodeURIComponent(id)}`)
  return { success: true, id }
}
