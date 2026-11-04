import { lazy, Suspense } from "react"
import { Navigate, Outlet, Route, Routes } from "react-router-dom"
import { SiteHeader } from "@/core/components/site-header"
import { EmptyModules, NotFound } from "@/core/components/app-states"
import { PageLoading } from "@/core/components/page-loading"
import { CartDrawer } from "@/core/cart/components/cart-drawer"
import { ProtectedRoute } from "@/core/auth/components/protected-route"
import { availableModules, defaultPath } from "./registry"

function MainLayout() {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <Suspense fallback={<PageLoading />}>
          <Outlet />
        </Suspense>
      </main>
      {/* Drawer Giỏ hàng toàn cục */}
      <CartDrawer />
    </div>
  )
}

/**
 * Public shell: Quản lý và render routing nhiều cấp (nested route).
 * Hỗ trợ Protected Route theo trạng thái đăng nhập và phân quyền Role/Permission.
 */
export function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Điều hướng mặc định về defaultPath */}
        <Route
          path="/"
          element={
            defaultPath ? (
              <Navigate to={defaultPath} replace />
            ) : (
              <EmptyModules />
            )
          }
        />

        {/* Render các module và hệ thống nested route tương ứng */}
        {availableModules.map((module) => {
          if (module.layout) {
            const ModuleLayout = lazy(module.layout)
            return (
              <Route
                key={module.id}
                path={module.id}
                element={<ModuleLayout />}
              >
                {module.routes.map((route) => {
                  const Page = lazy(route.load)
                  const subPath = route.path.replace(
                    new RegExp(`^/${module.id}/?`),
                    ""
                  )

                  const pageElement =
                    route.protected || route.allowedRoles ? (
                      <ProtectedRoute allowedRoles={route.allowedRoles}>
                        <Page title={route.title} />
                      </ProtectedRoute>
                    ) : (
                      <Page title={route.title} />
                    )

                  return (
                    <Route
                      key={route.path}
                      index={subPath === ""}
                      path={subPath === "" ? undefined : subPath}
                      element={pageElement}
                    />
                  )
                })}
              </Route>
            )
          }

          // Trường hợp module không dùng layout riêng
          return module.routes.map((route) => {
            const Page = lazy(route.load)
            const pageElement =
              route.protected || route.allowedRoles ? (
                <ProtectedRoute allowedRoles={route.allowedRoles}>
                  <Page title={route.title} />
                </ProtectedRoute>
              ) : (
                <Page title={route.title} />
              )

            return (
              <Route key={route.path} path={route.path} element={pageElement} />
            )
          })
        })}

        {/* Route 404 cho các đường dẫn không tồn tại */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
