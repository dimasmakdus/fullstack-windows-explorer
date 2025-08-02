import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';

// Import global styles
import '@/styles/variables.css';

const app = createApp(App);

// Add Pinia for state management (optional)
app.use(createPinia());

app.mount('#app');