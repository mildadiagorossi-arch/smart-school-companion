import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface RoleProtectedRouteProps {
    allowedRoles: string[];
}

export const RoleProtectedRoute = ({ allowedRoles }: RoleProtectedRouteProps) => {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated || !user) {
        return <Navigate to="/auth/login" replace />;
    }

    // Assuming role check logic, simpler version for now
    if (!allowedRoles.includes(user.role)) {
        // In a real app we might redirect to an 'unauthorized' page
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};
