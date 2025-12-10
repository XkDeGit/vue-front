import { http } from './http';
import type { Customer, PagedResult } from './types';

export const listCustomers = async (): Promise<Customer[]> => {
  const response = await http.post<Customer[]>('/customers/list');
  return response.data;
};

export const getCustomersPaged = async (
  page = 1,
  pageSize = 10
): Promise<PagedResult<Customer>> => {
  const response = await http.post<PagedResult<Customer>>('/customers/paged', { page, pageSize });
  return response.data;
};
