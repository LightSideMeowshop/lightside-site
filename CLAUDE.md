# LIGHT SIDE Website — Project Guide

## Tech Stack

- **Build**: Vite 6
- **Frontend**: React 18 + JSX
- **Styling**: Tailwind CSS 3.4 + CSS Custom Properties
- **i18n**: i18next with HTTP backend, browser language detection, ICU plurals
- **Icons**: lucide-react (React components), flag-icons (CSS)
- **Hosting**: GitHub Pages (static build)

## Project Structure

```
Site/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── LangDropdown.jsx
│   │   └── SectionTitle.jsx
│   ├── config/           # App configuration
│   │   └── contact.js    # Contact form API endpoint
│   ├── hooks/            # React hooks
│   │   └── useI18n.js    # i18next integration hook
│   ├── lib/              # Shared utilities
│   │   ├── i18n.js       # i18next initialization
│   │   └── languages.js  # Language constants (SUPPORTED_LANGUAGES, LANGUAGES)
│   ├── pages/            # Page components
│   │   └── HomePage.jsx
│   ├── styles/
│   │   └── index.css     # Global styles + Tailwind + CSS variables
│   └── main.jsx          # App entry point
├── public/               # Static assets (copied to dist/ as-is)
│   ├── locales/          # i18n JSON files (13 languages)
│   │   └── {lang}/common.json, privacy.json
│   ├── assets/           # Images (logos, etc.)
│   └── favicon files...
├── index.html            # Main page (Vite entry)
├── privacy.html          # Privacy policy (vanilla JS, not React)
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Key Decisions & Conventions

### CSS Variables (Design Tokens)
All brand colors and design values are defined in `src/styles/index.css`:
```css
:root {
  --color-accent: #ff9f1b;  /* Orange - primary action color */
  --color-base: #5f4088;    /* Purple - background color */
}
```
**Always use CSS variables** for colors, not hardcoded hex values. Use `var(--color-accent)` instead of `#ff9f1b`.

### Static Assets
- All static files go in `public/` folder
- They're copied to `dist/` root during build
- Reference them with absolute paths: `/assets/logo.png`, `/locales/en/common.json`

### Localization
- All user-facing text must go through `t()` function from `useI18n` hook
- Translation keys live in `public/locales/{lang}/common.json`
- Add new keys to ALL 13 language files
- Version cache busting: update `I18N_ASSETS_VERSION` in `src/lib/i18n.js` on deploy

### Components
- Use `lucide-react` icons as React components, not Lucide CDN
- Language dropdown uses `flag-icons` CSS classes: `fi fi-{code}`
- Section titles should use `<SectionTitle>` component for consistency

### Feature Toggles
Sections can be hidden via `data-hide` attribute on `<body>`:
```html
<body data-hide="team careers news press partners">
```
Hidden sections are controlled by CSS selectors in `src/styles/index.css`.

## Commands

```bash
npm install      # Install dependencies
npm run dev      # Start dev server (localhost:3000)
npm run build    # Build for production (→ dist/)
npm run preview  # Preview production build
```

## Deployment

1. Run `npm run build`
2. Deploy contents of `dist/` folder to GitHub Pages
3. All static files (locales, assets, favicons) are already included in `dist/`

## Important Notes

- **privacy.html** is still vanilla JS (not React) — uses same i18n setup but different implementation
- **Contact form** sends to Google Apps Script endpoint (see `src/config/contact.js`)
- **Debug panel** only shows in development mode (`import.meta.env.DEV`)
- Old index.html backup: `index.old.html` (can be deleted after verification)

## Adding New Languages

1. Create folder `public/locales/{lang}/`
2. Add `common.json` and `privacy.json` with translations
3. Add language to `src/lib/languages.js`:
   - Add code to `SUPPORTED_LANGUAGES` array
   - Add `[code, label, flagCode]` to `LANGUAGES` array

## Troubleshooting

- **Images not loading**: Check paths start with `/` (e.g., `/assets/logo.png`)
- **Translations not updating**: Update `I18N_ASSETS_VERSION` in `src/lib/i18n.js`
- **Build errors**: Run `npm install` to ensure all dependencies are installed
