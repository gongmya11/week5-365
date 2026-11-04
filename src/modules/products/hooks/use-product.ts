import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import {
  createProduct as apiCreateProduct,
  getProductById as apiGetProductById,
  updateProduct as apiUpdateProduct,
} from "../api/products-api"
import type {
  Product,
  ProductInput,
  ProductUpdateInput,
} from "../types/product"

export function useProduct(productId?: string) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadProduct = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiGetProductById(id)
      setProduct(data)
      return data
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Không thể tải thông tin chi tiết sản phẩm."
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (productId) {
      loadProduct(productId)
    }
  }, [productId, loadProduct])

  const create = async (input: ProductInput): Promise<Product | null> => {
    setSaving(true)
    try {
      const created = await apiCreateProduct(input)
      toast.success(`Đã thêm thành công sản phẩm "${created.name}".`)
      return created
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Thêm mới sản phẩm thất bại."
      toast.error(message)
      return null
    } finally {
      setSaving(false)
    }
  }

  const update = async (
    id: string,
    input: ProductUpdateInput
  ): Promise<Product | null> => {
    setSaving(true)
    try {
      const updated = await apiUpdateProduct(id, input)
      setProduct(updated)
      toast.success(`Đã cập nhật sản phẩm "${updated.name}".`)
      return updated
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Cập nhật sản phẩm thất bại."
      toast.error(message)
      return null
    } finally {
      setSaving(false)
    }
  }

  return {
    product,
    loading,
    saving,
    error,
    loadProduct,
    create,
    update,
  }
}
