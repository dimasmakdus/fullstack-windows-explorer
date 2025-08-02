<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <h4>Tambah Folder Baru</h4>
      <p>Masukkan nama untuk folder baru:</p>
      <input
        type="text"
        :value="modelValue"
        @input="handleInputNameFolder"
        placeholder="Nama folder baru...."
        class="modal-input"
        @keyup.enter="handleAddFolder"
      />
      <div class="modal-buttons">
        <button @click="handleAddFolder" class="modal-button primary">Tambah</button>
        <button @click="handleCancel" class="modal-button secondary">Batal</button>
      </div>
      <p v-if="error" class="error-message">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string; // Menggunakan modelValue untuk v-model
  error: string | null;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'add-folder'): void;
  (e: 'cancel'): void;
}>();

const handleInputNameFolder = (event: Event) => {
  if (event.target instanceof HTMLInputElement) {
    emit('update:modelValue', event.target.value);
  }
};

const handleAddFolder = () => {
  emit('add-folder')
}

const handleCancel = () => {
  emit('cancel')
}
</script>

<style scoped>
/* its CSS will apply to elements of the current component only */
@import '@/styles/add_folder_modal.css';
</style>