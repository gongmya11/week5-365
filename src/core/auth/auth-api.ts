import { get, post } from "@/core/api/client"
import type { LoginCredentials, LoginResponse, User } from "./types"

export async function loginApi(
  credentials: LoginCredentials
): Promise<LoginResponse> {
  return post<LoginResponse, LoginCredentials>("/auth/login", credentials)
}

export async function logoutApi(): Promise<{ success: boolean }> {
  return post<{ success: boolean }>("/auth/logout")
}

export async function getCurrentUserApi(): Promise<User> {
  return get<User>("/auth/me")
}
