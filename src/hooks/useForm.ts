import { useState, useCallback } from 'react';
import { ZodSchema, ZodError } from 'zod';

interface UseFormProps<T> {
    values: T;
    errors: Record<string, string>;
    touched: Record<string, boolean>;
    isSubmitting: boolean;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    handleBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
    setFieldValue: (name: keyof T, value: any) => void;
    setFieldError: (name: keyof T, error: string) => void;
    resetForm: () => void;
}

export function useForm<T extends Record<string, any>>(
    initialValues: T,
    onSubmit: (values: T) => Promise<void> | void,
    validationSchema?: ZodSchema<T>
): UseFormProps<T> {
    const [values, setValues] = useState<T>(initialValues);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validate = useCallback((valuesToValidate: T): boolean => {
        if (!validationSchema) return true;

        try {
            validationSchema.parse(valuesToValidate);
            setErrors({});
            return true;
        } catch (error) {
            if (error instanceof ZodError) {
                const newErrors: Record<string, string> = {};
                error.errors.forEach((err) => {
                    if (err.path[0]) {
                        newErrors[err.path[0].toString()] = err.message;
                    }
                });
                setErrors(newErrors);
            }
            return false;
        }
    }, [validationSchema]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        // Handle checkbox vs text/select
        let finalValue: any = value;
        if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
            finalValue = e.target.checked;
        }

        setValues((prev) => ({ ...prev, [name]: finalValue }));

        // Validate field on change (optional, can be removed for performance)
        if (validationSchema) {
            try {
                // Partial validation for single field is tricky with Zod object schema
                // For simplicity, we just clear the error for this field
                setErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors[name];
                    return newErrors;
                });
            } catch (e) { }
        }
    }, [validationSchema]);

    const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name } = e.target;
        setTouched((prev) => ({ ...prev, [name]: true }));

        // Validate on blur?
        if (validationSchema) {
            try {
                // validating the whole form on blur might be aggressive, but ensures consistency
                // Ideally we'd validate only the field.
                // validationSchema.parse(values); 
                // Skipping detailed field validation on blur for now to keep it simple
            } catch (error) {
                // ...
            }
        }
    }, [values, validationSchema]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const isValid = validate(values);

        if (isValid) {
            try {
                await onSubmit(values);
            } catch (error: any) {
                // Allow submission handler to set general form error manually if needed, 
                // but typically handled by component state
                setErrors(prev => ({ ...prev, submit: error.message || 'Submission failed' }));
            }
        } else {
            // Mark all fields as touched to show errors
            const allTouched: Record<string, boolean> = {};
            Object.keys(values).forEach(key => allTouched[key] = true);
            setTouched(allTouched);
        }

        setIsSubmitting(false);
    };

    const setFieldValue = useCallback((name: keyof T, value: any) => {
        setValues((prev) => ({ ...prev, [name]: value }));
    }, []);

    const setFieldError = useCallback((name: keyof T, error: string) => {
        setErrors((prev) => ({ ...prev, [name]: error }));
    }, []);

    const resetForm = useCallback(() => {
        setValues(initialValues);
        setErrors({});
        setTouched({});
    }, [initialValues]);

    return {
        values,
        errors,
        touched,
        isSubmitting,
        handleChange,
        handleBlur,
        handleSubmit,
        setFieldValue,
        setFieldError,
        resetForm
    };
}
