import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Index from '@/pages/Index';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage';
import { StudentsPage } from '@/pages/students/StudentsPage';
import { ClassesPage } from '@/pages/classes/ClassesPage';
import { AttendancePage } from '@/pages/attendance/AttendancePage';
import { DashboardPage } from '@/pages/DashboardPage';
import { PublicRoute, ProtectedRoute } from '@/middleware/authMiddleware';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
    return (
        <div className="flex bg-gray-50 min-h-screen">
            <Sidebar />
            <div className="flex-1 ml-64 flex flex-col">
                <Navbar />
                <main className="flex-1 mt-16 p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export const Router: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Home Page with Landing */}
                <Route path="/" element={<Index />} />

                {/* Public Auth Routes */}
                <Route element={<PublicRoute />}>
                    <Route path="/auth/login" element={<LoginPage />} />
                    <Route path="/auth/register" element={<RegisterPage />} />
                    <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
                </Route>

                {/* Protected Dashboard with Modules */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<MainLayout />}>
                        <Route index element={<DashboardPage />} />
                        <Route path="students" element={<StudentsPage />} />
                        <Route path="classes" element={<ClassesPage />} />
                        <Route path="attendance" element={<AttendancePage />} />
                    </Route>
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
};
