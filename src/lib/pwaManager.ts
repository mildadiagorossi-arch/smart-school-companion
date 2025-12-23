export const pwaManager = {
    register: async () => {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/service-worker.js');
                console.log('✅ Service Worker registered:', registration);
                return registration;
            } catch (error) {
                console.error('❌ Service Worker registration failed:', error);
            }
        }
    },

    unregister: async () => {
        if ('serviceWorker' in navigator) {
            const registrations = await navigator.serviceWorker.getRegistrations();
            for (const registration of registrations) {
                await registration.unregister();
            }
        }
    },

    isOnline: () => navigator.onLine,

    onOnline: (callback: () => void) => {
        window.addEventListener('online', callback);
        return () => window.removeEventListener('online', callback);
    },

    onOffline: (callback: () => void) => {
        window.addEventListener('offline', callback);
        return () => window.removeEventListener('offline', callback);
    }
};
