<template>
  <div class="explorer-container">
    <ExplorerHeader
      :selectedFolderName="selectedFolderName"
      :searchQuery="searchQuery"
      :canGoBack="canGoBack"
      :canGoForward="canGoForward"
      @go-back="handleGoBack"
      @go-forward="handleGoForward"
      @update:searchQuery="handleSearchInput"
      @show-add-folder-modal="showAddFolderModal"
    />

    <div class="main-content">
      <NavigationPanel
        :folders="folders"
        :selectedFolderId="selectedFolderId"
        @select-folder="handleSelectFolder"
        @delete-folder="handleDeleteFolder"
        @rename-folder="handleRenameFolder"
      />

      <ContentPanel
        :selectedFolderId="selectedFolderId"
        :currentSubfolders="currentSubfolders"
        :searchQuery="searchQuery"
        :searchResults="searchResults"
        :currentViewTitle="currentViewTitle"
        :allFolders="folders"
        @select-folder="handleSelectFolder"
        @delete-folder="handleDeleteFolder"
        @rename-folder="handleRenameFolder"
      />
    </div>

    <footer class="explorer-footer">
      <span class="status-text">
        <span v-if="hasSearchQuery">{{ searchResultsCount }} results</span>
        <span v-else>{{ currentSubfolders.length }} items</span>
      </span>
    </footer>

    <!-- Modals -->
    <AddFolderModal
      v-if="isAddFolderModalVisible"
      v-model="newFolderName"
      :error="addFolderError"
      @add-folder="handleAddFolder"
      @cancel="hideAddFolderModal"
    />

    <DeleteConfirmModal
      v-if="isDeleteConfirmModalVisible"
      :folderName="folderToDeleteName"
      :error="deleteFolderError"
      @confirm="handleConfirmDelete"
      @cancel="hideDeleteConfirmModal"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import ExplorerHeader from '@/components/ExplorerHeader.vue';
import NavigationPanel from '@/components/NavigationPanel.vue';
import ContentPanel from '@/components/ContentPanel.vue';
import AddFolderModal from '@/components/AddFolderModal.vue';
import DeleteConfirmModal from '@/components/DeleteConfirmModal.vue';

import { useFolders } from '@/composables/useFolders';
import { useSearch } from '@/composables/useSearch';
import { useNavigation } from '@/composables/useNavigation';
import { useModals } from '@/composables/useModals';
import { isValidFolderName } from '@/utils/folderUtils';

// Composables
const {
  folders,
  selectedFolderId,
  currentSubfolders,
  selectedFolderName,
  fetchFolders,
  selectFolder,
  createFolder,
  deleteFolder,
  renameFolder,
} = useFolders();

const {
  searchQuery,
  searchResults,
  hasSearchQuery,
  searchResultsCount,
  handleSearchInput,
  clearSearch,
} = useSearch();

const {
  canGoBack,
  canGoForward,
  addToHistory,
  goBack,
  goForward,
} = useNavigation();

const {
  isAddFolderModalVisible,
  newFolderName,
  addFolderError,
  isDeleteConfirmModalVisible,
  folderToDeleteId,
  folderToDeleteName,
  deleteFolderError,
  showAddFolderModal,
  hideAddFolderModal,
  setAddFolderError,
  showDeleteConfirmModal,
  hideDeleteConfirmModal,
  setDeleteFolderError,
} = useModals();

// Computed
const currentViewTitle = computed(() => {
  if (hasSearchQuery.value) {
    return 'Search Results';
  }
  return selectedFolderName.value || 'Select a folder';
});

// Methods
const handleSelectFolder = (folderId: string) => {
  if (folderId !== selectedFolderId.value) {
    selectFolder(folderId);
    addToHistory(folderId);
    clearSearch();
  }
};

const handleGoBack = () => {
  const targetFolderId = goBack();
  if (targetFolderId) {
    selectFolder(targetFolderId, true);
    clearSearch();
  }
};

const handleGoForward = () => {
  const targetFolderId = goForward();
  if (targetFolderId) {
    selectFolder(targetFolderId, true);
    clearSearch();
  }
};

const handleAddFolder = async () => {
  setAddFolderError(null);
  
  if (!isValidFolderName(newFolderName.value)) {
    setAddFolderError('Folder name cannot be empty.');
    return;
  }

  try {
    await createFolder(newFolderName.value, selectedFolderId.value);
    hideAddFolderModal();
  } catch (error: any) {
    setAddFolderError(`Failed to add folder: ${error.message}`);
  }
};

const handleDeleteFolder = (folderId: string, folderName: string) => {
  showDeleteConfirmModal(folderId, folderName);
};

const handleConfirmDelete = async () => {
  if (!folderToDeleteId.value) return;

  setDeleteFolderError(null);

  try {
    await deleteFolder(folderToDeleteId.value);
    hideDeleteConfirmModal();
  } catch (error: any) {
    setDeleteFolderError(`Failed to delete folder: ${error.message}`);
  }
};

const handleRenameFolder = async (folderId: string, newName: string) => {
  if (!isValidFolderName(newName)) {
    alert('Rename failed: New name cannot be empty.');
    return;
  }

  try {
    await renameFolder(folderId, newName);
  } catch (error: any) {
    alert(`Failed to rename folder: ${error.message}`);
  }
};

// Lifecycle
onMounted(() => {
  fetchFolders();
});
</script>