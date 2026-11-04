import { Package, PlusCircle } from "lucide-react"
import type { AppModule } from "@/core/types/module"

const productsModule: AppModule = {
  id: "products",
  title: "Sản phẩm",
  order: 1,
  icon: Package,
  layout: () => import("./pages/products-layout"),
  routes: [
    {
      path: "/products",
      title: "Quản lý sản phẩm",
      icon: Package,
      load: () => import("./pages/products-list-page"),
    },
    {
      path: "/products/create",
      title: "Thêm sản phẩm",
      icon: PlusCircle,
      navigation: false,
      protected: true,
      allowedRoles: ["admin", "editor"],
      load: () => import("./pages/product-create-page"),
    },
    {
      path: "/products/:id",
      title: "Chi tiết sản phẩm",
      icon: Package,
      navigation: false,
      load: () => import("./pages/product-detail-page"),
    },
    {
      path: "/products/:id/edit",
      title: "Chỉnh sửa sản phẩm",
      icon: Package,
      navigation: false,
      protected: true,
      allowedRoles: ["admin", "editor"],
      load: () => import("./pages/product-edit-page"),
    },
  ],
}

export default productsModule
