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

  // Viktigt: versionen måste vara stabil per build för att undvika evig reload-loop.
  const swVersion =
    import.meta.env.VITE_APP_VERSION ||
    import.meta.env.VITE_COMMIT ||
    import.meta.env.VITE_BUILD_TIME ||
    'v1';
  const swUrl = `/sw.js?v=${swVersion}`;

  window.addEventListener('load', () => {
    let isReloading = false;

    navigator.serviceWorker
      .register(swUrl)
      .then((registration) => {
        window.__swRegistration = registration;

        // Be SW kolla uppdateringar direkt vid start
        registration.update().catch(() => {});

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
      // Ny SW tog över – ladda om för att hämta färska filer, men undvik loop
      if (isReloading) return;
      isReloading = true;
      window.location.reload();
    });
  });
};

registerServiceWorker();

createRoot(document.getElementById('root')!).render(<App />);
