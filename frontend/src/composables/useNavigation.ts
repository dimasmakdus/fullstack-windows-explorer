import { ref, computed } from 'vue';

export const useNavigation = () => {
  // State
  const history = ref<string[]>([]);
  const historyPointer = ref(-1);

  // Computed
  const canGoBack = computed(() => historyPointer.value > 0);
  const canGoForward = computed(() => historyPointer.value < history.value.length - 1);
  const currentHistoryEntry = computed(() => {
    if (historyPointer.value >= 0 && historyPointer.value < history.value.length) {
      return history.value[historyPointer.value];
    }
    return null;
  });

  // Methods
  const addToHistory = (folderId: string) => {
    // Remove any forward history when adding new entry
    history.value = history.value.slice(0, historyPointer.value + 1);
    history.value.push(folderId);
    historyPointer.value = history.value.length - 1;
  };

  const goBack = (): string | null => {
    if (canGoBack.value) {
      historyPointer.value--;
      return history.value[historyPointer.value];
    }
    return null;
  };

  const goForward = (): string | null => {
    if (canGoForward.value) {
      historyPointer.value++;
      return history.value[historyPointer.value];
    }
    return null;
  };

  const navigateToHistoryIndex = (index: number): string | null => {
    if (index >= 0 && index < history.value.length) {
      historyPointer.value = index;
      return history.value[index];
    }
    return null;
  };

  const clearHistory = () => {
    history.value = [];
    historyPointer.value = -1;
  };

  const getCurrentFolderId = (): string | null => {
    return currentHistoryEntry.value;
  };

  return {
    // State
    history,
    historyPointer,

    // Computed
    canGoBack,
    canGoForward,
    currentHistoryEntry,

    // Methods
    addToHistory,
    goBack,
    goForward,
    navigateToHistoryIndex,
    clearHistory,
    getCurrentFolderId,
  };
};