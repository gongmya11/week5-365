import { ShoppingCart, X, Plus, Minus, Trash2, ArrowRight } from "lucide-react"
import { Button } from "@/core/components/ui/button"
import { useCartStore } from "../cart-store"
import { toast } from "sonner"

function formatVND(amount: number): string {
  if (isNaN(amount)) return "0"
  return new Intl.NumberFormat("vi-VN").format(amount)
}

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    clearCart,
    getTotalAmount,
    getTotalCount,
  } = useCartStore()

  if (!isOpen) return null

  const handleCheckout = () => {
    if (items.length === 0) return
    toast.success("Đặt hàng thành công! Đơn hàng đang được hệ thống xử lý.")
    clearCart()
    closeCart()
  }

  return (
    <div className="animate-fade-in fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs transition-opacity">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={closeCart} />

      {/* Drawer Content */}
      <div className="relative flex h-full w-full max-w-md flex-col bg-background shadow-2xl transition-transform">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
              <ShoppingCart className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">
                Giỏ hàng của bạn
              </h2>
              <p className="text-xs text-muted-foreground">
                {getTotalCount()} sản phẩm trong giỏ
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeCart}
            aria-label="Đóng giỏ hàng"
            className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-5">
          {items.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center text-center">
              <ShoppingCart className="mb-3 size-12 text-muted-foreground/40" />
              <p className="font-semibold text-foreground">
                Giỏ hàng đang trống
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Hãy thêm sản phẩm từ danh sách để tiếp tục mua sắm.
              </p>
            </div>
          ) : (
            items.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="flex items-center gap-3 rounded-xl border border-border p-3 transition-colors hover:bg-muted/30"
              >
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="size-16 shrink-0 rounded-lg border border-border object-cover"
                />

                <div className="min-w-0 flex-1">
                  <h4
                    className="truncate text-sm font-semibold text-foreground"
                    title={product.name}
                  >
                    {product.name}
                  </h4>
                  <p className="mt-0.5 text-xs font-bold text-blue-600">
                    {formatVND(product.price)} VNĐ
                  </p>

                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex items-center rounded-lg border border-border bg-background">
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="flex size-7 items-center justify-center text-muted-foreground hover:text-foreground"
                      >
                        <Minus className="size-3" />
                      </button>
                      <span className="w-8 text-center text-xs font-semibold text-foreground">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="flex size-7 items-center justify-center text-muted-foreground hover:text-foreground"
                      >
                        <Plus className="size-3" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(product.id)}
                      className="ml-auto p-1 text-muted-foreground hover:text-rose-600"
                      title="Xóa khỏi giỏ"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="space-y-3 border-t border-border bg-muted/20 p-4 sm:p-5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Tổng tiền thanh toán:
              </span>
              <span className="text-lg font-extrabold text-blue-600 dark:text-blue-400">
                {formatVND(getTotalAmount())} VNĐ
              </span>
            </div>

            <Button
              type="button"
              onClick={handleCheckout}
              className="h-11 w-full gap-2 bg-blue-600 text-sm font-bold text-white hover:bg-blue-700"
            >
              Tiến hành thanh toán
              <ArrowRight className="size-4" />
            </Button>

            <button
              type="button"
              onClick={clearCart}
              className="w-full pt-1 text-center text-xs text-muted-foreground hover:text-rose-600"
            >
              Xóa tất cả sản phẩm trong giỏ
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
