import { LogIn, LogOut } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/core/components/ui/button"
import { useAuthStore } from "../auth-store"
import { ROLE_LABELS } from "../types"
import { toast } from "sonner"

export function UserMenu() {
  const { user, isAuthenticated, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.info("Đã đăng xuất khỏi hệ thống.")
    navigate("/login")
  }

  if (!isAuthenticated || !user) {
    return (
      <Link to="/login">
        <Button
          size="sm"
          className="gap-1.5 bg-blue-600 text-white hover:bg-blue-700"
        >
          <LogIn className="size-4" />
          <span>Đăng nhập</span>
        </Button>
      </Link>
    )
  }

  const roleInfo = ROLE_LABELS[user.role]

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {/* User Info */}
      <div className="flex items-center gap-2">
        <img
          src={user.avatar}
          alt={user.name}
          className="size-8 rounded-full border border-border object-cover"
        />
        <div className="hidden flex-col sm:flex">
          <span className="text-xs leading-tight font-bold text-foreground">
            {user.name}
          </span>
          <span
            className={`py-0.2 mt-0.5 inline-block rounded border px-1.5 text-[10px] font-semibold ${roleInfo.badgeClass}`}
          >
            {user.role.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Nút Đăng xuất */}
      <Button
        variant="outline"
        size="icon-sm"
        onClick={handleLogout}
        title="Đăng xuất"
        className="size-8 text-muted-foreground hover:border-rose-300 hover:text-rose-600"
      >
        <LogOut className="size-4" />
      </Button>
    </div>
  )
}
