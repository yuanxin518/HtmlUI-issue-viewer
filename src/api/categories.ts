import { apiClient } from './client';
import type { Category, Directory } from '../types';

export const categoriesApi = {
  list: () =>
    apiClient.get<{ categories: Category[] }>('/api/categories'),

  create: (name: string, icon?: string) =>
    apiClient.post<{ message: string; name: string }>('/api/categories', { name, icon }),

  update: (oldName: string, data: { name?: string; icon?: string }) =>
    apiClient.put<{ message: string }>(`/api/categories/${encodeURIComponent(oldName)}`, data),

  delete: (name: string) =>
    apiClient.delete<{ message: string }>(`/api/categories/${encodeURIComponent(name)}`),
};
