import { Elysia, t } from 'elysia';
import { FolderController } from '../controllers/folderController';

export const folderRoutes = new Elysia({ prefix: '/api/v1' })

  // Get all folders in tree structure
  .get('/folders', FolderController.getAllFolders, {
    detail: {
      summary: 'Get all folders',
      description: 'Retrieves all folders organized in a tree structure.',
      tags: ['Folders'],
    },
  })

  // Get children of a specific folder
  .get('/folders/:id/children', FolderController.getFolderChildren, {
    params: t.Object({
      id: t.String({ format: 'uuid' }),
    }),
    detail: {
      summary: 'Get folder children',
      description: 'Retrieves all direct children of a specific folder.',
      tags: ['Folders'],
    },
  })

  // Create a new folder
  .post('/folders', FolderController.createFolder, {
    body: t.Object({
      name: t.String({ minLength: 1, maxLength: 256 }),
      parentId: t.Optional(t.String()),
    }),
    detail: {
      summary: 'Create a new folder',
      description: 'Creates a new folder with a given name and optional parentId.',
      tags: ['Folders'],
    },
  })

  // Search folders by name
  .get('/search/folders', FolderController.searchFolders, {
    query: t.Object({
      q: t.String({ minLength: 1 }),
    }),
    detail: {
      summary: 'Search folders by name',
      description: 'Searches for folders whose names contain the provided query string.',
      tags: ['Search'],
    },
  })

  // Delete a folder
  .delete('/folders/:id', FolderController.deleteFolder, {
    params: t.Object({
      id: t.String({ format: 'uuid' }),
    }),
    detail: {
      summary: 'Delete a folder',
      description: 'Deletes a folder by its ID. Deletes subfolders recursively due to CASCADE delete.',
      tags: ['Folders'],
    },
  })

  // Update folder name
  .patch('/folders/:id', FolderController.updateFolder, {
    params: t.Object({
      id: t.String({ format: 'uuid' }),
    }),
    body: t.Object({
      name: t.String({ minLength: 1, maxLength: 256 }),
    }),
    detail: {
      summary: 'Rename a folder',
      description: 'Renames an existing folder by its ID.',
      tags: ['Folders'],
    },
  })

  // Seed database (development only)
  .post('/folders/seed', FolderController.seedDatabase, {
    detail: {
      summary: 'Seed database',
      description: 'Seeds the database with initial folder data. Use only for development/testing.',
      tags: ['Development'],
    },
  });