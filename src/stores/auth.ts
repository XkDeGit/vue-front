import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { UserInfo } from '@/api/types'
import * as authApi from '@/api/auth'

export const useAuthStore = defineStore('auth', () => {
  // State
  const accessToken = ref<string | null>(sessionStorage.getItem('accessToken'))
  const refreshToken = ref<string | null>(sessionStorage.getItem('refreshToken'))
  const user = ref<UserInfo | null>(null)
  const isAuthenticated = computed(() => !!accessToken.value)

  // Actions
  const setTokens = (access: string, refresh: string): void => {
    accessToken.value = access
    refreshToken.value = refresh
    sessionStorage.setItem('accessToken', access)
    sessionStorage.setItem('refreshToken', refresh)
  }

  const setUser = (userInfo: UserInfo): void => {
    user.value = userInfo
  }

  const login = async (username: string, password: string): Promise<void> => {
    try {
      const response = await authApi.login({ username, password })
      setTokens(response.accessToken, response.refreshToken)
      setUser(response.user)
    } catch (error) {
      throw error
    }
  }

  const logout = async (): Promise<void> => {
    try {
      await authApi.logout()
    } catch (error) {
      // Ignore logout API errors
      console.error('Logout API error:', error)
    } finally {
      // Clear state and storage
      accessToken.value = null
      refreshToken.value = null
      user.value = null
      sessionStorage.clear()
    }
  }

  const refreshAuthToken = async (): Promise<void> => {
    if (!refreshToken.value) {
      throw new Error('No refresh token available')
    }

    try {
      const response = await authApi.refreshToken({ refreshToken: refreshToken.value })
      setTokens(response.accessToken, response.refreshToken)
    } catch (error) {
      // Refresh failed, logout
      await logout()
      throw error
    }
  }

  return {
    // State
    accessToken: readonly(accessToken),
    refreshToken: readonly(refreshToken),
    user: readonly(user),
    isAuthenticated,

    // Actions
    login,
    logout,
    refreshAuthToken,
    setUser,
  }
})
