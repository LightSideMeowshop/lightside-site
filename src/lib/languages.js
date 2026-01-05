/**
 * Language configuration
 * Single source of truth for all language-related data
 */

// Supported language codes
export const SUPPORTED_LANGUAGES = [
  'en', 'ru', 'nl', 'fi', 'fr', 'de',
  'id', 'it', 'ms', 'pl', 'pt', 'es', 'tr'
];

// Language metadata: [code, label, flag-icon-code]
export const LANGUAGES = [
  ['en', 'English', 'gb'],
  ['ru', 'Русский', 'ru'],
  ['nl', 'Nederlands', 'nl'],
  ['fi', 'Suomi', 'fi'],
  ['fr', 'Français', 'fr'],
  ['de', 'Deutsch', 'de'],
  ['id', 'Bahasa Indonesia', 'id'],
  ['it', 'Italiano', 'it'],
  ['ms', 'Bahasa Melayu', 'my'],
  ['pl', 'Polski', 'pl'],
  ['pt', 'Português', 'pt'],
  ['es', 'Español', 'es'],
  ['tr', 'Türkçe', 'tr'],
];

/**
 * Get language metadata by code
 * @param {string} code - Language code (e.g., 'en', 'ru')
 * @returns {{ code: string, label: string, flag: string }}
 */
export function getLanguageMeta(code) {
  const found = LANGUAGES.find(([c]) => c === code);
  return found
    ? { code: found[0], label: found[1], flag: found[2] }
    : { code, label: code, flag: 'us' };
}

/**
 * Check if language code is supported
 * @param {string} code - Language code
 * @returns {boolean}
 */
export function isLanguageSupported(code) {
  return SUPPORTED_LANGUAGES.includes(code);
}
