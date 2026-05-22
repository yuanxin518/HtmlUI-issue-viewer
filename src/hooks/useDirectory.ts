import { categoriesApi } from '../api/categories';
import type { Category } from '../types';

export function useDirectory() {
  const load = async (): Promise<Category[]> => {
    const res = await categoriesApi.list();
    return res.categories;
  };

  const addCategory = async (name: string, icon?: string) => {
    return categoriesApi.create(name, icon);
  };

  const removeCategory = async (name: string) => {
    return categoriesApi.delete(name);
  };

  return { load, addCategory, removeCategory };
}
