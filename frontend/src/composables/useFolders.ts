import { ref, computed } from 'vue';
import type { Folder, CreateFolderPayload } from '@/types/folder';
import { folderService } from '@/services/folderService';
import { findFolderNameInTree, getDefaultFolderId } from '@/utils/folderUtils';

export const useFolders = () => {
  // State
  const folders = ref<Folder[]>([]);
  const selectedFolderId = ref<string | null>(null);
  const currentSubfolders = ref<Folder[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Computed
  const selectedFolderName = computed(() => {
    if (!selectedFolderId.value) return null;
    return findFolderNameInTree(folders.value, selectedFolderId.value);
  });

  // Methods
  const fetchFolders = async () => {
    try {
      isLoading.value = true;
      error.value = null;

      folders.value = await folderService.getAllFolders();

      // Set default selection if no folder is selected
      if (!selectedFolderId.value && folders.value.length > 0) {
        const defaultFolderId = getDefaultFolderId(folders.value);
        if (defaultFolderId) {
          await selectFolder(defaultFolderId, true);
        }
      } else if (selectedFolderId.value) {
        await fetchSubfolders(selectedFolderId.value);
      }
    } catch (err: any) {
      console.error('Error fetching folders:', err);
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  };

  const fetchSubfolders = async (folderId: string) => {
    try {
      currentSubfolders.value = await folderService.getFolderChildren(folderId);
    } catch (err: any) {
      console.error(`Error fetching subfolders for ${folderId}:`, err);
      currentSubfolders.value = [];
    }
  };

  const selectFolder = async (folderId: string, isInternal = false) => {
    selectedFolderId.value = folderId;
    await fetchSubfolders(folderId);
    return isInternal;
  };

  const createFolder = async (name: string, parentId?: string | null) => {
    try {
      const payload: CreateFolderPayload = {
        name: name.trim(),
        ...(parentId && { parentId })
      };

      await folderService.createFolder(payload);
      await fetchFolders(); // Refresh the tree
    } catch (err: any) {
      console.error('Error creating folder:', err);
      throw err;
    }
  };

  const deleteFolder = async (folderId: string) => {
    try {
      await folderService.deleteFolder(folderId);
      await fetchFolders(); // Refresh the tree

      // Handle selection after deletion
      if (selectedFolderId.value === folderId) {
        const defaultFolderId = getDefaultFolderId(folders.value);
        if (defaultFolderId) {
          await selectFolder(defaultFolderId);
        } else {
          selectedFolderId.value = null;
          currentSubfolders.value = [];
        }
      }
    } catch (err: any) {
      console.error('Error deleting folder:', err);
      throw err;
    }
  };

  const renameFolder = async (folderId: string, newName: string) => {
    try {
      await folderService.updateFolder(folderId, { name: newName.trim() });
      await fetchFolders(); // Refresh the tree

      // Re-fetch subfolders if the renamed folder is currently selected
      if (selectedFolderId.value === folderId) {
        await fetchSubfolders(folderId);
      }
    } catch (err: any) {
      console.error('Error renaming folder:', err);
      throw err;
    }
  };

  return {
    // State
    folders,
    selectedFolderId,
    currentSubfolders,
    isLoading,
    error,

    // Computed
    selectedFolderName,

    // Methods
    fetchFolders,
    fetchSubfolders,
    selectFolder,
    createFolder,
    deleteFolder,
    renameFolder,
  };
};