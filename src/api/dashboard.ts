import http from './http'
import type { DashboardStats } from './types'

/**
 * Get dashboard statistics
 */
export function getDashboardStats(): Promise<DashboardStats> {
  return http.post('/api/dashboard/stats', {})
}
