import { useCallback, useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import {
  deleteProduct as apiDeleteProduct,
  getProducts,
} from "../api/products-api"
import type { Product, ProductFilterParams } from "../types/product"
import { exportProductsToExcel } from "../utils/export-excel"

export function useProducts(initialLimit = 5) {
  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(initialLimit)
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("")
  const [status, setStatus] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Lưu trữ AbortController hoặc cờ để tránh race conditions
  const activeRequestRef = useRef<number>(0)

  const fetchList = useCallback(
    async (paramsOverride?: Partial<ProductFilterParams>) => {
      const requestId = ++activeRequestRef.current
      setLoading(true)
      setError(null)

      const queryParams: ProductFilterParams = {
        page: paramsOverride?.page ?? page,
        limit: paramsOverride?.limit ?? limit,
        search:
          paramsOverride?.search !== undefined ? paramsOverride.search : search,
        category:
          paramsOverride?.category !== undefined
            ? paramsOverride.category
            : category,
        status:
          paramsOverride?.status !== undefined ? paramsOverride.status : status,
      }

      try {
        const response = await getProducts(queryParams)
        if (requestId === activeRequestRef.current) {
          setProducts(response.items)
          setTotal(response.total)
          setTotalPages(response.totalPages)
          setLoading(false)
        }
      } catch (err: unknown) {
        if (requestId === activeRequestRef.current) {
          const message =
            err instanceof Error
              ? err.message
              : "Không thể tải danh sách sản phẩm. Vui lòng kiểm tra lại kết nối mạng."
          setError(message)
          setLoading(false)
        }
      }
    },
    [page, limit, search, category, status]
  )

  useEffect(() => {
    fetchList()
  }, [fetchList])

  // Xóa sản phẩm
  const removeProduct = async (id: string, productName: string) => {
    setDeletingId(id)
    try {
      await apiDeleteProduct(id)
      toast.success(`Đã xóa thành công sản phẩm "${productName}".`)

      // Kiểm tra nếu trang hiện tại bị rỗng sau khi xóa
      if (products.length === 1 && page > 1) {
        setPage((prev) => prev - 1)
      } else {
        await fetchList()
      }
      return true
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Xóa sản phẩm thất bại."
      toast.error(message)
      return false
    } finally {
      setDeletingId(null)
    }
  }

  // Xuất file Excel
  const handleExportExcel = () => {
    if (products.length === 0) {
      toast.info("Không có dữ liệu để xuất file.")
      return
    }
    exportProductsToExcel(products, `danh-sach-san-pham-trang-${page}.csv`)
    toast.success("Đã xuất file dữ liệu thành công.")
  }

  return {
    products,
    total,
    totalPages,
    page,
    limit,
    search,
    category,
    status,
    loading,
    error,
    deletingId,
    setPage,
    setLimit,
    setSearch,
    setCategory,
    setStatus,
    fetchList,
    removeProduct,
    exportExcel: handleExportExcel,
  }
}
