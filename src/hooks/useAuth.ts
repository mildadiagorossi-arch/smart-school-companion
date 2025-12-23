import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

export const useAuth = () => {
    const {
        user,
        token,
        isAuthenticated,
        isLoading,
        error,
        isInitialized,
        login,
        register,
        logout,
        getCurrentUser,
        clearError,
        initializeAuth,
        requestPasswordReset,
        resetPassword,
        verifyEmail,
        updateUserProfile
    } = useAuthStore();

    // Initialise l'auth au montage du composant
    useEffect(() => {
        if (!isInitialized) {
            initializeAuth();
        }
    }, [isInitialized, initializeAuth]);

    return {
        // State
        user,
        token,
        isAuthenticated,
        isLoading,
        error,
        isInitialized,

        // Actions
        login,
        register,
        logout,
        clearError,
        getCurrentUser,
        requestPasswordReset,
        resetPassword,
        verifyEmail,
        updateUserProfile
    };
};
