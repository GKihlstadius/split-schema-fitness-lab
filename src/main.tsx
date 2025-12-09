import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

declare global {
  interface Window {
    __swRegistration?: ServiceWorkerRegistration;
  }
}

const registerServiceWorker = () => {
  if (!('serviceWorker' in navigator)) return;

  // Bara i production-builden
  if (import.meta.env.DEV) return;

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        window.__swRegistration = registration;

        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (!newWorker) return;

          newWorker.addEventListener('statechange', () => {
            if (
              newWorker.state === 'installed' &&
              navigator.serviceWorker.controller
            ) {
              window.dispatchEvent(
                new CustomEvent('swUpdated', { detail: registration })
              );
            }
          });
        });
      })
      .catch((err) => {
        console.error('SW registrering misslyckades:', err);
      });

    navigator.serviceWorker.addEventListener('controllerchange', () => {
      // Ny SW tog över – ladda om för att hämta färska filer
      window.location.reload();
    });
  });
};

registerServiceWorker();

createRoot(document.getElementById('root')!).render(<App />);
