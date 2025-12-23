import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types/auth';
import { authService } from '@/services/authService';
import { AppError, ErrorCode } from '@/types/api';

export interface AuthStore {
    // State
    user: User | null;
    token: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: AppError | null;
    isInitialized: boolean;

    // Auth actions
    login: (email: string, password: string) => Promise<void>;
    register: (firstName: string, lastName: string, email: string, password: string, role: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshAccessToken: () => Promise<void>;

    // User actions
    setUser: (user: User) => void;
    updateUserProfile: (updates: Partial<User>) => Promise<void>;
    getCurrentUser: () => Promise<void>;

    // Password actions
    requestPasswordReset: (email: string) => Promise<void>;
    resetPassword: (token: string, password: string) => Promise<void>;
    verifyEmail: (token: string) => Promise<void>;

    // Utility
    clearError: () => void;
    initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            // Initial state
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
            isInitialized: false,

            // ==================== AUTH ACTIONS ====================
            login: async (email: string, password: string) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await authService.login({ email, password });
                    set({
                        user: response.user,
                        token: response.token,
                        refreshToken: response.refreshToken,
                        isAuthenticated: true,
                        isLoading: false
                    });
                } catch (error: any) {
                    const appError = error instanceof AppError ? error : new AppError(
                        ErrorCode.INTERNAL_SERVER_ERROR,
                        error.message || 'Login failed',
                        500
                    );
                    set({
                        error: appError,
                        isLoading: false
                    });
                    throw appError;
                }
            },

            register: async (firstName: string, lastName: string, email: string, password: string, role: string) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await authService.register({
                        firstName,
                        lastName,
                        email,
                        password,
                        role
                    });
                    set({
                        user: response.user,
                        token: response.token,
                        refreshToken: response.refreshToken,
                        isAuthenticated: true,
                        isLoading: false
                    });
                } catch (error: any) {
                    const appError = error instanceof AppError ? error : new AppError(
                        ErrorCode.INTERNAL_SERVER_ERROR,
                        error.message || 'Registration failed',
                        500
                    );
                    set({
                        error: appError,
                        isLoading: false
                    });
                    throw appError;
                }
            },

            logout: async () => {
                set({ isLoading: true, error: null });
                try {
                    await authService.logout();
                } catch (error) {
                    console.error('Logout error:', error);
                } finally {
                    set({
                        user: null,
                        token: null,
                        refreshToken: null,
                        isAuthenticated: false,
                        isLoading: false,
                        isInitialized: true
                    });
                }
            },

            refreshAccessToken: async () => {
                try {
                    const newToken = await authService.refreshAccessToken();
                    set({ token: newToken });
                } catch (error: any) {
                    const appError = error instanceof AppError ? error : new AppError(
                        ErrorCode.TOKEN_EXPIRED,
                        'Token refresh failed',
                        401
                    );
                    set({ error: appError });
                    // Logout si le refresh échoue
                    get().logout();
                    throw appError;
                }
            },

            // ==================== USER ACTIONS ====================
            setUser: (user: User) => set({ user }),

            updateUserProfile: async (updates: Partial<User>) => {
                set({ isLoading: true, error: null });
                try {
                    // TODO: Implémenter l'endpoint UPDATE profile
                    set((state) => ({
                        user: state.user ? { ...state.user, ...updates } : null,
                        isLoading: false
                    }));
                } catch (error: any) {
                    set({
                        error: error instanceof AppError ? error : new AppError(
                            ErrorCode.INTERNAL_SERVER_ERROR,
                            'Failed to update profile',
                            500
                        ),
                        isLoading: false
                    });
                    throw error;
                }
            },

            getCurrentUser: async () => {
                set({ isLoading: true, error: null });
                try {
                    const user = await authService.getCurrentUser();
                    set({ user, isLoading: false });
                } catch (error: any) {
                    set({
                        error: error instanceof AppError ? error : new AppError(
                            ErrorCode.UNAUTHORIZED,
                            'Failed to fetch current user',
                            401
                        ),
                        isLoading: false
                    });
                    throw error;
                }
            },

            // ==================== PASSWORD ACTIONS ====================
            requestPasswordReset: async (email: string) => {
                set({ isLoading: true, error: null });
                try {
                    await authService.requestPasswordReset(email);
                    set({ isLoading: false });
                } catch (error: any) {
                    set({
                        error: error instanceof AppError ? error : new AppError(
                            ErrorCode.INTERNAL_SERVER_ERROR,
                            'Failed to request password reset',
                            500
                        ),
                        isLoading: false
                    });
                    throw error;
                }
            },

            resetPassword: async (token: string, password: string) => {
                set({ isLoading: true, error: null });
                try {
                    await authService.resetPassword(token, password);
                    set({ isLoading: false });
                } catch (error: any) {
                    set({
                        error: error instanceof AppError ? error : new AppError(
                            ErrorCode.INTERNAL_SERVER_ERROR,
                            'Failed to reset password',
                            500
                        ),
                        isLoading: false
                    });
                    throw error;
                }
            },

            verifyEmail: async (token: string) => {
                set({ isLoading: true, error: null });
                try {
                    await authService.verifyEmail(token);
                    set((state) => ({
                        user: state.user ? { ...state.user, isVerified: true } : null,
                        isLoading: false
                    }));
                } catch (error: any) {
                    set({
                        error: error instanceof AppError ? error : new AppError(
                            ErrorCode.INTERNAL_SERVER_ERROR,
                            'Failed to verify email',
                            500
                        ),
                        isLoading: false
                    });
                    throw error;
                }
            },

            // ==================== UTILITY ====================
            clearError: () => set({ error: null }),

            initializeAuth: async () => {
                set({ isLoading: true });
                try {
                    const user = await authService.getCurrentUser();
                    set({
                        user,
                        isAuthenticated: true,
                        isLoading: false,
                        isInitialized: true
                    });
                } catch (error) {
                    set({
                        user: null,
                        isAuthenticated: false,
                        token: null,
                        refreshToken: null,
                        isLoading: false,
                        isInitialized: true
                    });
                }
            }
        }),
        {
            name: 'auth-store',
            partialize: (state) => ({
                token: state.token,
                refreshToken: state.refreshToken,
                user: state.user,
                isAuthenticated: state.isAuthenticated
            })
        }
    )
);
