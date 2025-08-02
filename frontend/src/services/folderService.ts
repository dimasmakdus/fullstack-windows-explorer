import type { Folder, CreateFolderPayload, UpdateFolderPayload } from '@/types/folder';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  console.error("VITE_API_BASE_URL is not defined in .env or not accessible.");
}

class FolderService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  async getAllFolders(): Promise<Folder[]> {
    const response = await fetch(`${this.baseUrl}/folders`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async getFolderChildren(folderId: string): Promise<Folder[]> {
    const response = await fetch(`${this.baseUrl}/folders/${folderId}/children`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async createFolder(payload: CreateFolderPayload): Promise<Folder> {
    const response = await fetch(`${this.baseUrl}/folders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async searchFolders(query: string): Promise<Folder[]> {
    const response = await fetch(
      `${this.baseUrl}/search/folders?q=${encodeURIComponent(query.trim())}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async deleteFolder(folderId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/folders/${folderId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
  }

  // Update Folder Name
  async updateFolder(folderId: string, payload: UpdateFolderPayload): Promise<Folder> {
    const response = await fetch(`${this.baseUrl}/folders/${folderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
}

export const folderService = new FolderService();