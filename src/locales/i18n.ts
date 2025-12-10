import { createI18n } from 'vue-i18n';
import en from './en/common.json';
import zh from './zh/common.json';

export const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    zh
  }
});
