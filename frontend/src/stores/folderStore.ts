import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Folder } from '@/types/folder';
import { folderService } from '@/services/folderService';
import { findFolderNameInTree, getDefaultFolderId } from '@/utils/folderUtils';

export const useFolderStore = defineStore('folders', () => {
  // State
  const folders = ref<Folder[]>([]);
  const selectedFolderId = ref<string | null>(null);
  const currentSubfolders = ref<Folder[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Search state
  const searchQuery = ref('');
  const searchResults = ref<Folder[]>([]);
  const isSearching = ref(false);

  // Navigation state
  const history = ref<string[]>([]);
  const historyPointer = ref(-1);

  // Computed
  const selectedFolderName = computed(() => {
    if (!selectedFolderId.value) return null;
    return findFolderNameInTree(folders.value, selectedFolderId.value);
  });
  const hasSearchQuery = computed(() => searchQuery.value.trim().length > 0);
  const canGoBack = computed(() => historyPointer.value > 0);
  const canGoForward = computed(() => historyPointer.value < history.value.length - 1);

  // Actions
  const fetchFolders = async () => {
    try {
      isLoading.value = true;
      error.value = null;

      folders.value = await folderService.getAllFolders();

      if (!selectedFolderId.value && folders.value.length > 0) {
        const defaultFolderId = getDefaultFolderId(folders.value);
        if (defaultFolderId) {
          await selectFolder(defaultFolderId, true);
        }
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

    if (!isInternal) {
      addToHistory(folderId);
    }

    clearSearch();
  };

  const addToHistory = (folderId: string) => {
    history.value = history.value.slice(0, historyPointer.value + 1);
    history.value.push(folderId);
    historyPointer.value = history.value.length - 1;
  };

  const goBack = () => {
    if (canGoBack.value) {
      historyPointer.value--;
      const targetFolderId = history.value[historyPointer.value];
      selectFolder(targetFolderId, true);
    }
  };

  const goForward = () => {
    if (canGoForward.value) {
      historyPointer.value++;
      const targetFolderId = history.value[historyPointer.value];
      selectFolder(targetFolderId, true);
    }
  };

  const searchFolders = async (query: string) => {
    if (!query.trim()) {
      searchResults.value = [];
      return;
    }

    try {
      isSearching.value = true;
      searchResults.value = await folderService.searchFolders(query);
      selectedFolderId.value = null;
      currentSubfolders.value = [];
    } catch (err: any) {
      console.error('Error searching folders:', err);
      searchResults.value = [];
    } finally {
      isSearching.value = false;
    }
  };

  const clearSearch = () => {
    searchQuery.value = '';
    searchResults.value = [];
  };

  const createFolder = async (name: string, parentId?: string | null) => {
    try {
      await folderService.createFolder({
        name: name.trim(),
        ...(parentId && { parentId })
      });
      await fetchFolders();
    } catch (err: any) {
      console.error('Error creating folder:', err);
      throw err;
    }
  };

  const deleteFolder = async (folderId: string) => {
    try {
      await folderService.deleteFolder(folderId);
      await fetchFolders();

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
      await fetchFolders();

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
    searchQuery,
    searchResults,
    isSearching,
    history,
    historyPointer,

    // Computed
    selectedFolderName,
    hasSearchQuery,
    canGoBack,
    canGoForward,

    // Actions
    fetchFolders,
    fetchSubfolders,
    selectFolder,
    addToHistory,
    goBack,
    goForward,
    searchFolders,
    clearSearch,
    createFolder,
    deleteFolder,
    renameFolder,
  };
});