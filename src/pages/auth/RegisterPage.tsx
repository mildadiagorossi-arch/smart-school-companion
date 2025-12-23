import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useForm } from '@/hooks/useForm';
import { registerSchema } from '@/lib/validators';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/forms/Input';
import { Select } from '@/components/forms/Select';
import { Alert } from '@/components/common/Alert';
import { useLanguage } from '@/hooks/useLanguage';

export const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const { register, error: authError, clearError } = useAuth();
    const { t } = useLanguage();
    const [localError, setLocalError] = useState<string | null>(null);

    const form = useForm(
        {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
            role: ''
        },
        async (values) => {
            try {
                setLocalError(null);
                await register(
                    values.firstName,
                    values.lastName,
                    values.email,
                    values.password,
                    values.role
                );
                navigate('/dashboard');
            } catch (error: any) {
                setLocalError(error.message);
            }
        },
        registerSchema
    );

    React.useEffect(() => {
        clearError();
    }, [clearError]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">{t('common.app_name')}</h1>
                    <p className="text-gray-600">{t('auth.register')}</p>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900">{t('auth.register')}</h2>

                    {(authError || localError) && (
                        <Alert
                            type="error"
                            title={t('common.error')}
                            message={authError?.message || localError || ''}
                            onClose={() => {
                                clearError();
                                setLocalError(null);
                            }}
                        />
                    )}

                    <form onSubmit={form.handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label={t('auth.first_name')}
                                name="firstName"
                                value={form.values.firstName}
                                onChange={form.handleChange}
                                onBlur={form.handleBlur}
                                error={form.touched.firstName && form.errors.firstName}
                                required
                            />

                            <Input
                                label={t('auth.last_name')}
                                name="lastName"
                                value={form.values.lastName}
                                onChange={form.handleChange}
                                onBlur={form.handleBlur}
                                error={form.touched.lastName && form.errors.lastName}
                                required
                            />
                        </div>

                        <Input
                            label={t('auth.email')}
                            type="email"
                            name="email"
                            value={form.values.email}
                            onChange={form.handleChange}
                            onBlur={form.handleBlur}
                            error={form.touched.email && form.errors.email}
                            placeholder="you@example.com"
                            required
                        />

                        <Select
                            label={t('auth.role')}
                            name="role"
                            value={form.values.role}
                            onChange={form.handleChange}
                            onBlur={form.handleBlur}
                            error={form.touched.role && form.errors.role}
                            options={[
                                { label: 'Student', value: 'student' },
                                { label: 'Teacher', value: 'teacher' },
                                { label: 'Parent', value: 'parent' },
                                { label: 'Admin', value: 'admin' }
                            ]}
                            required
                        />

                        <Input
                            label={t('auth.password')}
                            type="password"
                            name="password"
                            value={form.values.password}
                            onChange={form.handleChange}
                            onBlur={form.handleBlur}
                            error={form.touched.password && form.errors.password}
                            helperText="At least 8 characters"
                            required
                        />

                        <Input
                            label={t('auth.confirm_password')}
                            type="password"
                            name="confirmPassword"
                            value={form.values.confirmPassword}
                            onChange={form.handleChange}
                            onBlur={form.handleBlur}
                            error={form.touched.confirmPassword && form.errors.confirmPassword}
                            required
                        />

                        <Button type="submit" fullWidth isLoading={form.isSubmitting} size="lg">
                            {t('auth.register')}
                        </Button>
                    </form>

                    <div className="text-center text-sm text-gray-600">
                        {t('auth.already_have_account')}{' '}
                        <Link to="/auth/login" className="text-blue-600 hover:text-blue-700 font-medium">
                            {t('auth.login')}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
