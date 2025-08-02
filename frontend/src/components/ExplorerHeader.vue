<template>
  <header class="explorer-header">
    <div class="header-controls">
      <button class="control-button back-button" @click="handleGoBack" :disabled="!canGoBack">
        ←
      </button>
      <button class="control-button forward-button" @click="handleGoForward" :disabled="!canGoForward">
        →
      </button>
      <button class="control-button add-folder-button" @click="showAddFolderModal">
        + Tambah Folder
      </button>
      <div class="address-bar">
        <span class="address-icon">📁</span>
        <span class="address-text">This PC > {{ selectedFolderName || 'Home' }}</span>
      </div>
      <input
        type="text"
        :value="searchQuery"
        @input="handleInputSearch"
        placeholder="Cari folder..."
        class="search-input"
      />
      
    </div>
  </header>
</template>

<script setup lang="ts">
defineProps<{
  selectedFolderName: string | null;
  searchQuery: string;
  canGoBack: boolean;
  canGoForward: boolean;
}>();

const emit = defineEmits<{
  (e: 'go-back'): void;
  (e: 'go-forward'): void;
  (e: 'update:searchQuery', query: string): void;
  (e: 'show-add-folder-modal'): void;
}>();

const handleInputSearch = (event: Event) => {
  if (event.target instanceof HTMLInputElement) {
    emit('update:searchQuery', event.target.value)
  }
}

const handleGoBack = () => {
  emit('go-back')
}

const handleGoForward = () => {
  emit('go-forward')
}

const showAddFolderModal = () => {
  emit('show-add-folder-modal')
}
</script>