import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query"
import { toast } from "sonner"
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../api/products-api"
import type {
  ProductFilterParams,
  ProductInput,
  ProductUpdateInput,
} from "../types/product"

export const PRODUCTS_QUERY_KEY = ["products"] as const

/**
 * Hook truy vấn danh sách sản phẩm có phân trang, lọc và tìm kiếm bằng TanStack Query
 */
export function useProductsQuery(params?: ProductFilterParams) {
  return useQuery({
    queryKey: [PRODUCTS_QUERY_KEY[0], params],
    queryFn: () => getProducts(params),
    placeholderData: keepPreviousData, // Giữ lại dữ liệu trang cũ trong khi nạp trang mới
    staleTime: 1000 * 60 * 2, // Dữ liệu tươi trong 2 phút
  })
}

/**
 * Hook tạo mới sản phẩm với TanStack Query Mutation và Invalidate Cache tự động
 */
export function useCreateProductMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: ProductInput) => createProduct(input),
    onSuccess: (newProduct) => {
      // Invalidate toàn bộ cache danh sách sản phẩm để đồng bộ lại
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY })
      toast.success(`Đã thêm thành công sản phẩm "${newProduct.name}".`)
    },
    onError: (err: unknown) => {
      const msg =
        err instanceof Error ? err.message : "Thêm mới sản phẩm thất bại."
      toast.error(msg)
    },
  })
}

/**
 * Hook cập nhật sản phẩm với TanStack Query Mutation và Invalidate Cache chi tiết + danh sách
 */
export function useUpdateProductMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: ProductUpdateInput }) =>
      updateProduct(id, input),
    onSuccess: (updatedProduct) => {
      // Invalidate danh sách sản phẩm
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY })
      // Invalidate chi tiết sản phẩm cụ thể
      queryClient.invalidateQueries({
        queryKey: [PRODUCTS_QUERY_KEY[0], updatedProduct.id],
      })
      toast.success(`Đã cập nhật sản phẩm "${updatedProduct.name}".`)
    },
    onError: (err: unknown) => {
      const msg =
        err instanceof Error ? err.message : "Cập nhật sản phẩm thất bại."
      toast.error(msg)
    },
  })
}

/**
 * Hook xóa sản phẩm với TanStack Query Mutation và Invalidate Cache tự động
 */
export function useDeleteProductMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: (_, deletedId) => {
      // Invalidate toàn bộ cache danh sách sản phẩm
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY })
      queryClient.removeQueries({
        queryKey: [PRODUCTS_QUERY_KEY[0], deletedId],
      })
      toast.success("Đã xóa sản phẩm thành công khỏi hệ thống.")
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Xóa sản phẩm thất bại."
      toast.error(msg)
    },
  })
}
