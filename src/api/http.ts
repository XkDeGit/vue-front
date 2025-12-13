import axios, { type AxiosError, type AxiosInstance, type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios'
import type { ApiResponse } from './types'
import { ElMessage } from 'element-plus'

// Extend AxiosRequestConfig to include custom retry flag
declare module 'axios' {
  export interface AxiosRequestConfig {
    _retry?: boolean
  }
}

// Create axios instance
const http: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get access token from sessionStorage
    const accessToken = sessionStorage.getItem('accessToken')
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// Response interceptor
http.interceptors.response.use(
  async (response) => {
    const { data } = response as { data: ApiResponse }

    // Check business code
    if (data.code === 200) {
      // Success, return data
      return data.data
    } else if (data.code === 401) {
      // Token expired, try to refresh
      const originalRequest = response.config as AxiosRequestConfig

      // Prevent infinite loop
      if (originalRequest._retry) {
        // Already retried, logout
        sessionStorage.clear()
        window.location.href = '/login'
        ElMessage.error('登录已过期，请重新登录')
        return Promise.reject(new Error('Token refresh failed'))
      }

      originalRequest._retry = true

      try {
        // Get refresh token
        const refreshToken = sessionStorage.getItem('refreshToken')
        if (!refreshToken) {
          throw new Error('No refresh token')
        }

        // Call refresh API
        const refreshResponse = await axios.post<ApiResponse<{ accessToken: string; refreshToken: string }>>(
          `${import.meta.env.VITE_API_BASE_URL}/api/auth/refresh`,
          { refreshToken },
          { headers: { 'Content-Type': 'application/json' } }
        )

        if (refreshResponse.data.code === 200) {
          const { accessToken: newAccessToken, refreshToken: newRefreshToken } = refreshResponse.data.data

          // Save new tokens
          sessionStorage.setItem('accessToken', newAccessToken)
          sessionStorage.setItem('refreshToken', newRefreshToken)

          // Retry original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
          }

          return http(originalRequest)
        } else {
          throw new Error('Token refresh failed')
        }
      } catch (error) {
        // Refresh failed, logout
        sessionStorage.clear()
        window.location.href = '/login'
        ElMessage.error('登录已过期，请重新登录')
        return Promise.reject(error)
      }
    } else {
      // Other errors, show toast
      ElMessage.error(data.message || '请求失败')
      return Promise.reject(new Error(data.message))
    }
  },
  (error: AxiosError) => {
    // Network error or HTTP error
    if (error.response) {
      // HTTP status code error
      const status = error.response.status
      if (status === 500) {
        ElMessage.error('服务器错误，请稍后重试')
      } else if (status === 404) {
        ElMessage.error('请求的资源不存在')
      } else {
        ElMessage.error('请求失败，请检查网络连接')
      }
    } else if (error.request) {
      // Network error
      ElMessage.error('网络连接失败，请检查您的网络')
    } else {
      // Other errors
      ElMessage.error('请求失败')
    }
    return Promise.reject(error)
  }
)

export default http
