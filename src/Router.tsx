import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage';
import { PublicRoute } from '@/middleware/authMiddleware';

export const Router: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Home Page */}
                <Route path="/" element={<Index />} />

                {/* Public Auth Routes */}
                <Route element={<PublicRoute />}>
                    <Route path="/auth/login" element={<LoginPage />} />
                    <Route path="/auth/register" element={<RegisterPage />} />
                    <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
                </Route>

                {/* Dashboard with all modules (uses OutlookLayout internally) */}
                <Route path="/dashboard/*" element={<Dashboard />} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
};
