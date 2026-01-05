import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { initI18n } from './lib/i18n';
import { PrivacyPage } from './pages/PrivacyPage';
import './styles/privacy.css';

// Initialize i18n with privacy namespace then render
initI18n({ namespace: 'privacy' }).then(() => {
  createRoot(document.getElementById('privacy-root')).render(
    <StrictMode>
      <PrivacyPage />
    </StrictMode>
  );
});
