import { useState } from "react"
import { Download, Package, Plus, SlidersHorizontal } from "lucide-react"
import { Button } from "@/core/components/ui/button"
import { Card } from "@/core/components/ui/card"
import { Can } from "@/core/auth/components/can"
import { useCartStore } from "@/core/cart/cart-store"
import {
  useProductsQuery,
  useCreateProductMutation,
  useDeleteProductMutation,
} from "../hooks/use-products-query"
import type { Product, ProductInput } from "../types/product"
import { ProductForm } from "../components/product-form"
import { ProductsFilter } from "../components/products-filter"
import { ProductsTable } from "../components/products-table"
import { ProductDeleteDialog } from "../components/product-delete-dialog"
import { exportProductsToExcel } from "../utils/export-excel"
import { toast } from "sonner"

export default function ProductsListPage() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(5)
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("")
  const [status, setStatus] = useState("")

  // 1. TanStack Query để truy vấn dữ liệu và đồng bộ cache
  const { data, isLoading, isError, error, refetch } = useProductsQuery({
    page,
    limit,
    search: search || undefined,
    category: category || undefined,
    status: status || undefined,
  })

  // 2. TanStack Query Mutations
  const createMutation = useCreateProductMutation()
  const deleteMutation = useDeleteProductMutation()

  // 3. Zustand Global Cart
  const { addItem: addToCart } = useCartStore()

  // State quản lý xóa sản phẩm
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)

  const products = data?.items || []
  const total = data?.total || 0
  const totalPages = data?.totalPages || 1

  // Tạo sản phẩm nhanh
  const handleCreateProduct = async (input: ProductInput) => {
    try {
      await createMutation.mutateAsync(input)
      setPage(1)
      return true
    } catch {
      return false
    }
  }

  // Xác nhận xóa sản phẩm
  const handleConfirmDelete = async () => {
    if (!productToDelete) return
    try {
      await deleteMutation.mutateAsync(productToDelete.id)
      setProductToDelete(null)
      // Tự động lùi 1 trang nếu xóa bản ghi cuối cùng của trang
      if (products.length === 1 && page > 1) {
        setPage((p) => p - 1)
      }
    } catch {
      // Error handled by mutation
    }
  }

  const handleFilterChange = (filters: {
    search: string
    category: string
    status: string
  }) => {
    setSearch(filters.search)
    setCategory(filters.category)
    setStatus(filters.status)
    setPage(1)
  }

  const handleResetFilter = () => {
    setSearch("")
    setCategory("")
    setStatus("")
    setPage(1)
  }

  const handleExportExcel = () => {
    if (products.length === 0) {
      toast.info("Không có dữ liệu để xuất file.")
      return
    }
    exportProductsToExcel(products, `danh-sach-san-pham-trang-${page}.csv`)
    toast.success("Đã xuất file dữ liệu thành công.")
  }

  return (
    <div className="space-y-6">
      {/* 1. Header Trang Quản Lý Sản Phẩm */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
            <SlidersHorizontal className="size-5.5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Quản lý sản phẩm
            </h1>
            <p className="text-xs text-muted-foreground sm:text-sm">
              CRUD TanStack Query, Global State Zustand & Phân quyền Role (Tuần
              6)
            </p>
          </div>
        </div>
      </div>

      {/* 2. Card: Thêm sản phẩm mới (Ứng dụng Compound Component Card & Phân quyền Can role Admin/Editor) */}
      <Can
        role={["admin", "editor"]}
        fallback={
          <div className="rounded-xl border border-dashed border-border bg-muted/20 p-4 text-center text-xs text-muted-foreground">
            💡 Bạn đang đăng nhập với quyền <strong>Viewer</strong> (Chỉ xem).
            Hãy đăng nhập tài khoản <strong>Admin</strong> hoặc{" "}
            <strong>Editor</strong> để thêm và chỉnh sửa sản phẩm.
          </div>
        }
      >
        <Card>
          <Card.Header>
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                <Plus className="size-5" />
              </div>
              <div>
                <Card.Title className="text-base sm:text-base">
                  Thêm sản phẩm mới
                </Card.Title>
                <Card.Description>
                  Điền đầy đủ thông tin để thêm sản phẩm vào hệ thống (TanStack
                  Mutation)
                </Card.Description>
              </div>
            </div>
          </Card.Header>
          <Card.Content>
            <ProductForm
              isSubmitting={createMutation.isPending}
              onSubmit={handleCreateProduct}
            />
          </Card.Content>
        </Card>
      </Can>

      {/* 3. Card: Danh sách sản phẩm (Compound Component Card) */}
      <Card>
        <Card.Header>
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                <Package className="size-5" />
              </div>
              <div>
                <Card.Title className="text-base sm:text-base">
                  Danh sách sản phẩm
                </Card.Title>
                <Card.Description>
                  Tổng số {total} sản phẩm trong hệ thống
                </Card.Description>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleExportExcel}
              className="gap-2 self-start border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700 sm:self-auto dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-950/40"
            >
              <Download className="size-4" />
              Xuất Excel
            </Button>
          </div>
        </Card.Header>

        <Card.Content className="space-y-4">
          {/* Thanh tìm kiếm và bộ lọc */}
          <ProductsFilter
            initialSearch={search}
            initialCategory={category}
            initialStatus={status}
            onFilterChange={handleFilterChange}
          />

          {/* Bảng sản phẩm TanStack Query */}
          <ProductsTable
            products={products}
            total={total}
            page={page}
            limit={limit}
            totalPages={totalPages}
            loading={isLoading}
            error={isError ? error?.message || "Lỗi tải dữ liệu" : null}
            deletingId={
              deleteMutation.isPending ? productToDelete?.id || null : null
            }
            onPageChange={setPage}
            onLimitChange={(newLimit) => {
              setLimit(newLimit)
              setPage(1)
            }}
            onDeleteClick={(prod) => setProductToDelete(prod)}
            onAddToCart={(prod) => addToCart(prod)}
            onRetry={() => refetch()}
            onResetFilter={handleResetFilter}
          />
        </Card.Content>
      </Card>

      {/* Modal xác nhận xóa */}
      <ProductDeleteDialog
        product={productToDelete}
        isOpen={Boolean(productToDelete)}
        isDeleting={deleteMutation.isPending}
        onClose={() => setProductToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
