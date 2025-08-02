export interface Folder {
  id: string;
  name: string;
  parentId?: string | null;
  children?: Folder[];
}

export interface CreateFolderRequest {
  name: string;
  parentId?: string;
}

export interface UpdateFolderRequest {
  name: string;
}

export interface SearchFoldersQuery {
  q: string;
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  details?: string;
}