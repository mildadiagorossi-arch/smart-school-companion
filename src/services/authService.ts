import { api } from '@/lib/api';
import { User, AuthResponse, LoginRequest, RegisterRequest } from '@/types/auth';
import { AppError, ErrorCode, ApiResponse } from '@/types/api';

export const authService = {
    /**
     * Connexion utilisateur
     */
    async login(credentials: LoginRequest): Promise<AuthResponse> {
        try {
            // DEMO MODE: Try API, if fails/not running, return mock data
            // In a real app, this fallback wouldn't exist like this.

            // Simulating API latency if we were to mock only
            // await new Promise(resolve => setTimeout(resolve, 800));

            try {
                const response = await api.post<ApiResponse<AuthResponse>>(
                    '/auth/login',
                    credentials
                );

                if (response.data.data) {
                    const { user, token, refreshToken } = response.data.data;
                    localStorage.setItem('auth-token', token);
                    localStorage.setItem('refresh-token', refreshToken);
                    localStorage.setItem('user', JSON.stringify(user));
                    return response.data.data;
                }
            } catch (apiError) {
                console.warn("API Login failed, using DEMO fallback", apiError);
            }

            // MOCK FALLBACK
            const mockUser: User = {
                id: '1',
                email: credentials.email,
                firstName: 'Demo',
                lastName: 'User',
                role: 'admin',
                isVerified: true
            };
            const mockResponse: AuthResponse = {
                user: mockUser,
                token: 'mock-jwt-token',
                refreshToken: 'mock-refresh-token'
            };

            localStorage.setItem('auth-token', mockResponse.token);
            localStorage.setItem('refresh-token', mockResponse.refreshToken);
            localStorage.setItem('user', JSON.stringify(mockUser));

            return mockResponse;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    /**
     * Enregistrement d'un nouvel utilisateur
     */
    async register(data: RegisterRequest): Promise<AuthResponse> {
        try {
            const response = await api.post<ApiResponse<AuthResponse>>(
                '/auth/register',
                data
            );

            if (!response.data.data) {
                throw new AppError(
                    ErrorCode.INTERNAL_SERVER_ERROR,
                    'No auth data returned from server',
                    500
                );
            }

            const { user, token, refreshToken } = response.data.data;

            localStorage.setItem('auth-token', token);
            localStorage.setItem('refresh-token', refreshToken);
            localStorage.setItem('user', JSON.stringify(user));

            return response.data.data;
        } catch (error) {
            console.error('Register error:', error);
            throw error;
        }
    },

    /**
     * Déconnexion
     */
    async logout(): Promise<void> {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Nettoie le localStorage même si la requête échoue
            localStorage.removeItem('auth-token');
            localStorage.removeItem('refresh-token');
            localStorage.removeItem('user');
        }
    },

    /**
     * Rafraîchit le token d'accès
     */
    async refreshAccessToken(): Promise<string> {
        try {
            const refreshToken = localStorage.getItem('refresh-token');

            if (!refreshToken) {
                throw new AppError(
                    ErrorCode.UNAUTHORIZED,
                    'No refresh token available',
                    401
                );
            }

            const response = await api.post<ApiResponse<{ token: string }>>(
                '/auth/refresh',
                { refreshToken }
            );

            if (!response.data.data?.token) {
                throw new AppError(
                    ErrorCode.INTERNAL_SERVER_ERROR,
                    'No token returned from server',
                    500
                );
            }

            const newToken = response.data.data.token;
            localStorage.setItem('auth-token', newToken);

            return newToken;
        } catch (error) {
            console.error('Token refresh error:', error);
            throw error;
        }
    },

    /**
     * Récupère l'utilisateur courant
     */
    async getCurrentUser(): Promise<User> {
        try {
            try {
                const response = await api.get<ApiResponse<User>>('/auth/me');
                if (response.data.data) return response.data.data;
            } catch (e) {
                // Fallback to local
            }

            const stored = localStorage.getItem('user');
            if (stored) return JSON.parse(stored);

            throw new AppError(ErrorCode.UNAUTHORIZED, 'No user found', 401);
        } catch (error) {
            console.error('Get current user error:', error);
            throw error;
        }
    },

    /**
     * Demande de réinitialisation de mot de passe
     */
    async requestPasswordReset(email: string): Promise<void> {
        try {
            await api.post('/auth/request-password-reset', { email });
        } catch (error) {
            console.error('Password reset request error:', error);
            throw error;
        }
    },

    /**
     * Réinitialise le mot de passe
     */
    async resetPassword(token: string, newPassword: string): Promise<void> {
        try {
            await api.post('/auth/reset-password', { token, newPassword });
        } catch (error) {
            console.error('Password reset error:', error);
            throw error;
        }
    },

    /**
     * Valide un email
     */
    async verifyEmail(token: string): Promise<void> {
        try {
            await api.post('/auth/verify-email', { token });
        } catch (error) {
            console.error('Email verification error:', error);
            throw error;
        }
    },

    /**
     * Vérifie si un email est disponible
     */
    async checkEmailAvailable(email: string): Promise<boolean> {
        try {
            const response = await api.get<ApiResponse<{ available: boolean }>>(
                '/auth/check-email',
                { params: { email } }
            );
            return response.data.data?.available || false;
        } catch (error) {
            console.error('Email check error:', error);
            return false;
        }
    }
};
