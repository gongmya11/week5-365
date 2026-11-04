import { type ComponentType, type ReactNode } from "react"
import { Can } from "./can"
import type { Permission, Role } from "../types"

/**
 * Higher-Order Component (HOC) Pattern: withPermission
 * Bọc bất kỳ component nào để kiểm tra quyền truy cập theo vai trò hoặc permission
 */
export function withPermission<P extends object>(
  WrappedComponent: ComponentType<P>,
  options: {
    roles?: Role | Role[]
    permissions?: Permission | Permission[]
    fallback?: ReactNode
  }
) {
  const ComponentWithPermission = (props: P) => {
    return (
      <Can
        role={options.roles}
        permission={options.permissions}
        fallback={options.fallback}
      >
        <WrappedComponent {...props} />
      </Can>
    )
  }

  ComponentWithPermission.displayName = `withPermission(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`

  return ComponentWithPermission
}
