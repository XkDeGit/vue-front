import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import { createPinia } from 'pinia';
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query';
import App from './App.vue';
import router from './router';
import { i18n } from './locales/i18n';
import './styles/theme.css';

const app = createApp(App);
const pinia = createPinia();
const queryClient = new QueryClient();

app.use(pinia);
app.use(router);
app.use(ElementPlus);
app.use(VueQueryPlugin, { queryClient });
app.use(i18n);

app.mount('#app');
