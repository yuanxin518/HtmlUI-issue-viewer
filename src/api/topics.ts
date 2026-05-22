import { apiClient } from './client';
import type { Topic } from '../types';

export const topicsApi = {
  create: (categoryName: string, id: string, title: string, file?: string) =>
    apiClient.post<{ message: string; topic: Topic }>('/api/topics', {
      categoryName, id, title, file,
    }),

  update: (id: string, data: { title?: string; file?: string; categoryName?: string }) =>
    apiClient.put<{ message: string; topic: Topic }>(`/api/topics/${id}`, data),

  delete: (id: string) =>
    apiClient.delete<{ message: string; topic: Topic }>(`/api/topics/${id}`),
};
