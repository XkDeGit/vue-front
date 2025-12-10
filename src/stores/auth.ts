import { defineStore } from 'pinia';
import { login as loginApi, refreshToken as refreshTokenApi } from '@api/auth';
import type { AuthTokens, LoginPayload, UserProfile } from '@api/types';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: UserProfile | null;
  loading: boolean;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    accessToken: null,
    refreshToken: null,
    user: null,
    loading: false
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.accessToken),
    canRefresh: (state) => Boolean(state.refreshToken)
  },
  actions: {
    setTokens(tokens: AuthTokens) {
      this.accessToken = tokens.accessToken;
      this.refreshToken = tokens.refreshToken ?? null;
    },
    clearSession() {
      this.accessToken = null;
      this.refreshToken = null;
      this.user = null;
    },
    async login(payload: LoginPayload) {
      this.loading = true;
      try {
        const result = await loginApi(payload);
        this.setTokens(result.tokens);
        this.user = result.user;
      } finally {
        this.loading = false;
      }
    },
    async refresh() {
      if (!this.refreshToken) {
        this.clearSession();
        throw new Error('Missing refresh token');
      }
      const tokens = await refreshTokenApi(this.refreshToken);
      this.setTokens(tokens);
    },
    logout() {
      this.clearSession();
    }
  }
});
