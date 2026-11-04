import { useQuery } from "@tanstack/react-query"
import { getProductById } from "../api/products-api"
import { PRODUCTS_QUERY_KEY } from "./use-products-query"

/**
 * Hook truy vấn chi tiết một sản phẩm theo ID bằng TanStack Query
 */
export function useProductQuery(id?: string) {
  return useQuery({
    queryKey: [PRODUCTS_QUERY_KEY[0], id],
    queryFn: () => getProductById(id!),
    enabled: Boolean(id), // Chỉ gửi query khi có id hợp lệ
    staleTime: 1000 * 60 * 5, // Dữ liệu chi tiết tươi trong 5 phút
  })
}
