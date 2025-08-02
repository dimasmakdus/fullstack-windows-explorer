import { ref } from 'vue';

export const useModals = () => {
  // Add Folder Modal State
  const isAddFolderModalVisible = ref(false);
  const newFolderName = ref('');
  const addFolderError = ref<string | null>(null);

  // Delete Confirmation Modal State
  const isDeleteConfirmModalVisible = ref(false);
  const folderToDeleteId = ref<string | null>(null);
  const folderToDeleteName = ref<string | null>(null);
  const deleteFolderError = ref<string | null>(null);

  // Add Folder Modal Methods
  const showAddFolderModal = () => {
    isAddFolderModalVisible.value = true;
    newFolderName.value = '';
    addFolderError.value = null;
  };

  const hideAddFolderModal = () => {
    isAddFolderModalVisible.value = false;
    newFolderName.value = '';
    addFolderError.value = null;
  };

  const setAddFolderError = (error: string | null) => {
    addFolderError.value = error;
  };

  // Delete Confirmation Modal Methods
  const showDeleteConfirmModal = (folderId: string, folderName: string) => {
    isDeleteConfirmModalVisible.value = true;
    folderToDeleteId.value = folderId;
    folderToDeleteName.value = folderName;
    deleteFolderError.value = null;
  };

  const hideDeleteConfirmModal = () => {
    isDeleteConfirmModalVisible.value = false;
    folderToDeleteId.value = null;
    folderToDeleteName.value = null;
    deleteFolderError.value = null;
  };

  const setDeleteFolderError = (error: string | null) => {
    deleteFolderError.value = error;
  };

  // Generic modal methods
  const closeAllModals = () => {
    hideAddFolderModal();
    hideDeleteConfirmModal();
  };

  return {
    // Add Folder Modal State
    isAddFolderModalVisible,
    newFolderName,
    addFolderError,

    // Delete Confirmation Modal State
    isDeleteConfirmModalVisible,
    folderToDeleteId,
    folderToDeleteName,
    deleteFolderError,

    // Add Folder Modal Methods
    showAddFolderModal,
    hideAddFolderModal,
    setAddFolderError,

    // Delete Confirmation Modal Methods
    showDeleteConfirmModal,
    hideDeleteConfirmModal,
    setDeleteFolderError,

    // Generic methods
    closeAllModals,
  };
};