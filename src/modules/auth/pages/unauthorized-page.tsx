import { ShieldAlert, ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/core/components/ui/button"
import { Card } from "@/core/components/ui/card"
import { useAuthStore } from "@/core/auth/auth-store"
import { ROLE_LABELS } from "@/core/auth/types"

export default function UnauthorizedPage() {
  const { user } = useAuthStore()
  const roleInfo = user?.role ? ROLE_LABELS[user.role] : null

  return (
    <div className="flex min-h-[70vh] items-center justify-center p-4">
      <Card className="w-full max-w-md border-amber-200 bg-amber-50/40 p-6 text-center dark:border-amber-900/40 dark:bg-amber-950/20">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/60 dark:text-amber-400">
          <ShieldAlert className="size-8" />
        </div>

        <h1 className="mt-4 text-xl font-bold text-foreground">
          403 - Không có quyền truy cập
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Tài khoản của bạn không có đủ quyền để truy cập trang này hoặc thực
          hiện hành động vừa rồi.
        </p>

        {roleInfo && (
          <div className="mt-4 rounded-lg border border-border bg-card p-3 text-xs">
            <span className="text-muted-foreground">
              Vai trò hiện tại của bạn:{" "}
            </span>
            <span className="font-semibold text-foreground">
              {roleInfo.label}
            </span>
          </div>
        )}

        <div className="mt-6 flex justify-center gap-3">
          <Link to="/products">
            <Button className="gap-2 bg-blue-600 text-white hover:bg-blue-700">
              <ArrowLeft className="size-4" />
              Về trang sản phẩm
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}
