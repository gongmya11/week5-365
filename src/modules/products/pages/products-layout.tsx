import { Outlet, Link, useLocation } from "react-router-dom"
import { Home } from "lucide-react"

export default function ProductsLayout() {
  const location = useLocation()
  const path = location.pathname

  // Xác định nhãn breadcrumb dựa trên đường dẫn hiện tại
  let currentBreadcrumb = "Danh sách"
  if (path === "/products/create" || path === "/products/new") {
    currentBreadcrumb = "Thêm sản phẩm mới"
  } else if (path.includes("/edit")) {
    currentBreadcrumb = "Chỉnh sửa sản phẩm"
  } else if (path !== "/products") {
    currentBreadcrumb = "Chi tiết sản phẩm"
  }

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16 dark:bg-background">
      {/* Container chung cho module Sản phẩm */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Breadcrumbs thanh điều hướng nhiều cấp */}
        <nav
          aria-label="Breadcrumb"
          className="mb-4 flex items-center text-xs font-medium text-muted-foreground"
        >
          <ol className="flex items-center space-x-2">
            <li>
              <Link
                to="/"
                className="flex items-center gap-1 transition-colors hover:text-foreground"
              >
                <Home className="size-3.5 text-muted-foreground" />
                <span>Trang chủ</span>
              </Link>
            </li>
            <li className="text-muted-foreground/60">/</li>
            <li>
              <Link
                to="/products"
                className={`transition-colors hover:text-foreground ${
                  path === "/products" ? "font-semibold text-foreground" : ""
                }`}
              >
                Sản phẩm
              </Link>
            </li>
            {path !== "/products" && (
              <>
                <li className="text-muted-foreground/60">/</li>
                <li className="font-semibold text-foreground">
                  {currentBreadcrumb}
                </li>
              </>
            )}
          </ol>
        </nav>

        {/* Nội dung trang con qua Nested Route Outlet */}
        <Outlet />
      </div>
    </div>
  )
}
