<template>
  <div class="modal-overlay">
    <div class="modal-content danger-modal">
      <h4>Konfirmasi Menghapus Folder</h4>
      <p>Apakah Anda yakin ingin menghapus folder **"{{ folderName }}"**?</p>
      <p class="warning-text">Tindakan ini tidak dapat dibatalkan dan akan menghapus semua subfoldernya!</p>
      <div class="modal-buttons">
        <button @click="handleConfirm" class="modal-button danger">Hapus</button>
        <button @click="handleCancel" class="modal-button secondary">Batal</button>
      </div>
      <p v-if="error" class="error-message">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  folderName: string | null;
  error: string | null;
}>();

const emit = defineEmits<{
  (e: 'confirm'): void;
  (e: 'cancel'): void;
}>();

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('cancel')
}
</script>

<style scoped>
/* its CSS will apply to elements of the current component only */
@import '@/styles/delete_folder_modal.css';
</style>