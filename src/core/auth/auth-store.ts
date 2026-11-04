import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Permission, Role, User } from "./types"

interface AuthStore {
  token: string | null
  user: User | null
  isAuthenticated: boolean
  login: (token: string, user: User) => void
  logout: () => void
  hasRole: (roles: Role | Role[]) => boolean
  hasPermission: (permissions: Permission | Permission[]) => boolean
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      login: (token: string, user: User) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("token", token)
        }
        set({
          token,
          user,
          isAuthenticated: true,
        })
      },

      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("token")
        }
        set({
          token: null,
          user: null,
          isAuthenticated: false,
        })
      },

      hasRole: (roles: Role | Role[]) => {
        const user = get().user
        if (!user) return false
        const roleList = Array.isArray(roles) ? roles : [roles]
        return roleList.includes(user.role)
      },

      hasPermission: (permissions: Permission | Permission[]) => {
        const user = get().user
        if (!user) return false
        const permList = Array.isArray(permissions)
          ? permissions
          : [permissions]
        return permList.every((p) => user.permissions.includes(p))
      },
    }),
    {
      name: "auth-storage",
    }
  )
)
