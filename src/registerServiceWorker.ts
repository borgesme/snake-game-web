export function registerServiceWorker() {
  if (!('serviceWorker' in navigator) || import.meta.env.DEV) {
    return;
  }

  window.addEventListener('load', () => {
    const serviceWorkerUrl = new URL(
      `${import.meta.env.BASE_URL}service-worker.js`,
      window.location.origin,
    );
    serviceWorkerUrl.searchParams.set('v', __APP_VERSION__);

    navigator.serviceWorker.register(serviceWorkerUrl, {
      scope: import.meta.env.BASE_URL,
    });
  });
}
