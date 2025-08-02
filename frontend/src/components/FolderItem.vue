<template>
  <li :class="{ 'folder-item': true, selected: folder.id === selectedFolderId }">
    <div class="folder-header" @click.stop="toggleChildren">
      <span v-if="hasChildren" class="toggle-icon">{{ isOpen ? '▼' : '►' }}</span>
      <span v-else class="toggle-icon-placeholder"></span>
      <img src="/folder-icon.png" alt="folder" class="folder-icon" />

      <template v-if="isEditing">
        <input
          type="text"
          v-model="editedName"
          @blur="saveRename"
          @keyup.enter="saveRename"
          @keyup.esc="cancelRename"
          class="rename-input"
          v-focus
        />
      </template>
      <template v-else>
        <span class="folder-name" @click.stop="emitSelectFolder">{{ folder.name }}</span>
        <!-- <div class="folder-actions">
          <button class="action-button rename-button" @click.stop="startRename">✏️</button> 
          <button class="action-button delete-button" @click.stop="emitDeleteFolder">❌</button> 
        </div> -->
      </template>
    </div>
    <ul v-if="isOpen && hasChildren" class="sub-folders">
      <FolderItem
        v-for="subFolder in folder.children"
        :key="subFolder.id"
        :folder="subFolder"
        :selectedFolderId="selectedFolderId"
        @select-folder="handleSelectFolder($event)"
        @delete-folder="handleDeleteFolder($event)"
        @rename-folder="handleRenameFolder($event)" />
    </ul>
  </li>
</template>

<script setup lang="ts">
import type { Folder } from "./../types/folder"
import { ref, computed } from 'vue';

const props = defineProps<{
  folder: Folder;
  selectedFolderId: string | null;
}>();

const emit = defineEmits<{
  (e: 'select-folder', id: string): void;
  (e: 'delete-folder', id: string, name: string): void;
  (e: 'rename-folder', id: string, newName: string): void;
}>();

const handleSelectFolder = (id: string) => {
  emit('select-folder', id)
}

const handleDeleteFolder = ({id, name}: any) => {
  emit('delete-folder', id, name)
}

const handleRenameFolder = ({id, newName}: any) => {
  emit('rename-folder', id, newName)
}

const isOpen = ref(false);
const isEditing = ref(false); // State untuk mode edit nama
const editedName = ref(props.folder.name); // Variabel untuk input nama baru

const hasChildren = computed(() => props.folder.children && props.folder.children.length > 0);

// Custom directive untuk fokus otomatis pada input rename
const vFocus = {
  mounted: (el: HTMLElement) => el.focus()
};

const toggleChildren = () => {
  if (hasChildren.value) {
    isOpen.value = !isOpen.value;
  }
  if (!isEditing.value) { // Hanya select jika tidak dalam mode editing
    emitSelectFolder();
  }
};

const emitSelectFolder = () => {
  emit('select-folder', props.folder.id);
};

// const emitDeleteFolder = () => {
//   emit('delete-folder', props.folder.id, props.folder.name);
// };

// const startRename = () => {
//   isEditing.value = true;
//   editedName.value = props.folder.name; // Reset nama saat memulai edit
// };

const saveRename = () => {
  if (editedName.value.trim() === '' || editedName.value === props.folder.name) {
    cancelRename(); // Batalkan jika kosong atau tidak berubah
    return;
  }
  emit('rename-folder', props.folder.id, editedName.value.trim());
  isEditing.value = false;
};

const cancelRename = () => {
  isEditing.value = false;
  editedName.value = props.folder.name; // Reset ke nama asli
};
</script>