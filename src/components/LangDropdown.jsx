import { useState, useEffect, useRef, useMemo } from 'react';
import { LANGUAGES, getLanguageMeta } from '../lib/languages';

/**
 * Language selector dropdown component
 */
export function LangDropdown({ locale, setLocale }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const btnRef = useRef(null);

  const currentCode = LANGUAGES.some(([c]) => c === locale) ? locale : 'en';
  const current = getLanguageMeta(currentCode);

  function toggle() {
    setOpen((v) => !v);
  }

  function close() {
    setOpen(false);
  }

  function select(code) {
    setLocale(code);
    close();
  }

  // Close on outside click or Escape
  useEffect(() => {
    function onDocClick(e) {
      if (!menuRef.current || !btnRef.current) return;
      if (!menuRef.current.contains(e.target) && !btnRef.current.contains(e.target)) {
        close();
      }
    }

    function onKey(e) {
      if (e.key === 'Escape') close();
    }

    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onKey);

    return () => {
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  // Focus menu when opened
  useEffect(() => {
    if (open) menuRef.current?.focus();
  }, [open]);

  // Keyboard navigation
  function onMenuKeyDown(e) {
    const opts = Array.from(menuRef.current.querySelectorAll('.lang-option'));
    const idx = opts.findIndex((o) => o === document.activeElement);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      (opts[idx + 1] || opts[0])?.focus();
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      (opts[idx - 1] || opts[opts.length - 1])?.focus();
    }
    if (e.key === 'Enter' && document.activeElement.classList.contains('lang-option')) {
      e.preventDefault();
      document.activeElement.click();
    }
  }

  return (
    <div className="lang-dd">
      <button
        ref={btnRef}
        id="langBtn"
        type="button"
        className="lang-trigger"
        aria-haspopup="listbox"
        aria-expanded={open ? 'true' : 'false'}
        onClick={toggle}
        title="Language"
      >
        <span id="langLabel">
          <span className={`fi fi-${current.flag}`}></span>
          <span>{current.label}</span>
        </span>
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M7 10l5 5 5-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div
        id="langMenu"
        ref={menuRef}
        className={`lang-menu ${open ? 'open' : ''}`}
        role="listbox"
        tabIndex="-1"
        aria-labelledby="langBtn"
        onKeyDown={onMenuKeyDown}
      >
        {LANGUAGES.map(([code]) => {
          const meta = getLanguageMeta(code);
          return (
            <button
              key={code}
              type="button"
              className="lang-option"
              role="option"
              aria-selected={code === currentCode ? 'true' : 'false'}
              onClick={() => select(code)}
            >
              <span className={`fi fi-${meta.flag}`}></span>
              <span>{meta.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
