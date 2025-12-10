import { defineStore } from 'pinia';
import { login as loginApi, refreshToken as refreshTokenApi } from '@api/auth';
import type { AuthTokens, LoginPayload, UserProfile } from '@api/types';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: UserProfile | null;
  loading: boolean;
}

const storage = typeof window !== 'undefined' ? window.sessionStorage : undefined;
const getStored = (key: string) => storage?.getItem(key) ?? null;
const setStored = (key: string, value: string | null) => {
  if (!storage) return;
  if (value) storage.setItem(key, value);
  else storage.removeItem(key);
};

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    accessToken: getStored('access_token'),
    refreshToken: getStored('refresh_token'),
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
      setStored('access_token', this.accessToken);
      setStored('refresh_token', this.refreshToken);
    },
    clearSession() {
      this.accessToken = null;
      this.refreshToken = null;
      this.user = null;
      setStored('access_token', null);
      setStored('refresh_token', null);
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
    logout(redirectToLogin = false) {
      this.clearSession();
      if (redirectToLogin && typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        const currentPath = url.pathname + url.search;
        const redirect = currentPath !== '/login' ? `?redirect=${encodeURIComponent(currentPath)}` : '';
        window.location.href = `/login${redirect}`;
      }
    }
  }
});
