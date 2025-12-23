import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useForm } from '@/hooks/useForm';
import { loginSchema } from '@/lib/validators';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/forms/Input';
import { Alert } from '@/components/common/Alert';
import { Mail, Lock } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

export const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { login, error: authError, clearError } = useAuth();
    const { t } = useLanguage();
    const [localError, setLocalError] = useState<string | null>(null);

    const form = useForm(
        { email: '', password: '' },
        async (values) => {
            try {
                setLocalError(null);
                await login(values.email, values.password);
                navigate('/dashboard');
            } catch (error: any) {
                setLocalError(error.message);
            }
        },
        loginSchema
    );

    React.useEffect(() => {
        clearError();
    }, [clearError]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo/Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        {t('common.app_name')}
                    </h1>
                    <p className="text-gray-600">School Management Platform</p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900">{t('common.welcome')}</h2>

                    {/* Errors */}
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

                    {/* Form */}
                    <form onSubmit={form.handleSubmit} className="space-y-4">
                        <Input
                            label={t('auth.email')}
                            type="email"
                            name="email"
                            value={form.values.email}
                            onChange={form.handleChange}
                            onBlur={form.handleBlur}
                            error={form.touched.email && form.errors.email}
                            placeholder="you@example.com"
                            icon={Mail}
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
                            placeholder="••••••••"
                            icon={Lock}
                            required
                        />

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    className="rounded border-gray-300"
                                />
                                <span className="text-gray-700">{t('auth.remember_me')}</span>
                            </label>
                            <Link
                                to="/auth/forgot-password"
                                className="text-blue-600 hover:text-blue-700"
                            >
                                {t('auth.forgot_password')}
                            </Link>
                        </div>

                        <Button
                            type="submit"
                            fullWidth
                            isLoading={form.isSubmitting}
                            size="lg"
                        >
                            {t('auth.login')}
                        </Button>
                    </form>

                    {/* Footer */}
                    <div className="text-center text-sm text-gray-600">
                        {t('auth.dont_have_account')}{' '}
                        <Link to="/auth/register" className="text-blue-600 hover:text-blue-700 font-medium">
                            {t('common.create')}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
