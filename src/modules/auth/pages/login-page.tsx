import React, { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { LogIn, LoaderCircle, ShieldCheck, UserCheck, Eye } from "lucide-react"
import { Button } from "@/core/components/ui/button"
import { Input } from "@/core/components/ui/input"
import { Card } from "@/core/components/ui/card"
import { useAuthStore } from "@/core/auth/auth-store"
import { loginApi } from "@/core/auth/auth-api"
import { toast } from "sonner"
import type { Role } from "@/core/auth/types"

export default function LoginPage() {
  const [email, setEmail] = useState("admin@example.com")
  const [password, setPassword] = useState("admin123")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { login } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  // Trang cần quay lại sau khi đăng nhập thành công
  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname ||
    "/products"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError("Vui lòng nhập đầy đủ Email và Mật khẩu.")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await loginApi({ email, password })
      login(response.token, response.user)
      toast.success(`Đăng nhập thành công! Chào mừng ${response.user.name}.`)
      navigate(from, { replace: true })
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Đăng nhập thất bại. Vui lòng kiểm tra lại."
      setError(msg)
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  // Tiện ích đăng nhập nhanh với các vai trò khác nhau để kiểm thử
  const handleQuickLogin = (role: Role) => {
    switch (role) {
      case "admin":
        setEmail("admin@example.com")
        setPassword("admin123")
        break
      case "editor":
        setEmail("editor@example.com")
        setPassword("editor123")
        break
      case "viewer":
        setEmail("viewer@example.com")
        setPassword("viewer123")
        break
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      {/* Ứng dụng Compound Component Card Pattern */}
      <Card className="w-full max-w-md border-border/80 shadow-lg">
        <Card.Header className="text-center">
          <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
            <LogIn className="size-6" />
          </div>
          <Card.Title>Đăng nhập hệ thống</Card.Title>
          <Card.Description>
            Đăng nhập để quản lý sản phẩm và mua hàng (Tuần 6)
          </Card.Description>
        </Card.Header>

        <Card.Content>
          {error && (
            <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase">
                Email tài khoản
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                disabled={isLoading}
                className="mt-1 h-10"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase">
                Mật khẩu
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isLoading}
                className="mt-1 h-10"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="h-10 w-full gap-2 bg-blue-600 font-semibold text-white hover:bg-blue-700"
            >
              {isLoading ? (
                <>
                  <LoaderCircle className="size-4 animate-spin" />
                  Đang xác thực...
                </>
              ) : (
                <>
                  <LogIn className="size-4" />
                  Đăng nhập
                </>
              )}
            </Button>
          </form>

          {/* Khu vực chọn nhanh tài khoản kiểm thử Role */}
          <div className="mt-6 border-t border-border pt-4">
            <p className="mb-2 text-center text-xs font-medium text-muted-foreground">
              ⚡ Chọn nhanh tài khoản để kiểm thử phân quyền:
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin("admin")}
                className="flex flex-col items-center rounded-lg border border-purple-200 bg-purple-50/60 p-2 text-center text-xs text-purple-700 transition-colors hover:bg-purple-100 dark:border-purple-900/50 dark:bg-purple-950/20 dark:text-purple-300"
              >
                <ShieldCheck className="mb-1 size-4" />
                <span className="font-bold">Admin</span>
                <span className="text-[10px] text-muted-foreground">
                  Toàn quyền
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin("editor")}
                className="flex flex-col items-center rounded-lg border border-blue-200 bg-blue-50/60 p-2 text-center text-xs text-blue-700 transition-colors hover:bg-blue-100 dark:border-blue-900/50 dark:bg-blue-950/20 dark:text-blue-300"
              >
                <UserCheck className="mb-1 size-4" />
                <span className="font-bold">Editor</span>
                <span className="text-[10px] text-muted-foreground">
                  Không xóa
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin("viewer")}
                className="flex flex-col items-center rounded-lg border border-slate-200 bg-slate-50/60 p-2 text-center text-xs text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-300"
              >
                <Eye className="mb-1 size-4" />
                <span className="font-bold">Viewer</span>
                <span className="text-[10px] text-muted-foreground">
                  Chỉ xem
                </span>
              </button>
            </div>
          </div>
        </Card.Content>
      </Card>
    </div>
  )
}
