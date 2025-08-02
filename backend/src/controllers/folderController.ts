import type { Context } from 'elysia';
import { FolderService } from '../services/folderService';
import type { CreateFolderRequest, UpdateFolderRequest, SearchFoldersQuery } from '../types/folder.types';
import { validateFolderName } from '../utils/folderUtils';

export class FolderController {

  // Get all folders in tree structure
  static async getAllFolders() {
    try {
      const folders = await FolderService.getAllFoldersTree();
      return folders;
    } catch (error: any) {
      throw new Error(`Failed to get folders: ${error.message}`);
    }
  }

  // Get children of a specific folder
  static async getFolderChildren({ params }: Context) {
    try {
      const folderId: string = params.id ?? "";
      const children = await FolderService.getFolderChildren(folderId);
      return children;
    } catch (error: any) {
      throw new Error(`Failed to get folder children: ${error.message}`);
    }
  }

  // Create a new folder
  static async createFolder({ body, set }: Context) {
    try {
      const { name, parentId } = body as CreateFolderRequest;

      if (!validateFolderName(name)) {
        set.status = 400;
        return { error: 'Invalid folder name' };
      }

      const newFolder = await FolderService.createFolder({ name, parentId });
      set.status = 201;
      return newFolder;
    } catch (error: any) {
      console.error('Error creating folder:', error);

      if (error.message === 'Parent folder not found') {
        set.status = 404;
        return { error: 'Parent folder not found' };
      }

      set.status = 500;
      return { error: 'Failed to create folder', details: error.message };
    }
  }

  // Search folders by name
  static async searchFolders({ query, set }: Context) {
    try {
      const { q } = query;

      if (!q || typeof q !== 'string' || q.trim() === '') {
        set.status = 400;
        return { error: 'Search query (q) is required' };
      }

      const folders = await FolderService.searchFolders(q);
      return folders;
    } catch (error: any) {
      console.error('Error searching folders:', error);
      set.status = 500;
      return { error: 'Failed to search folders', details: error.message };
    }
  }

  // Delete a folder by ID
  static async deleteFolder({ params, set }: Context) {
    try {
      const folderId = params.id ?? "";
      await FolderService.deleteFolder(folderId);

      set.status = 200;
      return { message: 'Folder and its contents deleted successfully' };
    } catch (error: any) {
      console.error('Error deleting folder:', error);

      if (error.message === 'Folder not found') {
        set.status = 404;
        return { error: 'Folder not found' };
      }

      set.status = 500;
      return { error: 'Failed to delete folder', details: error.message };
    }
  }

  // Update folder name
  static async updateFolder({ params, body, set }: Context) {
    try {
      const folderId = params.id ?? "";
      const { name } = body as UpdateFolderRequest;

      if (!validateFolderName(name)) {
        set.status = 400;
        return { error: 'New folder name is required and cannot be empty' };
      }

      const updatedFolder = await FolderService.updateFolder(folderId, { name });
      set.status = 200;
      return updatedFolder;
    } catch (error: any) {
      console.error('Error updating folder:', error);

      if (error.message === 'Folder not found') {
        set.status = 404;
        return { error: 'Folder not found' };
      }

      set.status = 500;
      return { error: 'Failed to update folder', details: error.message };
    }
  }

  // Seed database with initial data
  static async seedDatabase({ set }: Context) {
    try {
      await FolderService.seedDatabase();
      return { message: 'Database seeded successfully!' };
    } catch (error: any) {
      console.error('Error seeding database:', error);
      set.status = 500;
      return { error: 'Failed to seed database', details: error.message };
    }
  }
}