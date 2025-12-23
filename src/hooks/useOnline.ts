import { useEffect, useState } from 'react';
import { pwaManager } from '@/lib/pwaManager';

export const useOnline = () => {
    const [isOnline, setIsOnline] = useState(pwaManager.isOnline());

    useEffect(() => {
        const unsubscribeOnline = pwaManager.onOnline(() => setIsOnline(true));
        const unsubscribeOffline = pwaManager.onOffline(() => setIsOnline(false));

        return () => {
            unsubscribeOnline();
            unsubscribeOffline();
        };
    }, []);

    return isOnline;
};
