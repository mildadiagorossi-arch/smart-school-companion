import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: Array<{ label: string; value: string }>;
}

export const Select: React.FC<SelectProps> = ({
    label,
    error,
    options,
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

            <select
                {...props}
                className={`
          w-full px-4 py-2 border rounded-lg
          focus:outline-none focus:ring-2 focus:ring-blue-500
          transition-colors
          ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}
        `}
            >
                <option value="">Select an option</option>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>

            {error && (
                <p className="text-sm text-red-600">{error}</p>
            )}
        </div>
    );
};
