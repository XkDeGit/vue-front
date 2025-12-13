import { createI18n } from 'vue-i18n'
import en from './en/common.json'
import zh from './zh/common.json'

const i18n = createI18n({
  legacy: false, // Use Composition API mode
  locale: 'en', // Default locale
  fallbackLocale: 'en',
  messages: {
    en,
    zh,
  },
})

export default i18n
