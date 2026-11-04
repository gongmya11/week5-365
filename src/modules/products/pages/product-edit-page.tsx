import { useParams, useNavigate, Link } from "react-router-dom"
import { ArrowLeft, Edit3, RotateCcw, AlertTriangle } from "lucide-react"
import { Button } from "@/core/components/ui/button"
import { Card } from "@/core/components/ui/card"
import { useProductQuery } from "../hooks/use-product-query"
import { useUpdateProductMutation } from "../hooks/use-products-query"
import type { ProductInput } from "../types/product"
import { ProductForm } from "../components/product-form"

export default function ProductEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  // 1. TanStack Query nạp dữ liệu cần sửa
  const {
    data: product,
    isLoading,
    isError,
    error,
    refetch,
  } = useProductQuery(id)

  // 2. TanStack Query Mutation cập nhật
  const updateMutation = useUpdateProductMutation()

  const handleUpdate = async (input: ProductInput) => {
    if (!id) return
    try {
      await updateMutation.mutateAsync({ id, input })
      navigate(`/products/${id}`)
    } catch {
      // Error handled by mutation
    }
  }

  // 1. Trạng thái Đang tải dữ liệu ban đầu
  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <div className="h-6 w-32 animate-pulse rounded bg-muted"></div>
        <div className="space-y-4 rounded-2xl border border-border bg-card p-6">
          <div className="h-8 w-48 animate-pulse rounded bg-muted"></div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="h-10 animate-pulse rounded bg-muted"></div>
            <div className="h-10 animate-pulse rounded bg-muted"></div>
            <div className="h-10 animate-pulse rounded bg-muted"></div>
          </div>
          <div className="h-20 animate-pulse rounded bg-muted"></div>
        </div>
      </div>
    )
  }

  // 2. Trạng thái Lỗi khi tải
  if (isError) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-rose-200 bg-rose-50/50 p-8 text-center dark:border-rose-900/50 dark:bg-rose-950/20">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-900/50 dark:text-rose-400">
          <AlertTriangle className="size-6" />
        </div>
        <h2 className="mt-3 text-lg font-bold text-rose-900 dark:text-rose-300">
          Không tìm thấy thông tin sản phẩm để sửa
        </h2>
        <p className="mt-1 text-sm text-rose-700 dark:text-rose-400">
          {error?.message || "Không thể tải thông tin sản phẩm."}
        </p>
        <div className="mt-5 flex items-center justify-center gap-3">
          <Button
            type="button"
            onClick={() => refetch()}
            className="gap-2 bg-rose-600 text-white hover:bg-rose-700"
          >
            <RotateCcw className="size-4" />
            Thử lại
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/products")}
          >
            Về danh sách
          </Button>
        </div>
      </div>
    )
  }

  // 3. Trạng thái Không có sản phẩm
  if (!product) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-8 text-center">
        <h2 className="text-lg font-bold text-foreground">
          Sản phẩm không tồn tại
        </h2>
        <Button
          type="button"
          onClick={() => navigate("/products")}
          className="mt-4 gap-2 bg-blue-600 text-white hover:bg-blue-700"
        >
          <ArrowLeft className="size-4" />
          Quay lại danh sách
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Quay lại */}
      <div>
        <Link
          to={`/products/${product.id}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Quay lại chi tiết #{product.id}
        </Link>
      </div>

      <Card>
        <Card.Header>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
              <Edit3 className="size-5" />
            </div>
            <div>
              <Card.Title>Chỉnh sửa sản phẩm</Card.Title>
              <Card.Description>
                Mã sản phẩm: #{product.id} • {product.name} (TanStack Mutation)
              </Card.Description>
            </div>
          </div>
        </Card.Header>

        <Card.Content>
          <ProductForm
            initialData={product}
            isSubmitting={updateMutation.isPending}
            isEditMode={true}
            onSubmit={handleUpdate}
            onReset={() => navigate(`/products/${product.id}`)}
          />
        </Card.Content>
      </Card>
    </div>
  )
}
