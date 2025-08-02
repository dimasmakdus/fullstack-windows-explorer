import type { Folder } from '@/types/folder';

export const findFolderNameInTree = (
  folders: Folder[],
  id: string
): string | null => {
  for (const folder of folders) {
    if (folder.id === id) {
      return folder.name;
    }
    if (folder.children) {
      const found = findFolderNameInTree(folder.children, id);
      if (found) return found;
    }
  }
  return null;
};

export const findFolderByIdInTree = (
  folders: Folder[],
  id: string
): Folder | null => {
  for (const folder of folders) {
    if (folder.id === id) {
      return folder;
    }
    if (folder.children) {
      const found = findFolderByIdInTree(folder.children, id);
      if (found) return found;
    }
  }
  return null;
};

export const getFolderPath = (
  folders: Folder[],
  targetId: string
): Folder[] => {
  const findPath = (folders: Folder[], targetId: string, path: Folder[] = []): Folder[] | null => {
    for (const folder of folders) {
      const currentPath = [...path, folder];

      if (folder.id === targetId) {
        return currentPath;
      }

      if (folder.children) {
        const found = findPath(folder.children, targetId, currentPath);
        if (found) return found;
      }
    }
    return null;
  };

  return findPath(folders, targetId) || [];
};

//Validation folder name
export const isValidFolderName = (name: string): boolean => {
  return typeof name === 'string' && name.trim() !== '' && name.length <= 256;
};

//Sanitize folder name
export const sanitizeFolderName = (name: string): string => {
  return name.trim();
};

export const getDefaultFolderId = (folders: Folder[]): string | null => {
  return folders.length > 0 ? folders[0].id : null;
};