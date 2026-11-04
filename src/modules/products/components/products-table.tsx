import { Link } from "react-router-dom"
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Eye,
  Inbox,
  Pencil,
  RotateCcw,
  Trash2,
  ShoppingCart,
} from "lucide-react"
import { Button } from "@/core/components/ui/button"
import { Can } from "@/core/auth/components/can"
import type { Product } from "../types/product"
import { formatProductDate, formatVND } from "../utils/product-format"
import { ProductStatusBadge } from "./product-status-badge"

interface ProductsTableProps {
  products: Product[]
  total: number
  page: number
  limit: number
  totalPages: number
  loading: boolean
  error: string | null
  deletingId: string | null
  onPageChange: (newPage: number) => void
  onLimitChange: (newLimit: number) => void
  onDeleteClick: (product: Product) => void
  onAddToCart?: (product: Product) => void
  onRetry: () => void
  onResetFilter?: () => void
}

export function ProductsTable({
  products,
  total,
  page,
  limit,
  totalPages,
  loading,
  error,
  deletingId,
  onPageChange,
  onLimitChange,
  onDeleteClick,
  onAddToCart,
  onRetry,
  onResetFilter,
}: ProductsTableProps) {
  // 1. Trạng thái LỖI (Error State)
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-rose-200 bg-rose-50/50 p-8 text-center dark:border-rose-900/50 dark:bg-rose-950/20">
        <div className="flex size-12 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-900/50 dark:text-rose-400">
          <AlertTriangle className="size-6" />
        </div>
        <h3 className="mt-3 text-lg font-semibold text-rose-900 dark:text-rose-300">
          Không thể tải dữ liệu
        </h3>
        <p className="mt-1 max-w-md text-sm text-rose-700 dark:text-rose-400">
          {error}
        </p>
        <Button
          type="button"
          onClick={onRetry}
          className="mt-4 gap-2 bg-rose-600 text-white hover:bg-rose-700"
        >
          <RotateCcw className="size-4" />
          Thử lại
        </Button>
      </div>
    )
  }

  // 2. Trạng thái ĐANG TẢI (Loading State - Skeleton Table)
  if (loading && products.length === 0) {
    return (
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/50 text-xs font-semibold text-muted-foreground uppercase">
              <tr>
                <th className="px-4 py-3.5">#</th>
                <th className="px-4 py-3.5">Hình ảnh</th>
                <th className="px-4 py-3.5">Tên sản phẩm</th>
                <th className="px-4 py-3.5">Danh mục</th>
                <th className="px-4 py-3.5">Giá (VNĐ)</th>
                <th className="px-4 py-3.5">Số lượng</th>
                <th className="px-4 py-3.5">Trạng thái</th>
                <th className="px-4 py-3.5">Ngày tạo</th>
                <th className="px-4 py-3.5 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {Array.from({ length: limit || 5 }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td className="px-4 py-3">
                    <div className="h-4 w-4 rounded bg-muted"></div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="size-10 rounded-lg bg-muted"></div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 w-32 rounded bg-muted"></div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 w-20 rounded bg-muted"></div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 w-24 rounded bg-muted"></div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 w-12 rounded bg-muted"></div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-5 w-16 rounded-full bg-muted"></div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 w-20 rounded bg-muted"></div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="inline-flex gap-1.5">
                      <div className="size-8 rounded-lg bg-muted"></div>
                      <div className="size-8 rounded-lg bg-muted"></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  // 3. Trạng thái KHÔNG CÓ DỮ LIỆU (Empty State)
  if (!loading && products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card p-12 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Inbox className="size-7" />
        </div>
        <h3 className="mt-4 text-base font-semibold text-foreground">
          Không tìm thấy sản phẩm nào
        </h3>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Không có sản phẩm nào phù hợp với điều kiện tìm kiếm và bộ lọc hiện
          tại.
        </p>
        {onResetFilter && (
          <Button
            type="button"
            variant="outline"
            onClick={onResetFilter}
            className="mt-4 gap-2"
          >
            <RotateCcw className="size-4" />
            Xóa bộ lọc
          </Button>
        )}
      </div>
    )
  }

  // Tạo mảng số trang hiển thị
  const pageNumbers: number[] = []
  const maxButtons = 5
  let startPage = Math.max(1, page - Math.floor(maxButtons / 2))
  let endPage = startPage + maxButtons - 1

  if (endPage > totalPages) {
    endPage = totalPages
    startPage = Math.max(1, endPage - maxButtons + 1)
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i)
  }

  // Tính số thứ tự bắt đầu
  const startIndex = (page - 1) * limit

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="border-b border-border bg-muted/40 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              <tr>
                <th className="w-12 px-4 py-3.5 text-center">#</th>
                <th className="w-16 px-4 py-3.5">Hình ảnh</th>
                <th className="px-4 py-3.5">Tên sản phẩm</th>
                <th className="px-4 py-3.5">Danh mục</th>
                <th className="px-4 py-3.5">Giá (VNĐ)</th>
                <th className="px-4 py-3.5 text-center">Số lượng</th>
                <th className="px-4 py-3.5">Trạng thái</th>
                <th className="px-4 py-3.5">Ngày tạo</th>
                <th className="px-4 py-3.5 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((item, index) => {
                const isItemDeleting = deletingId === item.id
                return (
                  <tr
                    key={item.id}
                    className="group transition-colors hover:bg-muted/40"
                  >
                    <td className="px-4 py-3 text-center text-xs font-medium text-muted-foreground">
                      {startIndex + index + 1}
                    </td>
                    <td className="px-4 py-3">
                      <div className="size-10 overflow-hidden rounded-lg border border-border bg-muted/60">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="size-full object-cover transition-transform group-hover:scale-105"
                            onError={(e) => {
                              // Fallback nếu ảnh không load được
                              ;(e.target as HTMLElement).style.display = "none"
                            }}
                          />
                        ) : (
                          <div className="flex size-full items-center justify-center text-xs font-bold text-muted-foreground">
                            {item.name.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        to={`/products/${item.id}`}
                        className="block max-w-xs truncate font-medium text-foreground transition-colors hover:text-primary"
                        title={item.name}
                      >
                        {item.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {item.category}
                    </td>
                    <td className="px-4 py-3 font-semibold text-foreground">
                      {formatVND(item.price)}
                    </td>
                    <td className="px-4 py-3 text-center font-medium">
                      {item.quantity}
                    </td>
                    <td className="px-4 py-3">
                      <ProductStatusBadge status={item.status} />
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {formatProductDate(item.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="inline-flex items-center gap-1.5">
                        {/* Nút Thêm vào giỏ hàng */}
                        {onAddToCart && (
                          <button
                            type="button"
                            onClick={() => onAddToCart(item)}
                            aria-label={`Thêm ${item.name} vào giỏ hàng`}
                            disabled={item.status === "Hết hàng"}
                            className="flex size-8 cursor-pointer items-center justify-center rounded-lg border border-blue-200 bg-blue-50/60 text-blue-600 transition-colors hover:bg-blue-100 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-blue-900/40 dark:bg-blue-950/30 dark:text-blue-400"
                            title={
                              item.status === "Hết hàng"
                                ? "Hết hàng"
                                : "Thêm vào giỏ hàng"
                            }
                          >
                            <ShoppingCart className="size-3.5" />
                          </button>
                        )}

                        {/* Nút Xem chi tiết */}
                        <Link
                          to={`/products/${item.id}`}
                          aria-label={`Xem chi tiết ${item.name}`}
                          className="flex size-8 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                          title="Xem chi tiết"
                        >
                          <Eye className="size-4" />
                        </Link>

                        {/* Nút Chỉnh sửa (Chỉ Admin và Editor) */}
                        <Can role={["admin", "editor"]}>
                          <Link
                            to={`/products/${item.id}/edit`}
                            aria-label={`Chỉnh sửa ${item.name}`}
                            className="flex size-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs transition-colors hover:bg-blue-700"
                            title="Chỉnh sửa sản phẩm"
                          >
                            <Pencil className="size-3.5" />
                          </Link>
                        </Can>

                        {/* Nút Xóa (Chỉ Admin mới có quyền xóa) */}
                        <Can role="admin">
                          <button
                            type="button"
                            disabled={isItemDeleting}
                            onClick={() => onDeleteClick(item)}
                            aria-label={`Xóa ${item.name}`}
                            className="flex size-8 cursor-pointer items-center justify-center rounded-lg bg-rose-600 text-white shadow-xs transition-colors hover:bg-rose-700 disabled:opacity-50"
                            title="Xóa sản phẩm"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </Can>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Phân trang (Pagination) */}
      <div className="flex flex-col items-center justify-between gap-4 py-2 sm:flex-row">
        {/* Số bản ghi mỗi trang */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Hiển thị</span>
          <select
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="h-8 rounded-lg border border-input bg-background px-2.5 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <span>bản ghi mỗi trang</span>
          <span className="hidden text-xs text-muted-foreground md:inline">
            (Tổng số {total} sản phẩm)
          </span>
        </div>

        {/* Nút chuyển trang */}
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            aria-label="Trang trước"
            className="size-8"
          >
            <ChevronLeft className="size-4" />
          </Button>

          {pageNumbers.map((p) => (
            <Button
              key={p}
              type="button"
              variant={page === p ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(p)}
              className={`size-8 p-0 text-xs font-semibold ${
                page === p
                  ? "border-blue-600 bg-blue-600 text-white hover:bg-blue-700"
                  : "text-foreground"
              }`}
            >
              {p}
            </Button>
          ))}

          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            aria-label="Trang tiếp theo"
            className="size-8"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
