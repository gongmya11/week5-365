import { type ReactNode } from "react"
import { useAuthStore } from "../auth-store"
import type { Permission, Role } from "../types"

interface CanProps {
  role?: Role | Role[]
  permission?: Permission | Permission[]
  fallback?: ReactNode
  children: ReactNode
}

/**
 * Component kiểm tra quyền hiển thị (Declarative Permission Gate)
 */
export function Can({ role, permission, fallback = null, children }: CanProps) {
  const { hasRole, hasPermission, isAuthenticated } = useAuthStore()

  if (!isAuthenticated) return <>{fallback}</>

  if (role && !hasRole(role)) {
    return <>{fallback}</>
  }

  if (permission && !hasPermission(permission)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
