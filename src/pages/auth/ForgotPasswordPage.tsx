import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/forms/Input';
import { Alert } from '@/components/common/Alert';
import { Mail } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

export const ForgotPasswordPage: React.FC = () => {
    const { requestPasswordReset, error: authError, clearError, isLoading } = useAuth();
    const { t } = useLanguage();
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            clearError();
            await requestPasswordReset(email);
            setSubmitted(true);
        } catch (error) {
            // Erreur affichée via authError
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-lg shadow-lg p-8 space-y-6 text-center">
                        <div className="text-5xl">📧</div>
                        <h2 className="text-2xl font-bold text-gray-900">{t('auth.check_email')}</h2>
                        <p className="text-gray-600">
                            We've sent a password reset link to {email}
                        </p>
                        <p className="text-sm text-gray-500">
                            Check your spam folder if you don't see it
                        </p>
                        <Link
                            to="/auth/login"
                            className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Back to login
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">{t('common.app_name')}</h1>
                    <p className="text-gray-600">Reset your password</p>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900">{t('auth.forgot_password')}</h2>

                    {authError && (
                        <Alert
                            type="error"
                            title={t('common.error')}
                            message={authError.message}
                            onClose={clearError}
                        />
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label={t('auth.email')}
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            icon={Mail}
                            required
                        />

                        <p className="text-sm text-gray-600">
                            We'll send you a link to reset your password
                        </p>

                        <Button type="submit" fullWidth isLoading={isLoading} size="lg">
                            Send Reset Link
                        </Button>
                    </form>

                    <div className="text-center text-sm text-gray-600">
                        <Link to="/auth/login" className="text-blue-600 hover:text-blue-700">
                            Back to login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
