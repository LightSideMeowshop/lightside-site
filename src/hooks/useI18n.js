import { useState, useEffect, useCallback } from 'react';
import i18n from '../lib/i18n';

/**
 * React hook for i18next integration
 * Handles language changes and translation updates
 */
export function useI18n() {
  const [, forceUpdate] = useState(0);
  const [status, setStatus] = useState(i18n.isInitialized ? 'ok' : 'loading');
  const [error, setError] = useState('');

  useEffect(() => {
    const rerender = () => forceUpdate((x) => x + 1);

    const onInit = () => {
      setStatus('ok');
      rerender();
    };

    const onLang = () => {
      setStatus('ok');
      rerender();
    };

    const onLoad = () => {
      setStatus('ok');
      rerender();
    };

    const onFail = (_lng, _ns, msg) => {
      setStatus('error');
      setError(String(msg || 'load failed'));
    };

    i18n.on('initialized', onInit);
    i18n.on('languageChanged', onLang);
    i18n.on('loaded', onLoad);
    i18n.on('failedLoading', onFail);

    return () => {
      i18n.off('initialized', onInit);
      i18n.off('languageChanged', onLang);
      i18n.off('loaded', onLoad);
      i18n.off('failedLoading', onFail);
    };
  }, []);

  const t = useCallback((key, options) => i18n.t(key, options), [i18n.language]);

  const setLocale = useCallback((code) => i18n.changeLanguage(code), []);

  return {
    t,
    locale: i18n.language || 'en',
    setLocale,
    status,
    error,
    isReady: status === 'ok',
  };
}
