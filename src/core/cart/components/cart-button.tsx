import { ShoppingCart } from "lucide-react"
import { useCartStore } from "../cart-store"

export function CartButton() {
  const { toggleCart, getTotalCount } = useCartStore()
  const totalCount = getTotalCount()

  return (
    <button
      type="button"
      onClick={toggleCart}
      aria-label="Xem giỏ hàng"
      className="relative flex size-9 cursor-pointer items-center justify-center rounded-lg border border-border/80 bg-background text-foreground transition-colors hover:bg-muted"
      title="Giỏ hàng"
    >
      <ShoppingCart className="size-4" />
      {totalCount > 0 && (
        <span className="animate-scale-in absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-[11px] font-bold text-white shadow-xs">
          {totalCount > 99 ? "99+" : totalCount}
        </span>
      )}
    </button>
  )
}
