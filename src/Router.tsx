import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { DashboardPage } from '@/pages/DashboardPage';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage';
import { StudentsPage } from '@/pages/students/StudentsPage';
import { ClassesPage } from '@/pages/classes/ClassesPage';
import { AttendancePage } from '@/pages/attendance/AttendancePage';
import { ProtectedRoute, PublicRoute } from '@/middleware/authMiddleware';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';

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
                {/* Public Routes */}
                <Route element={<PublicRoute />}>
                    <Route path="/auth/login" element={<LoginPage />} />
                    <Route path="/auth/register" element={<RegisterPage />} />
                    <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
                </Route>

                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<MainLayout />}>
                        <Route index element={<DashboardPage />} />
                        <Route path="students" element={<StudentsPage />} />
                        <Route path="classes" element={<ClassesPage />} />
                        <Route path="attendance" element={<AttendancePage />} />
                    </Route>
                </Route>

                {/* Root Redirect */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </BrowserRouter>
    );
};
