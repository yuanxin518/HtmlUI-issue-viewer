export interface Topic {
  id: string;
  title: string;
  file: string;
}

export interface Category {
  name: string;
  icon: string;
  topics: Topic[];
}

export interface Directory {
  categories: Category[];
}

export interface FileInfo {
  name: string;
  size: number;
  mtime: string;
}

export interface ApiResponse<T> {
  message?: string;
  error?: string;
  data?: T;
}
