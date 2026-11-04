import { type ReactNode } from "react"
import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuthStore } from "../auth-store"
import type { Permission, Role } from "../types"

interface ProtectedRouteProps {
  allowedRoles?: Role[]
  requiredPermissions?: Permission[]
  children?: ReactNode
}

export function ProtectedRoute({
  allowedRoles,
  requiredPermissions,
  children,
}: ProtectedRouteProps) {
  const { isAuthenticated, hasRole, hasPermission } = useAuthStore()
  const location = useLocation()

  // 1. Chưa đăng nhập -> Chuyển hướng sang /login và lưu lại trang đích để redirect sau khi login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // 2. Kiểm tra Role
  if (allowedRoles && allowedRoles.length > 0 && !hasRole(allowedRoles)) {
    return <Navigate to="/unauthorized" replace />
  }

  // 3. Kiểm tra Permission
  if (
    requiredPermissions &&
    requiredPermissions.length > 0 &&
    !hasPermission(requiredPermissions)
  ) {
    return <Navigate to="/unauthorized" replace />
  }

  // 4. Đạt quyền -> Render children nếu có hoặc Outlet
  return children ? <>{children}</> : <Outlet />
}
