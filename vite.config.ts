import { resolve } from "node:path"
import type { IncomingMessage, ServerResponse } from "node:http"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig, type Plugin } from "vite"
import { INITIAL_PRODUCTS } from "./src/modules/products/types/initial-products.ts"
import type { Product } from "./src/modules/products/types/product.ts"

function mockApiPlugin(): Plugin {
  // Bộ nhớ đệm danh sách sản phẩm phục vụ REST API
  const products: Product[] = JSON.parse(JSON.stringify(INITIAL_PRODUCTS))

  // Danh sách tài khoản mẫu phân quyền
  const USERS = [
    {
      id: "user-1",
      name: "Nguyễn Văn Admin",
      email: "admin@example.com",
      role: "admin",
      permissions: [
        "product:read",
        "product:create",
        "product:update",
        "product:delete",
        "cart:manage",
      ],
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&q=80",
    },
    {
      id: "user-2",
      name: "Trần Thị Editor",
      email: "editor@example.com",
      role: "editor",
      permissions: [
        "product:read",
        "product:create",
        "product:update",
        "cart:manage",
      ],
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=80",
    },
    {
      id: "user-3",
      name: "Lê Văn Viewer",
      email: "viewer@example.com",
      role: "viewer",
      permissions: ["product:read", "cart:manage"],
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&q=80",
    },
  ]

  return {
    name: "vite-mock-products-api",
    configureServer(server) {
      server.middlewares.use(
        async (req: IncomingMessage, res: ServerResponse, next) => {
          const url = req.url || ""

          // Chỉ chặn các yêu cầu gửi đến /api/v1
          if (!url.startsWith("/api/v1")) {
            return next()
          }

          // Mô phỏng độ trễ mạng thực tế 250ms
          await new Promise((resolveDelay) => setTimeout(resolveDelay, 250))

          const parsedUrl = new URL(url, "http://localhost")
          const pathname = parsedUrl.pathname
          const method = req.method?.toUpperCase() || "GET"

          // === AUTH ENDPOINTS ===
          // POST /api/v1/auth/login
          if (method === "POST" && pathname === "/api/v1/auth/login") {
            let body = ""
            req.on("data", (chunk) => {
              body += chunk
            })
            req.on("end", () => {
              try {
                const { email, password } = JSON.parse(body)
                const matchedUser = USERS.find((u) => u.email === email)

                // Kiểm tra mật khẩu (đơn giản hoá: mật khẩu mặc định là role + '123' ví dụ admin123, editor123, viewer123)
                if (!matchedUser || !password) {
                  res.statusCode = 401
                  res.setHeader(
                    "Content-Type",
                    "application/json; charset=utf-8"
                  )
                  res.end(
                    JSON.stringify({
                      status: 401,
                      message: "Email hoặc mật khẩu không chính xác.",
                    })
                  )
                  return
                }

                const token = `jwt-token-${matchedUser.role}-${Date.now()}`
                res.statusCode = 200
                res.setHeader("Content-Type", "application/json; charset=utf-8")
                res.end(
                  JSON.stringify({
                    token,
                    user: matchedUser,
                  })
                )
              } catch {
                res.statusCode = 400
                res.setHeader("Content-Type", "application/json; charset=utf-8")
                res.end(
                  JSON.stringify({
                    status: 400,
                    message: "Dữ liệu JSON không hợp lệ.",
                  })
                )
              }
            })
            return
          }

          // POST /api/v1/auth/logout
          if (method === "POST" && pathname === "/api/v1/auth/logout") {
            res.statusCode = 200
            res.setHeader("Content-Type", "application/json; charset=utf-8")
            res.end(JSON.stringify({ success: true }))
            return
          }

          // GET /api/v1/auth/me
          if (method === "GET" && pathname === "/api/v1/auth/me") {
            const authHeader = req.headers["authorization"] || ""
            const token = authHeader.replace("Bearer ", "")
            let user = USERS[0] // Mặc định admin nếu có token bất kỳ
            if (token.includes("editor")) user = USERS[1]
            if (token.includes("viewer")) user = USERS[2]

            res.statusCode = 200
            res.setHeader("Content-Type", "application/json; charset=utf-8")
            res.end(JSON.stringify(user))
            return
          }

          // Chỉ tiếp tục với /api/v1/products
          if (!url.startsWith("/api/v1/products")) {
            return next()
          }

          // Hỗ trợ kiểm thử trạng thái Lỗi qua query ?mockError=1 hoặc header
          if (
            parsedUrl.searchParams.get("mockError") === "1" ||
            req.headers["x-mock-error"] === "1"
          ) {
            res.statusCode = 500
            res.setHeader("Content-Type", "application/json; charset=utf-8")
            res.end(
              JSON.stringify({
                status: 500,
                message: "Lỗi máy chủ mô phỏng để kiểm thử trạng thái Error.",
              })
            )
            return
          }

          // 1. GET /api/v1/products/:id
          const detailMatch = pathname.match(/^\/api\/v1\/products\/([^/]+)$/)
          if (method === "GET" && detailMatch) {
            const id = decodeURIComponent(detailMatch[1])
            const product = products.find((p) => p.id === id)
            if (!product) {
              res.statusCode = 404
              res.setHeader("Content-Type", "application/json; charset=utf-8")
              res.end(
                JSON.stringify({
                  status: 404,
                  message: `Không tìm thấy sản phẩm với ID: ${id}`,
                })
              )
              return
            }
            res.statusCode = 200
            res.setHeader("Content-Type", "application/json; charset=utf-8")
            res.end(JSON.stringify(product))
            return
          }

          // 2. PUT /api/v1/products/:id
          if (method === "PUT" && detailMatch) {
            const id = decodeURIComponent(detailMatch[1])
            let body = ""
            req.on("data", (chunk) => {
              body += chunk
            })
            req.on("end", () => {
              try {
                const data = JSON.parse(body)
                const index = products.findIndex((p) => p.id === id)
                if (index === -1) {
                  res.statusCode = 404
                  res.setHeader(
                    "Content-Type",
                    "application/json; charset=utf-8"
                  )
                  res.end(
                    JSON.stringify({
                      status: 404,
                      message: `Không tìm thấy sản phẩm ID ${id} để cập nhật`,
                    })
                  )
                  return
                }
                const updated = {
                  ...products[index],
                  ...data,
                  id,
                  updatedAt: new Date().toISOString(),
                }
                products[index] = updated
                res.statusCode = 200
                res.setHeader("Content-Type", "application/json; charset=utf-8")
                res.end(JSON.stringify(updated))
              } catch {
                res.statusCode = 400
                res.setHeader("Content-Type", "application/json; charset=utf-8")
                res.end(
                  JSON.stringify({
                    status: 400,
                    message: "Dữ liệu JSON gửi lên không hợp lệ.",
                  })
                )
              }
            })
            return
          }

          // 3. DELETE /api/v1/products/:id
          if (method === "DELETE" && detailMatch) {
            const id = decodeURIComponent(detailMatch[1])
            const index = products.findIndex((p) => p.id === id)
            if (index === -1) {
              res.statusCode = 404
              res.setHeader("Content-Type", "application/json; charset=utf-8")
              res.end(
                JSON.stringify({
                  status: 404,
                  message: `Không tìm thấy sản phẩm ID ${id} để xóa`,
                })
              )
              return
            }
            products.splice(index, 1)
            res.statusCode = 200
            res.setHeader("Content-Type", "application/json; charset=utf-8")
            res.end(JSON.stringify({ success: true, id }))
            return
          }

          // 4. POST /api/v1/products
          if (method === "POST" && pathname === "/api/v1/products") {
            let body = ""
            req.on("data", (chunk) => {
              body += chunk
            })
            req.on("end", () => {
              try {
                const data = JSON.parse(body)
                const newId = String(
                  Math.max(0, ...products.map((p) => Number(p.id) || 0)) + 1
                )
                const newProduct: Product = {
                  id: newId,
                  name: data.name || "",
                  category: data.category || "Điện thoại",
                  price: Number(data.price) || 0,
                  quantity: Number(data.quantity) || 0,
                  status:
                    data.status ||
                    (data.quantity > 0 ? "Còn hàng" : "Hết hàng"),
                  description: data.description || "",
                  imageUrl:
                    data.imageUrl ||
                    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80",
                  createdAt: new Date().toISOString(),
                }
                // Thêm vào đầu danh sách
                products.unshift(newProduct)
                res.statusCode = 201
                res.setHeader("Content-Type", "application/json; charset=utf-8")
                res.end(JSON.stringify(newProduct))
              } catch {
                res.statusCode = 400
                res.setHeader("Content-Type", "application/json; charset=utf-8")
                res.end(
                  JSON.stringify({
                    status: 400,
                    message: "Dữ liệu JSON thêm mới không hợp lệ.",
                  })
                )
              }
            })
            return
          }

          // 5. GET /api/v1/products (Danh sách, lọc, tìm kiếm, phân trang)
          if (method === "GET" && pathname === "/api/v1/products") {
            const search =
              parsedUrl.searchParams.get("search")?.trim().toLowerCase() || ""
            const category =
              parsedUrl.searchParams.get("category")?.trim() || ""
            const status = parsedUrl.searchParams.get("status")?.trim() || ""
            const page = Math.max(
              1,
              parseInt(parsedUrl.searchParams.get("page") || "1", 10)
            )
            const limit = Math.max(
              1,
              parseInt(parsedUrl.searchParams.get("limit") || "5", 10)
            )

            let filtered = [...products]

            if (search) {
              filtered = filtered.filter((p) =>
                p.name.toLowerCase().includes(search)
              )
            }

            if (
              category &&
              category !== "Tất cả danh mục" &&
              category !== "all"
            ) {
              filtered = filtered.filter((p) => p.category === category)
            }

            if (status && status !== "Tất cả trạng thái" && status !== "all") {
              filtered = filtered.filter((p) => p.status === status)
            }

            const total = filtered.length
            const totalPages = Math.max(1, Math.ceil(total / limit))
            const startIndex = (page - 1) * limit
            const items = filtered.slice(startIndex, startIndex + limit)

            res.statusCode = 200
            res.setHeader("Content-Type", "application/json; charset=utf-8")
            res.end(
              JSON.stringify({
                items,
                total,
                page,
                limit,
                totalPages,
              })
            )
            return
          }

          next()
        }
      )
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), mockApiPlugin()],
  server: {
    port: 6062,
    strictPort: true,
  },
  resolve: {
    alias: {
      "@": resolve(import.meta.dirname, "./src"),
    },
  },
})
