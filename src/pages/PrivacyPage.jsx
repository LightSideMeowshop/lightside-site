import { useState, useEffect, useRef } from 'react';
import { useI18n } from '../hooks/useI18n';
import { LangDropdown } from '../components/LangDropdown';

// Site settings for privacy policy
const SETTINGS = {
  companyName: 'Light Side',
  legalEntity: 'Light Side LLC',
  address: 'Georgia, Tbilisi, Saburtalo district, Bakhtrioni street, N22, flat N75',
  contact: 'privacy@lightside.media',
  effective: '2025-08-10',
  appsList: 'Light Side Gaming Business Unit',
  hasAccounts: false,
  hasCookiesBanner: true,
};

// Privacy policy sections
const SECTIONS = [
  { id: 'who', key: 'who', open: true },
  { id: 'scope', key: 'scope', open: true },
  { id: 'data', key: 'data', hasList: true, listKeys: ['d_usage', 'd_progress', 'd_purchases', 'd_ads', 'd_support'] },
  { id: 'legal', key: 'legal' },
  { id: 'ads', key: 'optout' },
  { id: 'att', key: 'att' },
  { id: 'sdks', key: 'sdks', hasGrid: true },
  { id: 'sharing', key: 'share' },
  { id: 'intl', key: 'intl' },
  { id: 'kids', key: 'kids' },
  { id: 'rights', key: 'rights' },
  { id: 'cookies', key: 'cookies' },
  { id: 'accounts', key: 'acct' },
  { id: 'ugc', key: 'ugc' },
  { id: 'security', key: 'sec' },
  { id: 'changes', key: 'chg' },
  { id: 'contact', key: 'ct' },
  { id: 'definitions', key: 'defs' },
];

function formatDate(isoDate, locale) {
  const [y, m, d] = isoDate.split('-').map((n) => parseInt(n, 10));
  const dt = new Date(Date.UTC(y, m - 1, d));
  try {
    return new Intl.DateTimeFormat(locale, { dateStyle: 'long', timeZone: 'UTC' }).format(dt);
  } catch {
    return dt.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
  }
}

function PolicySection({ id, titleKey, bodyKey, open, children, openSections, toggleSection }) {
  const { t } = useI18n();
  const isOpen = openSections.has(id);

  function handleToggle(e) {
    e.preventDefault();
    toggleSection(id);
    // Copy link when opening
    if (!isOpen) {
      const url = window.location.origin + window.location.pathname + '#' + id;
      navigator.clipboard.writeText(url).catch(() => {});
    }
  }

  return (
    <details open={isOpen} className="policy-details">
      <summary id={id} className="section" onClick={handleToggle}>
        {t(titleKey, SETTINGS)}
      </summary>
      <div>
        {children || <span dangerouslySetInnerHTML={{ __html: t(bodyKey, SETTINGS) }} />}
      </div>
    </details>
  );
}

export function PrivacyPage() {
  const { t, locale, setLocale, status } = useI18n();
  const [openSections, setOpenSections] = useState(new Set(['who', 'scope']));
  const [headerHidden, setHeaderHidden] = useState(false);
  const lastScrollY = useRef(0);

  // Header hide/show on scroll
  useEffect(() => {
    const showOnUpDelta = 8;
    const startHideAfter = 64;

    function onScroll() {
      const y = window.scrollY;
      const goingDown = y > lastScrollY.current;
      const delta = Math.abs(y - lastScrollY.current);

      if (goingDown && y > startHideAfter && delta > 2) {
        setHeaderHidden(true);
      } else if (!goingDown && delta > showOnUpDelta) {
        setHeaderHidden(false);
      }
      lastScrollY.current = y;
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function toggleSection(id) {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function expandAll() {
    setOpenSections(new Set(SECTIONS.map((s) => s.id)));
  }

  function collapseAll() {
    setOpenSections(new Set());
  }

  function copyLink() {
    const openSection = SECTIONS.find((s) => openSections.has(s.id));
    const id = openSection?.id || '';
    const url = window.location.origin + window.location.pathname + (id ? '#' + id : '');
    navigator.clipboard.writeText(url).catch(() => {});
  }

  return (
    <div className="privacy-page">
      {/* Header */}
      <header className={`header ${headerHidden ? 'is-hidden' : ''}`}>
        <div className="wrap">
          <div className="brandline">
            <a href="/" className="logo" aria-label="Home"></a>
            <div className="brand">Light Side</div>
          </div>
          <div className="controls">
            <LangDropdown locale={locale} setLocale={setLocale} />
            <button className="btn" onClick={expandAll}>
              {t('btn_expand')}
            </button>
            <button className="btn" onClick={collapseAll}>
              {t('btn_collapse')}
            </button>
            <button className="btn" onClick={() => window.print()}>
              {t('btn_print')}
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="wrap">
        <div className="card" style={{ padding: '18px 20px' }}>
          <div className="title">{t('pp_title')}</div>
          <div className="muted">
            {t('updated')}: <span>{formatDate(SETTINGS.effective, locale)}</span>
          </div>
          <div className="summary card" style={{ marginTop: '14px' }}>
            <div className="badge">
              ✔ <span dangerouslySetInnerHTML={{ __html: t('sum_global', SETTINGS) }} />
            </div>
            <div className="badge">
              🧰 <span dangerouslySetInnerHTML={{ __html: t('sum_sdks', SETTINGS) }} />
            </div>
            <div className="badge">
              🚫 <span dangerouslySetInnerHTML={{ __html: t('sum_no_sell', SETTINGS) }} />
            </div>
            <div className="badge">
              👶 <span dangerouslySetInnerHTML={{ __html: t('sum_kids', SETTINGS) }} />
            </div>
          </div>
        </div>

        <section style={{ marginTop: '18px' }}>
          {SECTIONS.map((section, idx) => (
            <PolicySection
              key={section.id}
              id={section.id}
              titleKey={`${section.key}_t`}
              bodyKey={`${section.key}_b`}
              open={section.open}
              openSections={openSections}
              toggleSection={toggleSection}
            >
              {section.hasList && (
                <ul>
                  {section.listKeys.map((key) => (
                    <li key={key} dangerouslySetInnerHTML={{ __html: t(key, SETTINGS) }} />
                  ))}
                </ul>
              )}
              {section.hasGrid && (
                <>
                  <div className="grid2">
                    <div>
                      <h3>Firebase Analytics / Crashlytics</h3>
                      <p dangerouslySetInnerHTML={{ __html: t('sdk_firebase', SETTINGS) }} />
                    </div>
                    <div>
                      <h3>Google AdMob / Unity Ads</h3>
                      <p dangerouslySetInnerHTML={{ __html: t('sdk_ads', SETTINGS) }} />
                    </div>
                    <div>
                      <h3>Google Play Games Services</h3>
                      <p dangerouslySetInnerHTML={{ __html: t('sdk_play', SETTINGS) }} />
                    </div>
                    <div>
                      <h3>AppsFlyer</h3>
                      <p dangerouslySetInnerHTML={{ __html: t('sdk_af', SETTINGS) }} />
                    </div>
                  </div>
                  <p className="note" dangerouslySetInnerHTML={{ __html: t('processors_note', SETTINGS) }} />
                </>
              )}
              {!section.hasList && !section.hasGrid && (
                <span dangerouslySetInnerHTML={{ __html: t(`${section.key}_b`, SETTINGS) }} />
              )}
            </PolicySection>
          ))}
        </section>

        <div className="foot card">
          <div className="note">
            {t('foot_note')}
            <button className="btn copy" onClick={copyLink}>
              {t('btn_copy')}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
