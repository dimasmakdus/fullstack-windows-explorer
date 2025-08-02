<template>
  <div class="left-panel">
    <h3 class="panel-title">Panel Navigasi</h3>
    <div v-if="folders.length === 0" class="loading-message">Loading folders...</div>
    <ul class="folder-tree">
      <FolderItem
        v-for="folder in folders"
        :key="folder.id"
        :folder="folder"
        :selectedFolderId="selectedFolderId"
        @select-folder="handleSelectFolder($event)"
        @delete-folder="handleDeleteFolder($event)"
      />
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { Folder } from "./../types/folder"
import FolderItem from './FolderItem.vue';

defineProps<{
  folders: Folder[];
  selectedFolderId: string | null;
}>();

const emit = defineEmits<{
  (e: 'select-folder', id: string): void;
  (e: 'delete-folder', id: string, name: string): void;
}>();

const handleSelectFolder = (id: string) => {
  emit('select-folder', id)
}

const handleDeleteFolder = ({id, name}: any) => {
  emit('delete-folder', id, name)
}
</script>