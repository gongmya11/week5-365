import { create } from "zustand"
import { persist } from "zustand/middleware"
import { toast } from "sonner"

export interface CartProduct {
  id: string
  name: string
  price: number
  imageUrl: string
  category?: string
}

export interface CartItem {
  product: CartProduct
  quantity: number
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  addItem: (product: CartProduct, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getTotalCount: () => number
  getTotalAmount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      addItem: (product: CartProduct, quantity = 1) => {
        const { items } = get()
        const existingIndex = items.findIndex(
          (i) => i.product.id === product.id
        )

        if (existingIndex > -1) {
          const updatedItems = [...items]
          updatedItems[existingIndex].quantity += quantity
          set({ items: updatedItems })
        } else {
          set({ items: [...items, { product, quantity }] })
        }

        toast.success(`Đã thêm "${product.name}" vào giỏ hàng.`)
      },

      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((i) => i.product.id !== productId),
        }))
        toast.info("Đã xóa sản phẩm khỏi giỏ hàng.")
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.product.id === productId ? { ...i, quantity } : i
          ),
        }))
      },

      clearCart: () => {
        set({ items: [] })
        toast.info("Đã làm trống giỏ hàng.")
      },

      getTotalCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0)
      },

      getTotalAmount: () => {
        return get().items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        )
      },
    }),
    {
      name: "shopping-cart-storage",
      partialize: (state) => ({ items: state.items }),
    }
  )
)
