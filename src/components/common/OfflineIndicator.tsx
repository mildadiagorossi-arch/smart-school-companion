import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnline } from '@/hooks/useOnline';
import { useLanguage } from '@/hooks/useLanguage';

export const OfflineIndicator: React.FC = () => {
    const isOnline = useOnline();
    const { t } = useLanguage();

    if (isOnline) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 bg-red-500 text-white rounded-lg p-4 flex items-center gap-3 shadow-lg z-50">
            <WifiOff className="h-5 w-5" />
            <span>You are offline - some features may be limited</span>
        </div>
    );
};
