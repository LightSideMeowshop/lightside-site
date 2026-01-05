import React from 'react';
import ReactDOM from 'react-dom/client';
import { initI18n } from './lib/i18n';
import { HomePage } from './pages/HomePage';
import './styles/index.css';

// Import flag-icons CSS
import 'flag-icons/css/flag-icons.min.css';

// Initialize i18n before rendering
initI18n().then(() => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <HomePage />
    </React.StrictMode>
  );
});
