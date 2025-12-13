import http from './http'
import type {
  Subscription,
  SubscriptionListRequest,
  SubscriptionListResponse,
  CreateSubscriptionRequest,
  UpdateSubscriptionRequest,
} from './types'

/**
 * Get subscription list
 */
export function getSubscriptionList(data: SubscriptionListRequest): Promise<SubscriptionListResponse> {
  return http.post('/api/subscriptions/list', data)
}

/**
 * Get subscription detail
 */
export function getSubscriptionDetail(id: string): Promise<Subscription> {
  return http.post('/api/subscriptions/detail', { id })
}

/**
 * Create subscription
 */
export function createSubscription(data: CreateSubscriptionRequest): Promise<Subscription> {
  return http.post('/api/subscriptions/create', data)
}

/**
 * Update subscription
 */
export function updateSubscription(data: UpdateSubscriptionRequest): Promise<Subscription> {
  return http.post('/api/subscriptions/update', data)
}

/**
 * Delete subscription
 */
export function deleteSubscription(id: string): Promise<void> {
  return http.post('/api/subscriptions/delete', { id })
}
