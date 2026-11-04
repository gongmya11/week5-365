export type Role = "admin" | "editor" | "viewer"

export type Permission =
  | "product:read"
  | "product:create"
  | "product:update"
  | "product:delete"
  | "cart:manage"

export interface User {
  id: string
  name: string
  email: string
  role: Role
  permissions: Permission[]
  avatar: string
}

export interface LoginResponse {
  token: string
  user: User
}

export interface LoginCredentials {
  email: string
  password: string
}

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: [
    "product:read",
    "product:create",
    "product:update",
    "product:delete",
    "cart:manage",
  ],
  editor: ["product:read", "product:create", "product:update", "cart:manage"],
  viewer: ["product:read", "cart:manage"],
}

export const ROLE_LABELS: Record<Role, { label: string; badgeClass: string }> =
  {
    admin: {
      label: "Quản trị viên (Admin)",
      badgeClass:
        "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800",
    },
    editor: {
      label: "Biên tập viên (Editor)",
      badgeClass:
        "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800",
    },
    viewer: {
      label: "Người xem (Viewer)",
      badgeClass:
        "bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-900/60 dark:text-slate-300 dark:border-slate-700",
    },
  }
