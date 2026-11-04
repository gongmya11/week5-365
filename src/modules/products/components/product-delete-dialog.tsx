import { LoaderCircle, Trash2 } from "lucide-react"
import { Button } from "@/core/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/core/components/ui/dialog"
import type { Product } from "../types/product"

interface ProductDeleteDialogProps {
  product: Product | null
  isOpen: boolean
  isDeleting: boolean
  onClose: () => void
  onConfirm: () => void
}

export function ProductDeleteDialog({
  product,
  isOpen,
  isDeleting,
  onClose,
  onConfirm,
}: ProductDeleteDialogProps) {
  if (!product) return null

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && !isDeleting && onClose()}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
              <Trash2 className="size-5" />
            </div>
            <div>
              <DialogTitle>Xác nhận xóa sản phẩm</DialogTitle>
              <DialogDescription className="mt-1 text-sm text-muted-foreground">
                Thao tác này sẽ xóa vĩnh viễn sản phẩm khỏi hệ thống.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="my-3 rounded-lg border border-border bg-muted/40 p-3.5 text-sm">
          <p className="text-muted-foreground">
            Bạn có chắc chắn muốn xóa sản phẩm sau?
          </p>
          <p className="mt-1 font-semibold text-foreground">{product.name}</p>
          <p className="text-xs text-muted-foreground">
            Mã SP: #{product.id} • Danh mục: {product.category}
          </p>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            disabled={isDeleting}
            onClick={onClose}
          >
            Hủy bỏ
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={isDeleting}
            onClick={onConfirm}
            className="gap-2 bg-rose-600 text-white hover:bg-rose-700"
          >
            {isDeleting ? (
              <>
                <LoaderCircle className="size-4 animate-spin" />
                Đang xóa...
              </>
            ) : (
              "Xác nhận xóa"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
