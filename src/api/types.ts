// API Response Types
export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

// Auth Types
export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: UserInfo
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface RefreshTokenResponse {
  accessToken: string
  refreshToken: string
}

export interface UserInfo {
  id: string
  username: string
  email?: string
  avatar?: string
}

// Subscription Types
export interface Subscription {
  id: string
  name: string
  user: string
  status: 'active' | 'expiring' | 'expired'
  price: string
  expiryDate: string
  createdAt?: string
  updatedAt?: string
}

export interface SubscriptionListRequest {
  pageNum: number
  pageSize: number
  keyword?: string
}

export interface SubscriptionListResponse {
  list: Subscription[]
  total: number
  pageNum: number
  pageSize: number
}

export interface CreateSubscriptionRequest {
  name: string
  user: string
  price: string
  expiryDate: string
}

export interface UpdateSubscriptionRequest extends Partial<CreateSubscriptionRequest> {
  id: string
}

// Customer Types
export interface Customer {
  id: string
  name: string
  email: string
  phone?: string
  status: 'active' | 'inactive'
  createdAt: string
}

export interface CustomerListRequest {
  pageNum: number
  pageSize: number
  keyword?: string
}

export interface CustomerListResponse {
  list: Customer[]
  total: number
  pageNum: number
  pageSize: number
}

// Dashboard Types
export interface DashboardStats {
  totalSubscriptions: number
  activeUsers: number
  monthlyRevenue: number
  subscriptionsGrowth: string
  usersGrowth: string
  revenueGrowth: string
}
