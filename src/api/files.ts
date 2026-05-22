import type { FileInfo } from '../types';

const BASE = '';

export const filesApi = {
  list: async (): Promise<FileInfo[]> => {
    const res = await fetch(`${BASE}/api/files`);
    const data = await res.json();
    return data.files;
  },

  upload: async (file: File): Promise<{ message: string; file: { name: string } }> => {
    const form = new FormData();
    form.append('file', file);
    const res = await fetch(`${BASE}/api/files/upload`, { method: 'POST', body: form });
    return res.json();
  },

  saveContent: async (filename: string, content: string) => {
    const res = await fetch(`${BASE}/api/files/content`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename, content }),
    });
    return res.json();
  },

  delete: async (filename: string) => {
    const res = await fetch(`${BASE}/api/files/${encodeURIComponent(filename)}`, {
      method: 'DELETE',
    });
    return res.json();
  },
};
