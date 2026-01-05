import { useEffect, useState } from 'react';
import {
  Trophy,
  Rocket,
  Gamepad2,
  Briefcase,
  Mail,
  Users,
  Newspaper,
  Download,
} from 'lucide-react';
import { useI18n } from '../hooks/useI18n';
import { LangDropdown } from '../components/LangDropdown';
import { SectionTitle } from '../components/SectionTitle';
import { submitContactForm } from '../config/contact';

export function HomePage() {
  const { t, locale, setLocale, status, error } = useI18n();
  const [formStatus, setFormStatus] = useState('idle'); // idle | sending | sent | error

  const news = [
    { date: '2025-05-18', title: t('news.items.0.title'), summary: t('news.items.0.summary') },
    { date: '2025-03-02', title: t('news.items.1.title'), summary: t('news.items.1.summary') },
    { date: '2024-11-21', title: t('news.items.2.title'), summary: t('news.items.2.summary') },
  ];

  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;

    // Honeypot check
    if ((form.elements.company?.value || '').trim() !== '') return;

    const name = (form.elements.name?.value || '').trim();
    const email = (form.elements.email?.value || '').trim();
    const subject = (form.elements.subject?.value || '').trim();
    const message = (form.elements.message?.value || '').trim();

    if (!name || !email || !message) return;

    setFormStatus('sending');

    try {
      const ok = await submitContactForm({ name, email, subject, message });
      if (ok) {
        form.reset();
        setFormStatus('sent');
        setTimeout(() => setFormStatus('idle'), 5000);
      } else {
        setFormStatus('error');
      }
    } catch {
      setFormStatus('error');
    }
  }

  return (
    <div className="min-h-screen scroll-smooth">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-[var(--color-base)]/60 border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-3">
          <img
            src="/assets/light-side-logo-clear-512.png"
            alt="LIGHT SIDE logo"
            className="h-11 w-auto shrink-0"
            decoding="async"
            loading="eager"
          />
          <div className="font-bold tracking-tight text-lg">LIGHT SIDE</div>
          <nav className="ml-auto hidden md:flex items-center gap-2">
            {['nav.about', 'nav.games', 'nav.team', 'nav.careers', 'nav.news', 'nav.press', 'nav.contact'].map((k) => (
              <a
                key={k}
                href={'#' + k.split('.')[1]}
                className="px-3 py-2 rounded-xl text-sm hover:text-[var(--color-accent)] hover:bg-white/5 transition"
              >
                {t(k)}
              </a>
            ))}
            <LangDropdown locale={locale} setLocale={setLocale} />
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative">
        <div className="absolute inset-0 -z-10">
          <div className="h-[40rem] bg-gradient-to-b from-[var(--color-accent)]/20 via-white/5 to-transparent blur-3xl"></div>
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-20 md:py-28">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 text-[var(--color-accent)]/90">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-[var(--color-accent)]/15 text-[var(--color-accent)] ring-1 ring-[var(--color-accent)]/30">
                <Trophy className="w-3.5 h-3.5 mr-1" /> {t('hero.pill.indie_studio')}
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-[var(--color-accent)]/15 text-[var(--color-accent)] ring-1 ring-[var(--color-accent)]/30">
                <Rocket className="w-3.5 h-3.5 mr-1" /> {t('hero.pill.meaningful_games')}
              </span>
            </div>
            <h1 className="mt-6 text-4xl md:text-6xl font-extrabold leading-[1.05]">{t('hero.title')}</h1>
            <p className="mt-5 text-lg md:text-xl text-white/80">{t('hero.subtitle')}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#games"
                className="group inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[var(--color-accent)] text-slate-900 font-semibold hover:bg-black hover:text-[var(--color-accent)] hover:translate-y-[-1px] transition"
              >
                <Gamepad2 className="w-5 h-5" /> {t('hero.cta.games')}
              </a>
              <a
                href="#careers"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border border-white/20 hover:bg-white/10"
              >
                <Briefcase className="w-5 h-5" /> {t('hero.cta.careers')}
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border border-white/20 hover:bg-white/10"
              >
                <Mail className="w-5 h-5" /> {t('hero.cta.contact')}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="mx-auto max-w-7xl px-4 py-20">
        <SectionTitle
          icon={<Rocket className="w-4 h-4" />}
          kicker={t('about.kicker')}
          title={t('about.title')}
          subtitle={t('about.subtitle')}
        />
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: t('about.bullets.technical.title'), text: t('about.bullets.technical.text') },
            { title: t('about.bullets.prototype.title'), text: t('about.bullets.prototype.text') },
            { title: t('about.bullets.aesthetics.title'), text: t('about.bullets.aesthetics.text') },
          ].map((b, i) => (
            <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition">
              <h3 className="text-lg font-semibold">{b.title}</h3>
              <p className="mt-2 text-white/70">{b.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Games */}
      <section id="games" className="mx-auto max-w-7xl px-4 py-20">
        <SectionTitle
          icon={<Gamepad2 className="w-4 h-4" />}
          kicker={t('games.kicker')}
          title={t('games.title')}
          subtitle={t('games.subtitle')}
        />
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              id: 'solar',
              title: t('games.solar_run.title'),
              desc: t('games.solar_run.description'),
              status: t('games.solar_run.status'),
            },
          ].map((g) => (
            <a
              key={g.id}
              href="https://play.google.com/store/apps/details?id=com.lightside.tetracrush"
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-2xl overflow-hidden border border-white/10 bg-white/5 hover:bg-white/10"
            >
              <div className="relative aspect-[1/1] overflow-hidden">
                <img src="/assets/tetra-crush-logo.png" alt={g.title} className="w-full h-full object-cover" />
                <div className="absolute left-3 top-3">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-[var(--color-base)] text-[var(--color-accent)] ring-1 shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-accent)_35%,transparent),_0_0_14px_color-mix(in_oklab,var(--color-accent)_65%,transparent)] hover:shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-accent)_50%,transparent),_0_0_22px_color-mix(in_oklab,var(--color-accent)_85%,transparent)] transition-shadow">
                    {g.status}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-white font-semibold text-2xl md:text-3xl text-center leading-tight mb-2 group-hover:text-[var(--color-accent)] transition-colors">
                  {g.title}
                </h3>
                <p className="text-white/80 text-sm">{g.desc}</p>
              </div>
            </a>
          ))}
        </div>
        <div className="mt-8 flex items-center justify-center">
          <a href="#contact" className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border border-white/15 hover:bg-white/10">
            {t('games.request_build')}
          </a>
        </div>
      </section>

      {/* Team */}
      <section id="team" className="mx-auto max-w-7xl px-4 py-20">
        <SectionTitle
          icon={<Users className="w-4 h-4" />}
          kicker={t('team.kicker')}
          title={t('team.title')}
          subtitle={t('team.subtitle')}
        />
        <div className="grid md:grid-cols-4 gap-6">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl p-5 border border-white/10 bg-white/5">
              <div className="h-28 w-28 rounded-2xl bg-[var(--color-accent)]/30 mx-auto"></div>
              <h3 className="mt-4 text-center font-semibold">{t(`team.members.${i}.name`)}</h3>
              <p className="text-center text-sm text-white/70">{t(`team.members.${i}.role`)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Careers */}
      <section id="careers" className="mx-auto max-w-7xl px-4 py-20">
        <SectionTitle
          icon={<Briefcase className="w-4 h-4" />}
          kicker={t('careers.kicker')}
          title={t('careers.title')}
          subtitle={t('careers.subtitle')}
        />
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              t1: 'careers.jobs.senior_engineer.title',
              t2: 'careers.jobs.senior_engineer.type',
              t3: 'careers.jobs.senior_engineer.description',
            },
            {
              t1: 'careers.jobs.game_designer.title',
              t2: 'careers.jobs.game_designer.type',
              t3: 'careers.jobs.game_designer.description',
            },
            {
              t1: 'careers.jobs.hard_surface_artist.title',
              t2: 'careers.jobs.hard_surface_artist.type',
              t3: 'careers.jobs.hard_surface_artist.description',
            },
          ].map((j, i) => (
            <div key={i} className="rounded-2xl p-5 border border-white/10 bg-white/5">
              <h3 className="text-lg font-semibold">{t(j.t1)}</h3>
              <p className="mt-1 text-[var(--color-accent)] text-sm">{t(j.t2)}</p>
              <p className="mt-3 text-white/70 text-sm">{t(j.t3)}</p>
              <a
                href="#contact"
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/15 hover:bg-white/10"
              >
                {t('careers.apply')}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* News */}
      <section id="news" className="mx-auto max-w-7xl px-4 py-20">
        <SectionTitle
          icon={<Newspaper className="w-4 h-4" />}
          kicker={t('news.kicker')}
          title={t('news.title')}
          subtitle={t('news.subtitle')}
        />
        <div className="space-y-4">
          {news.map((n, i) => (
            <div
              key={i}
              className="rounded-2xl p-5 border border-white/10 bg-white/5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div>
                <div className="text-sm text-white/70">{new Date(n.date).toLocaleDateString()}</div>
                <h3 className="text-lg font-semibold mt-1">{n.title}</h3>
                <p className="text-white/70 mt-1">{n.summary}</p>
              </div>
              <a href="#" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/15 hover:bg-white/10">
                {t('news.read')}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Press */}
      <section id="press" className="mx-auto max-w-7xl px-4 py-20">
        <SectionTitle
          icon={<Newspaper className="w-4 h-4" />}
          kicker={t('press.kicker')}
          title={t('press.title')}
          subtitle={t('press.subtitle')}
        />
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl p-5 border border-white/10 bg-white/5">
            <h3 className="font-semibold">{t('press.logo')}</h3>
            <div className="mt-3 aspect-[3/1] rounded-xl border border-white/10 bg-white/5 flex items-center justify-center overflow-hidden">
              <div className="h-24 w-24 bg-[var(--color-accent)]/30 rounded-lg"></div>
            </div>
            <div className="mt-3 flex gap-3">
              <a href="#" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/15 hover:bg-white/10">
                <Download className="w-4 h-4" />
                {t('press.download_png')}
              </a>
            </div>
          </div>
          <div className="rounded-2xl p-5 border border-white/10 bg-white/5">
            <h3 className="font-semibold">{t('press.banner')}</h3>
            <div className="mt-3 aspect-[3/1] rounded-xl border border-white/10 bg-white/5 overflow-hidden"></div>
            <div className="mt-3 flex gap-3">
              <a href="#" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/15 hover:bg-white/10">
                <Download className="w-4 h-4" />
                {t('press.download_image')}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="mx-auto max-w-7xl px-4 py-20">
        <SectionTitle
          icon={<Mail className="w-4 h-4" />}
          kicker={t('contact.kicker')}
          title={t('contact.title')}
          subtitle={t('contact.subtitle')}
        />
        <form id="contactForm" className="grid md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
          <div className="grid gap-3">
            <label htmlFor="contact-name" className="sr-only">{t('contact.form.name')}</label>
            <input
              id="contact-name"
              name="name"
              placeholder={t('contact.form.name')}
              required
              className="px-4 py-3 rounded-xl bg-white/5 border border-white/15 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            />
            <label htmlFor="contact-email" className="sr-only">{t('contact.form.email')}</label>
            <input
              id="contact-email"
              type="email"
              name="email"
              placeholder={t('contact.form.email')}
              required
              className="px-4 py-3 rounded-xl bg-white/5 border border-white/15 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            />
            <label htmlFor="contact-subject" className="sr-only">{t('contact.form.subject')}</label>
            <input
              id="contact-subject"
              name="subject"
              placeholder={t('contact.form.subject')}
              className="px-4 py-3 rounded-xl bg-white/5 border border-white/15 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            />
            {/* Honeypot anti-bot */}
            <input name="company" tabIndex="-1" autoComplete="off" className="sr-only" aria-hidden="true" />
          </div>

          <div className="grid gap-3">
            <label htmlFor="contact-message" className="sr-only">{t('contact.form.message')}</label>
            <textarea
              id="contact-message"
              name="message"
              placeholder={t('contact.form.message')}
              rows="6"
              required
              className="px-4 py-3 rounded-xl bg-white/5 border border-white/15 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            ></textarea>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={formStatus === 'sending'}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[var(--color-accent)] text-slate-900 font-semibold transition duration-200 ease-out hover:translate-y-[-1px] hover:bg-black hover:text-[var(--color-accent)] active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/50 disabled:opacity-50 disabled:pointer-events-none"
              >
                {formStatus === 'sending' ? t('contact.form.sending') : t('contact.form.send')}
              </button>
              <span className="text-sm text-white/70">{t('contact.reply_time')}</span>
            </div>

            <p id="contactHint" className="text-sm text-white/70" role="status" aria-live="polite">
              {formStatus === 'sent' && t('contact.form.sent')}
              {formStatus === 'error' && 'Error sending message. Please try again.'}
            </p>
          </div>
        </form>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/assets/light-side-logo-clear-512.png"
              alt="LIGHT SIDE logo"
              className="h-11 w-auto shrink-0"
              decoding="async"
              loading="eager"
            />
            <span className="text-sm text-white/70">
              &copy; {new Date().getFullYear()} {t('footer.copyright')}
            </span>
          </div>
          <div className="text-sm text-white/70">{t('footer.made_with_love')}</div>
        </div>
      </footer>

      {/* Debug panel (dev only) */}
      {import.meta.env.DEV && (
        <div className="fixed bottom-3 right-3 text-xs px-2 py-1 rounded bg-black/50 backdrop-blur border border-white/10">
          i18n: {status}
          {error ? ' — ' + error : ''} • {locale}
        </div>
      )}
    </div>
  );
}
