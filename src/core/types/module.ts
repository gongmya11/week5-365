import type { ComponentType } from "react"
import type { LucideIcon } from "lucide-react"
import type { Role } from "@/core/auth/types"

export interface ModulePageProps {
  title: string
}

export interface ModuleRoute {
  path: string
  title: string
  icon: LucideIcon
  navigation?: boolean
  protected?: boolean
  allowedRoles?: Role[]
  load: () => Promise<{ default: ComponentType<ModulePageProps> }>
}

export interface AppModule {
  id: string
  title: string
  order: number
  icon: LucideIcon
  enabled?: boolean
  navigation?: boolean
  layout?: () => Promise<{ default: ComponentType<object> }>
  routes: ModuleRoute[]
}
