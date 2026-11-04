import { useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import {
  ArrowLeft,
  Calendar,
  Layers,
  Pencil,
  RotateCcw,
  Tag,
  Trash2,
  AlertTriangle,
  ShoppingCart,
} from "lucide-react"
import { Button } from "@/core/components/ui/button"
import { Card } from "@/core/components/ui/card"
import { Can } from "@/core/auth/components/can"
import { useCartStore } from "@/core/cart/cart-store"
import { useProductQuery } from "../hooks/use-product-query"
import { useDeleteProductMutation } from "../hooks/use-products-query"
import { formatProductDate, formatVND } from "../utils/product-format"
import { ProductStatusBadge } from "../components/product-status-badge"
import { ProductDeleteDialog } from "../components/product-delete-dialog"

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  // 1. TanStack Query nạp dữ liệu chi tiết
  const {
    data: product,
    isLoading,
    isError,
    error,
    refetch,
  } = useProductQuery(id)

  // 2. TanStack Query Mutation xóa sản phẩm
  const deleteMutation = useDeleteProductMutation()

  // 3. Zustand Cart
  const { addItem: addToCart } = useCartStore()

  const [showDeleteModal, setShowDeleteModal] = useState(false)

  // Xóa sản phẩm từ trang chi tiết
  const handleDelete = async () => {
    if (!product) return
    try {
      await deleteMutation.mutateAsync(product.id)
      navigate("/products", { replace: true })
    } catch {
      // Error handled by mutation toast
    } finally {
      setShowDeleteModal(false)
    }
  }

  // 1. Trạng thái Đang tải (Loading Skeleton)
  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="h-8 w-40 animate-pulse rounded bg-muted"></div>
        <div className="grid grid-cols-1 gap-8 rounded-2xl border border-border bg-card p-6 md:grid-cols-2">
          <div className="aspect-square w-full animate-pulse rounded-xl bg-muted"></div>
          <div className="space-y-4">
            <div className="h-8 w-3/4 animate-pulse rounded bg-muted"></div>
            <div className="h-6 w-1/3 animate-pulse rounded bg-muted"></div>
            <div className="h-10 w-1/2 animate-pulse rounded bg-muted"></div>
            <div className="h-24 w-full animate-pulse rounded bg-muted"></div>
          </div>
        </div>
      </div>
    )
  }

  // 2. Trạng thái Lỗi (Error State)
  if (isError) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-rose-200 bg-rose-50/50 p-8 text-center dark:border-rose-900/50 dark:bg-rose-950/20">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-900/50 dark:text-rose-400">
          <AlertTriangle className="size-6" />
        </div>
        <h2 className="mt-3 text-lg font-bold text-rose-900 dark:text-rose-300">
          Lỗi tải thông tin sản phẩm
        </h2>
        <p className="mt-1 text-sm text-rose-700 dark:text-rose-400">
          {error?.message || "Không thể tải dữ liệu sản phẩm."}
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

  // 3. Trạng thái Không tìm thấy (Empty / Not Found)
  if (!product) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-8 text-center">
        <h2 className="text-lg font-bold text-foreground">
          Không tìm thấy sản phẩm
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Sản phẩm với mã #{id} không tồn tại hoặc đã bị xóa khỏi hệ thống.
        </p>
        <Button
          type="button"
          onClick={() => navigate("/products")}
          className="mt-5 gap-2 bg-blue-600 text-white hover:bg-blue-700"
        >
          <ArrowLeft className="size-4" />
          Quay lại danh sách sản phẩm
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Nút quay lại và thanh hành động */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Quay lại danh sách
        </Link>

        <div className="flex items-center gap-2">
          {/* Nút Thêm vào giỏ hàng */}
          <Button
            type="button"
            variant="outline"
            disabled={product.status === "Hết hàng"}
            onClick={() => addToCart(product)}
            className="gap-2 border-blue-200 text-blue-600 hover:bg-blue-50"
          >
            <ShoppingCart className="size-4" />
            Thêm vào giỏ
          </Button>

          {/* Nút Sửa (Phân quyền Admin/Editor) */}
          <Can role={["admin", "editor"]}>
            <Link to={`/products/${product.id}/edit`}>
              <Button
                type="button"
                className="gap-2 bg-blue-600 text-white hover:bg-blue-700"
              >
                <Pencil className="size-4" />
                Chỉnh sửa
              </Button>
            </Link>
          </Can>

          {/* Nút Xóa (Phân quyền Admin) */}
          <Can role="admin">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowDeleteModal(true)}
              className="gap-2 border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:border-rose-900/50 dark:hover:bg-rose-950/30"
            >
              <Trash2 className="size-4" />
              Xóa sản phẩm
            </Button>
          </Can>
        </div>
      </div>

      {/* Chi tiết sản phẩm card (Ứng dụng Compound Component Card) */}
      <Card className="overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Cột ảnh sản phẩm */}
          <div className="flex items-center justify-center border-b border-border bg-muted/20 p-8 md:border-r md:border-b-0">
            <div className="relative aspect-square w-full max-w-sm overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="size-full object-cover"
                onError={(e) => {
                  ;(e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80"
                }}
              />
            </div>
          </div>

          {/* Cột thông tin chi tiết */}
          <div className="flex flex-col justify-between p-6 sm:p-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  Mã SP: #{product.id}
                </span>
                <ProductStatusBadge status={product.status} />
              </div>

              <h1 className="text-2xl font-bold text-foreground">
                {product.name}
              </h1>

              <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">
                {formatVND(product.price)}{" "}
                <span className="text-sm font-normal text-muted-foreground">
                  VNĐ
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 border-y border-border py-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Tag className="size-4 text-blue-500" />
                  <span>Danh mục:</span>
                  <span className="font-semibold text-foreground">
                    {product.category}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Layers className="size-4 text-blue-500" />
                  <span>Số lượng:</span>
                  <span className="font-semibold text-foreground">
                    {product.quantity}
                  </span>
                </div>
                <div className="col-span-2 flex items-center gap-2 text-muted-foreground">
                  <Calendar className="size-4 text-blue-500" />
                  <span>Ngày tạo:</span>
                  <span className="font-semibold text-foreground">
                    {formatProductDate(product.createdAt)}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Mô tả sản phẩm
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {product.description || "Chưa có mô tả cho sản phẩm này."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Dialog xác nhận xóa */}
      <ProductDeleteDialog
        product={product}
        isOpen={showDeleteModal}
        isDeleting={deleteMutation.isPending}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
