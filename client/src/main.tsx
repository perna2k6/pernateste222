import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Render the React app
createRoot(document.getElementById("root")!).render(<App />);

// Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none' // Always check for updates
      });

      console.log('[PWA] Service Worker registered successfully:', registration.scope);

      // Handle service worker updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        console.log('[PWA] New service worker installing...');
        
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                // New content is available, prompt user to refresh
                console.log('[PWA] New content available, will refresh on next visit');
                showUpdateAvailableNotification();
              } else {
                // Content is cached for offline use
                console.log('[PWA] Content is cached for offline use');
                showOfflineReadyNotification();
              }
            }
          });
        }
      });

      // Check for updates periodically (every 10 minutes)
      setInterval(async () => {
        try {
          await registration.update();
          console.log('[PWA] Checked for service worker updates');
        } catch (error) {
          console.log('[PWA] Failed to check for updates:', error);
        }
      }, 10 * 60 * 1000);

    } catch (error) {
      console.error('[PWA] Service Worker registration failed:', error);
    }
  });

  // Handle controlled page (when SW takes control)
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    console.log('[PWA] New service worker activated, reloading page');
    window.location.reload();
  });

  // Handle service worker messages
  navigator.serviceWorker.addEventListener('message', (event) => {
    console.log('[PWA] Received message from service worker:', event.data);
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
      window.location.reload();
    }
  });
} else {
  console.warn('[PWA] Service Workers are not supported in this browser');
}

// Utility functions for user notifications
function showUpdateAvailableNotification() {
  // You can integrate with your existing toast system here
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('Nova versão disponível!', {
      body: 'Uma nova versão do app está disponível. Atualize para a versão mais recente.',
      icon: '/pwa-192x192.png',
      tag: 'pwa-update'
    });
  }
  
  // Fallback to console for now - can be integrated with toast system
  console.log('[PWA] App update available - will load new version on next visit');
}

function showOfflineReadyNotification() {
  console.log('[PWA] App is ready for offline use');
  
  // Request notification permission for better user experience
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission().then(permission => {
      console.log('[PWA] Notification permission:', permission);
    });
  }
}

// Handle app installation prompt
let deferredPrompt: any;

window.addEventListener('beforeinstallprompt', (e) => {
  console.log('[PWA] Install prompt triggered');
  
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  
  // Stash the event so it can be triggered later
  deferredPrompt = e;
  
  // Show your custom install button/banner
  showInstallPromotion();
});

window.addEventListener('appinstalled', () => {
  console.log('[PWA] App was successfully installed');
  
  // Hide install promotion
  hideInstallPromotion();
  
  // Clear the deferredPrompt so it can be garbage collected
  deferredPrompt = null;
});

function showInstallPromotion() {
  // This can be integrated with your UI to show an install banner
  console.log('[PWA] App can be installed - showing install promotion');
  
  // You can create a custom banner or button here
  // For now, we'll just log it
}

function hideInstallPromotion() {
  console.log('[PWA] Hiding install promotion');
}

// Export function to trigger installation (can be called from UI)
(window as any).triggerPWAInstall = async () => {
  if (deferredPrompt) {
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log('[PWA] User response to install prompt:', outcome);
    
    // Clear the deferredPrompt
    deferredPrompt = null;
  } else {
    console.log('[PWA] Install prompt not available');
  }
};
