import { http } from './http';
import type { Plan, PagedResult } from './types';

export const listPlans = async (): Promise<Plan[]> => {
  const response = await http.post<Plan[]>('/plans/list');
  return response.data;
};

export const createPlan = async (payload: Omit<Plan, 'id'>): Promise<Plan> => {
  const response = await http.post<Plan>('/plans', payload);
  return response.data;
};

export const getPlansPaged = async (page = 1, pageSize = 10): Promise<PagedResult<Plan>> => {
  const response = await http.post<PagedResult<Plan>>('/plans/paged', { page, pageSize });
  return response.data;
};
