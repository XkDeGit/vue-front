import { http } from './http';
import type { AuthTokens, LoginPayload, UserProfile } from './types';

interface LoginResponse {
  tokens: AuthTokens;
  user: UserProfile;
}

export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  const response = await http.post<LoginResponse>('/auth/login', payload);
  return response.data;
};

export const refreshToken = async (refreshTokenValue: string): Promise<AuthTokens> => {
  const response = await http.post<AuthTokens>('/auth/refresh', {
    refreshToken: refreshTokenValue
  });
  return response.data;
};
