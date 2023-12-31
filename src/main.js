import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import VeeValidatePlugin from "@/includes/validation";
import { auth, onAuthStateChanged } from '@/includes/firebase';
import Icon from '@/directives/icon';
import i18n from '@/includes/i18n';
import { registerSW } from 'virtual:pwa-register';
import GlobalComponent from '@/includes/_globals.js';

import './assets/base.css';
import './assets/main.css';

registerSW({ immediate: true });

let app;

onAuthStateChanged(auth, () => {
  if (!app) {
    app = createApp(App);
    app.use(createPinia());
    app.use(router);
    app.use(VeeValidatePlugin);
    app.use(i18n);
    app.use(GlobalComponent);
    app.directive('icon', Icon);
    
    app.mount('#app')
  }
});

