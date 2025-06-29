import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { PaymentProvider } from './contexts/PaymentContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <AuthProvider>
        <PaymentProvider>
          <App />
        </PaymentProvider>
      </AuthProvider>
    </LanguageProvider>
  </StrictMode>
);