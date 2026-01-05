import React from 'react';
import ReactDOM from 'react-dom/client';
import { initI18n } from './lib/i18n';
import { HomePage } from './pages/HomePage';
import './styles/index.css';

// Import minimal flag icons (only the 13 flags we use)
import './styles/flags.css';

// Initialize i18n before rendering
initI18n().then(() => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <HomePage />
    </React.StrictMode>
  );
});
