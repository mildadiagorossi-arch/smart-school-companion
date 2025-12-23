import React from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

interface AlertProps {
    type: 'error' | 'success' | 'info' | 'warning';
    title?: string;
    message: string;
    onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({
    type,
    title,
    message,
    onClose
}) => {
    const colors = {
        error: 'bg-red-50 border-red-200 text-red-800',
        success: 'bg-green-50 border-green-200 text-green-800',
        info: 'bg-blue-50 border-blue-200 text-blue-800',
        warning: 'bg-yellow-50 border-yellow-200 text-yellow-800'
    };

    const icons = {
        error: AlertCircle,
        success: CheckCircle,
        info: Info,
        warning: AlertCircle
    };

    const Icon = icons[type];

    return (
        <div className={`border rounded-lg p-4 ${colors[type]} flex gap-4`}>
            <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
                {title && <h3 className="font-semibold">{title}</h3>}
                <p>{message}</p>
            </div>
            {onClose && (
                <button onClick={onClose} className="text-current opacity-50 hover:opacity-100">
                    <X className="h-5 w-5" />
                </button>
            )}
        </div>
    );
};
