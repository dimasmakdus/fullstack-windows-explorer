import { ref, computed } from 'vue';
import type { Folder } from '@/types/folder';
import { folderService } from '@/services/folderService';

export const useSearch = () => {
  // State
  const searchQuery = ref('');
  const searchResults = ref<Folder[]>([]);
  const isSearching = ref(false);
  const searchError = ref<string | null>(null);

  let searchTimeout: ReturnType<typeof setTimeout> | null = null;

  // Computed
  const hasSearchQuery = computed(() => searchQuery.value.trim().length > 0);
  const searchResultsCount = computed(() => searchResults.value.length);

  // Methods
  const performSearch = async () => {
    if (!searchQuery.value.trim()) {
      searchResults.value = [];
      return;
    }

    try {
      isSearching.value = true;
      searchError.value = null;

      searchResults.value = await folderService.searchFolders(searchQuery.value);
    } catch (err: any) {
      console.error('Error searching folders:', err);
      searchError.value = err.message;
      searchResults.value = [];
    } finally {
      isSearching.value = false;
    }
  };

  const handleSearchInput = (query: string) => {
    searchQuery.value = query;

    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Debounce search
    searchTimeout = setTimeout(() => {
      performSearch();
    }, 300);
  };

  const clearSearch = () => {
    searchQuery.value = '';
    searchResults.value = [];
    searchError.value = null;

    if (searchTimeout) {
      clearTimeout(searchTimeout);
      searchTimeout = null;
    }
  };

  return {
    // State
    searchQuery,
    searchResults,
    isSearching,
    searchError,

    // Computed
    hasSearchQuery,
    searchResultsCount,

    // Methods
    handleSearchInput,
    performSearch,
    clearSearch,
  };
};