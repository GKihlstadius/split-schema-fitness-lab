import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

declare global {
  interface Window {
    __swRegistration?: ServiceWorkerRegistration;
  }
  const __APP_VERSION__: string;
  const __BUILD_TIME__: string;
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
    (typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : undefined) ||
    (typeof __BUILD_TIME__ !== 'undefined' ? __BUILD_TIME__ : undefined) ||
    'v1';
  const swUrl = `/sw-v2.js?v=${swVersion}`;

  const forceActivate = (registration: ServiceWorkerRegistration) => {
    const waiting = registration.waiting;
    if (waiting) {
      waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  };

  let isReloading = false;

  window.addEventListener('load', () => {

    navigator.serviceWorker
      .getRegistrations()
      .then((registrations) => {
        // Avregistrera äldre SW (t.ex. sw.js) för att undvika fastnade versioner
        registrations.forEach((reg) => {
          if (!reg.active) return;
          if (!reg.active.scriptURL.endsWith('sw-v2.js')) {
            reg.unregister().catch(() => {});
          }
        });
      })
      .catch(() => {});

    navigator.serviceWorker
      .register(swUrl, { updateViaCache: 'none' })
      .then((registration) => {
        window.__swRegistration = registration;

        // Be SW kolla uppdateringar direkt vid start
        registration.update().catch(() => {});

        // Upprepa uppdateringskoll var 6:e timme
        setInterval(() => registration.update().catch(() => {}), 6 * 60 * 60 * 1000);

        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (!newWorker) return;

          newWorker.addEventListener('statechange', () => {
            if (
              newWorker.state === 'installed' &&
              navigator.serviceWorker.controller
            ) {
              // Aggressiv auto-aktivering av ny SW
              forceActivate(registration);
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

    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'RELOAD_PAGE') {
        if (isReloading) return;
        isReloading = true;
        window.location.reload();
      }
    });
  });
};

registerServiceWorker();

createRoot(document.getElementById('root')!).render(<App />);
