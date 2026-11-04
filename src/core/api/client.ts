import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios"
import { API_BASE_URL, API_TIMEOUT, API_TOKEN } from "./config"
import type { ApiErrorPayload } from "./types"

export class ApiError extends Error {
  readonly status: number
  readonly data?: unknown
  readonly isNetworkError: boolean

  constructor(
    status: number,
    message: string,
    data?: unknown,
    isNetworkError = false
  ) {
    super(message)
    this.status = status
    this.data = data
    this.isNetworkError = isNetworkError
    this.name = "ApiError"
  }
}

/**
 * Khởi tạo Axios instance với cấu hình cơ sở
 */
export const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
})

/**
 * Request Interceptor: Tự động đính kèm Authorization token và kiểm tra kết nối
 */
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Lấy token từ localStorage hoặc biến môi trường VITE_API_TOKEN
    const token =
      (typeof window !== "undefined" && localStorage.getItem("token")) ||
      API_TOKEN

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error: unknown) => {
    return Promise.reject(error)
  }
)

/**
 * Response Interceptor: Xử lý dữ liệu trả về và bắt lỗi tập trung (401, 403, 404, 500, Network error...)
 */
axiosInstance.interceptors.response.use(
  (response) => {
    // Trả về dữ liệu từ server
    return response.data
  },
  (error: AxiosError<ApiErrorPayload>) => {
    // 1. Lỗi không nhận được response (Network error, CORS, Server offline)
    if (!error.response) {
      if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
        return Promise.reject(
          new ApiError(
            408,
            "Yêu cầu đã quá thời gian chờ (Timeout). Vui lòng thử lại.",
            null,
            true
          )
        )
      }
      return Promise.reject(
        new ApiError(
          0,
          "Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại kết nối mạng.",
          null,
          true
        )
      )
    }

    const { status, data } = error.response
    let message = data?.message || data?.error

    // 2. Xử lý thông báo theo mã trạng thái HTTP chuẩn
    switch (status) {
      case 400:
        message =
          message ||
          "Dữ liệu yêu cầu không hợp lệ. Vui lòng kiểm tra lại các trường thông tin."
        break
      case 401:
        message =
          message ||
          "Phiên làm việc đã hết hạn hoặc chưa đăng nhập. Vui lòng đăng nhập lại."
        // Có thể xóa token hoặc điều hướng về trang đăng nhập nếu cần:
        if (typeof window !== "undefined") {
          // localStorage.removeItem("token")
        }
        break
      case 403:
        message = message || "Bạn không có quyền thực hiện thao tác này."
        break
      case 404:
        message =
          message ||
          "Không tìm thấy dữ liệu hoặc trang yêu cầu (404 Not Found)."
        break
      case 409:
        message =
          message || "Dữ liệu bị trùng lặp hoặc xung đột với bản ghi hiện có."
        break
      case 422:
        message =
          message ||
          "Dữ liệu gửi lên không vượt qua quy tắc kiểm tra (Validation Error)."
        break
      case 500:
      case 502:
      case 503:
        message =
          message ||
          "Hệ thống máy chủ đang gặp sự cố. Vui lòng thử lại sau ít phút."
        break
      default:
        message = message || `Yêu cầu thất bại với mã lỗi HTTP ${status}.`
        break
    }

    return Promise.reject(new ApiError(status, message, data))
  }
)

/**
 * Các phương thức HTTP generic bọc ngoài axiosInstance để định kiểu an toàn
 */
export async function get<TResponse>(
  url: string,
  config?: AxiosRequestConfig
): Promise<TResponse> {
  return axiosInstance.get(url, config) as unknown as Promise<TResponse>
}

export async function post<TResponse, TBody = unknown>(
  url: string,
  data?: TBody,
  config?: AxiosRequestConfig
): Promise<TResponse> {
  return axiosInstance.post(url, data, config) as unknown as Promise<TResponse>
}

export async function put<TResponse, TBody = unknown>(
  url: string,
  data?: TBody,
  config?: AxiosRequestConfig
): Promise<TResponse> {
  return axiosInstance.put(url, data, config) as unknown as Promise<TResponse>
}

export async function patch<TResponse, TBody = unknown>(
  url: string,
  data?: TBody,
  config?: AxiosRequestConfig
): Promise<TResponse> {
  return axiosInstance.patch(url, data, config) as unknown as Promise<TResponse>
}

export async function deleteRequest<TResponse>(
  url: string,
  config?: AxiosRequestConfig
): Promise<TResponse> {
  return axiosInstance.delete(url, config) as unknown as Promise<TResponse>
}
