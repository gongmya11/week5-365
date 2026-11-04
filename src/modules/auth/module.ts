import { KeyRound, ShieldAlert } from "lucide-react"
import type { AppModule } from "@/core/types/module"

const authModule: AppModule = {
  id: "auth",
  title: "Xác thực",
  order: 99,
  icon: KeyRound,
  navigation: false,
  routes: [
    {
      path: "/login",
      title: "Đăng nhập",
      icon: KeyRound,
      navigation: false,
      load: () => import("./pages/login-page"),
    },
    {
      path: "/unauthorized",
      title: "Không có quyền truy cập",
      icon: ShieldAlert,
      navigation: false,
      load: () => import("./pages/unauthorized-page"),
    },
  ],
}

export default authModule
