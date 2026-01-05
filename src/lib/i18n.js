import i18next from 'i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import ICU from 'i18next-icu';
import { SUPPORTED_LANGUAGES } from './languages';

// Version for cache invalidation (update on deploy)
export const I18N_ASSETS_VERSION = '2025-08-12';

// Initialize i18next
const i18n = i18next
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(ICU);

export async function initI18n(options = {}) {
  const { namespace = 'common' } = options;

  await i18n.init({
    debug: import.meta.env.DEV,
    fallbackLng: (code) => {
      const lang = code?.split('-')[0];
      const fallbacks = [lang, 'en'].filter(Boolean);
      return [...new Set(fallbacks)];
    },
    supportedLngs: SUPPORTED_LANGUAGES,
    nonExplicitSupportedLngs: true,
    load: 'languageOnly',
    ns: [namespace],
    defaultNS: namespace,
    backend: {
      loadPath: `locales/{{lng}}/{{ns}}.json?v=${I18N_ASSETS_VERSION}`,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'ls.locale',
    },
    interpolation: {
      escapeValue: false,
    },
    ...options,
  });

  return i18n;
}

export default i18n;
