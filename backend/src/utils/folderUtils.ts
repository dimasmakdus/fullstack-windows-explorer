import type { Folder } from '../types/folder.types';

/**
 * Recursively builds a folder tree structure from flat folder data
 * @param folders - Array of flat folder objects
 * @param parentId - Parent ID to filter by (null for root folders)
 * @returns Array of folders with nested children
 */
export const buildFolderTree = (
  folders: Folder[],
  parentId: string | null = null
): Folder[] => {
  return folders
    .filter((folder) => (folder.parentId || null) === parentId)
    .map((folder) => ({
      ...folder,
      children: buildFolderTree(folders, folder.id),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
};

/**
 * Validates folder name
 * @param name - Folder name to validate
 * @returns Boolean indicating if name is valid
 */
export const validateFolderName = (name: string): boolean => {
  return typeof name === 'string' && name.trim() !== '' && name.length <= 256;
};

/**
 * Sanitizes folder name
 * @param name - Folder name to sanitize
 * @returns Sanitized folder name
 */
export const sanitizeFolderName = (name: string): string => {
  return name.trim();
};