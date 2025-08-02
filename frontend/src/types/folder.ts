export interface Folder {
  id: string;
  name: string;
  parentId?: string | null;
  children?: Folder[];
}

export interface CreateFolderPayload {
  name: string;
  parentId?: string | null;
}

export interface UpdateFolderPayload {
  name: string;
}

export interface SearchFoldersParams {
  q: string;
}

export interface ApiError {
  error: string;
  details?: string;
}

export interface NavigationHistory {
  folderId: string;
  folderName: string;
  timestamp: number;
}