// Cấu hình môi trường cho API
const configuredUrl = import.meta.env.VITE_API_BASE_URL?.trim()

if (!configuredUrl) {
  throw new Error("Thiếu VITE_API_BASE_URL. Hãy cấu hình trong file .env.")
}

// Nếu là URL tuyệt đối, kiểm tra giao thức http: hoặc https:
if (
  configuredUrl.startsWith("http://") ||
  configuredUrl.startsWith("https://")
) {
  const parsed = new URL(configuredUrl)
  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error("VITE_API_BASE_URL phải là URL HTTP hoặc HTTPS hợp lệ.")
  }
} else if (!configuredUrl.startsWith("/")) {
  throw new Error(
    "VITE_API_BASE_URL phải bắt đầu bằng '/' hoặc là URL HTTP/HTTPS."
  )
}

export const API_BASE_URL = configuredUrl.replace(/\/+$/, "")
export const API_TOKEN = import.meta.env.VITE_API_TOKEN?.trim() || ""
export const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 15000
