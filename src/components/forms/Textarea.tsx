import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
    label,
    error,
    helperText,
    ...props
}) => {
    return (
        <div className="space-y-2">
            {label && (
                <label className="block text-sm font-medium text-gray-900">
                    {label}
                    {props.required && <span className="text-red-600">*</span>}
                </label>
            )}

            <textarea
                {...props}
                className={`
          w-full px-4 py-2 border rounded-lg
          focus:outline-none focus:ring-2 focus:ring-blue-500
          disabled:bg-gray-100 disabled:cursor-not-allowed
          transition-colors
          resize-none
          ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}
        `}
            />

            {error && <p className="text-sm text-red-600">{error}</p>}
            {helperText && !error && <p className="text-sm text-gray-500">{helperText}</p>}
        </div>
    );
};
