import http from './http'
import type { LoginRequest, LoginResponse, RefreshTokenRequest, RefreshTokenResponse } from './types'

/**
 * Login API
 */
export function login(data: LoginRequest): Promise<LoginResponse> {
  return http.post('/api/auth/login', data)
}

/**
 * Logout API
 */
export function logout(): Promise<void> {
  return http.post('/api/auth/logout', {})
}

/**
 * Refresh Token API
 */
export function refreshToken(data: RefreshTokenRequest): Promise<RefreshTokenResponse> {
  return http.post('/api/auth/refresh', data)
}

/**
 * Get User Info API
 */
export function getUserInfo(): Promise<any> {
  return http.post('/api/auth/userinfo', {})
}
