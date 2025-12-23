import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export const ProtectedRoute = () => {
    const { isAuthenticated, isInitialized } = useAuth();
    const location = useLocation();

    if (!isInitialized) {
        return (
            <div className= "flex items-center justify-center h-screen" >
            <div className="text-center" >
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600" > Loading...</p>
                        </div>
                        </div>
    );
  }

if (!isAuthenticated) {
    return <Navigate to="/auth/login" state = {{ from: location }
} replace />;
  }

return <Outlet />;
};

export const PublicRoute = () => {
    const { isAuthenticated, isInitialized } = useAuth();

    if (!isInitialized) {
        return (
            <div className= "flex items-center justify-center h-screen" >
            <div className="text-center" >
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600" > Loading...</p>
                        </div>
                        </div>
    );
  }

if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
}

return <Outlet />;
};
