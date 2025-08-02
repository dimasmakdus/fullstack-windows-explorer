<template>
  <div class="right-panel">
    <h3 class="panel-title">
      {{ currentViewTitle }}
      <span v-if="currentViewTitle !== 'Search Results'" class="panel-subtitle"> (Contents)</span>
    </h3>

    <div v-if="searchQuery.length > 0">
      <div v-if="searchResults.length === 0" class="empty-message">
        <p>No folders found matching "{{ searchQuery }}".</p>
      </div>
      <ul v-else class="subfolder-grid">
        <li v-for="folder in searchResults" :key="folder.id" class="subfolder-item-grid" @click="$emit('select-folder', folder.id)">
          <img src="/folder-icon.png" alt="folder" class="subfolder-icon" />
          <template v-if="editingFolderId === folder.id">
            <input
              type="text"
              v-model="editedName"
              @blur="saveRename"
              @keyup.enter="saveRename"
              @keyup.esc="cancelRename"
              class="rename-input-grid"
              v-focus
            />
          </template>
          <template v-else>
            <span class="subfolder-name">{{ folder.name }}</span>
            <span v-if="folder.parentId" class="search-path-hint">
              ({{ getFullPath(folder.id) }})
            </span>
            <div class="subfolder-actions">
              <button class="action-button rename-button-grid" @click.stop="startRename(folder.id, folder.name)">✏️</button>
              <button class="action-button delete-button-grid" @click.stop="$emit('delete-folder', folder.id, folder.name)">❌</button>
            </div>
          </template>
        </li>
      </ul>
    </div>
    <div v-else>
      <div v-if="currentSubfolders.length === 0" class="empty-message">
        <p v-if="selectedFolderId">Tidak ada subfolder untuk item ini.</p>
        <p v-else>Pilih folder dari panel navigasi untuk melihat isinya.</p>
      </div>
      <ul v-else class="subfolder-grid">
        <li v-for="subfolder in currentSubfolders" :key="subfolder.id" class="subfolder-item-grid" @click="$emit('select-folder', subfolder.id)">
          <img src="/folder-icon.png" alt="folder" class="subfolder-icon" />
          <template v-if="editingFolderId === subfolder.id">
            <input
              type="text"
              v-model="editedName"
              @blur="saveRename"
              @keyup.enter="saveRename"
              @keyup.esc="cancelRename"
              class="rename-input-grid"
              v-focus
            />
          </template>
          <template v-else>
            <span class="subfolder-name">{{ subfolder.name }}</span>
            <div class="subfolder-actions">
              <button class="action-button rename-button-grid" @click.stop="startRename(subfolder.id, subfolder.name)">✏️</button>
              <button class="action-button delete-button-grid" @click.stop="$emit('delete-folder', subfolder.id, subfolder.name)">❌</button>
            </div>
          </template>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Folder } from "./../types/folder"
import { ref } from 'vue';
import { findFolderByIdInTree } from '@/utils/folderUtils';

const props = defineProps<{
  selectedFolderId: string | null;
  currentSubfolders: Folder[];
  searchQuery: string;
  searchResults: Folder[];
  currentViewTitle: string;
  allFolders: Folder[]; // Diperlukan untuk getFullPath
}>();

const emit = defineEmits<{
  (e: 'select-folder', id: string): void;
  (e: 'delete-folder', id: string, name: string): void;
  (e: 'rename-folder', id: string, newName: string): void;
}>();

// State
const editingFolderId = ref<string | null>(null); // ID folder yang sedang diedit namanya
const editedName = ref(''); // Nama baru yang diketik pengguna

// Custom directive untuk fokus otomatis pada input rename
const vFocus = {
  mounted: (el: HTMLElement) => el.focus()
};

// Helper untuk mendapatkan full path dari folder yang ditemukan di pencarian
const getFullPath = (folderId: string) => {
  const path: string[] = [];
  let currentFolder = findFolderByIdInTree(props.allFolders, folderId);

  while (currentFolder) {
    path.unshift(currentFolder.name);
    currentFolder = currentFolder.parentId ? findFolderByIdInTree(props.allFolders, currentFolder.parentId) : null;
  }
  return path.join(' > ');
};

const startRename = (folderId: string, currentName: string) => {
  editingFolderId.value = folderId;
  editedName.value = currentName;
};

const saveRename = () => {
  if (!editingFolderId.value) return; // Tidak ada folder yang sedang diedit

  const oldName = findFolderByIdInTree(props.allFolders, editingFolderId.value)?.name;

  if (editedName.value.trim() === '' || editedName.value === oldName) {
    cancelRename(); // Batalkan jika kosong atau tidak berubah
    return;
  }
  emit('rename-folder', editingFolderId.value, editedName.value.trim());
  editingFolderId.value = null; // Keluar dari mode editing
};

const cancelRename = () => {
  editingFolderId.value = null;
  editedName.value = ''; // Reset nama
};

</script>