import axios, {
    AxiosInstance,
    AxiosError,
    AxiosResponse,
    InternalAxiosRequestConfig
} from 'axios';
import { useAuthStore } from '@/store/authStore';
import { AppError, ErrorCode, ApiResponse, ApiError as ApiErrorType } from '@/types/api';

// Types pour les interceptors
interface RequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

// Crée l'instance axios
const createApiClient = (): AxiosInstance => {
    const api = axios.create({
        baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
        timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000'),
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Client-Version': '1.0.0',
            'X-Environment': import.meta.env.VITE_ENV
        },
        withCredentials: true // Pour les cookies
    });

    // ==================== REQUEST INTERCEPTOR ====================
    api.interceptors.request.use(
        (config: RequestConfig) => {
            // Need to handle potential circular dependency or initialization issue if store uses api
            // In this setup, store uses services, services use api. API uses store for token.
            // We access store via getState() which is safe.
            const { token } = useAuthStore.getState();

            // Ajoute le token JWT
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }

            // Ajoute un ID de requête unique pour le logging
            config.headers['X-Request-ID'] = generateRequestId();

            // Log la requête en dev
            if (import.meta.env.VITE_ENV === 'development') {
                console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`, {
                    data: config.data,
                    params: config.params
                });
            }

            return config;
        },
        (error: AxiosError) => {
            console.error('[API Request Error]', error);
            return Promise.reject(handleAxiosError(error));
        }
    );

    // ==================== RESPONSE INTERCEPTOR ====================
    api.interceptors.response.use(
        (response: AxiosResponse<ApiResponse>) => {
            // Log la réponse en dev
            if (import.meta.env.VITE_ENV === 'development') {
                console.log(`[API] Response ${response.status}`, {
                    url: response.config.url,
                    data: response.data
                });
            }

            // Vérifie si la réponse contient une erreur
            if (!response.data.success && response.data.error) {
                throw new AppError(
                    response.data.error.code as ErrorCode,
                    response.data.error.message,
                    response.status,
                    response.data.error.details
                );
            }

            return response;
        },
        async (error: AxiosError) => {
            const config = error.config as RequestConfig;

            // Gère la retry de token expiré
            if (error.response?.status === 401 && !config._retry) {
                config._retry = true;

                try {
                    const { refreshToken } = useAuthStore.getState();

                    if (refreshToken) {
                        await useAuthStore.getState().refreshAccessToken();
                        return api(config);
                    } else {
                        // Pas de refresh token, logout
                        useAuthStore.getState().logout();
                        window.location.href = '/auth/login';
                    }
                } catch (refreshError) {
                    useAuthStore.getState().logout();
                    window.location.href = '/auth/login';
                    return Promise.reject(refreshError);
                }
            }

            return Promise.reject(handleAxiosError(error));
        }
    );

    return api;
};

// ==================== ERROR HANDLER ====================
const handleAxiosError = (error: AxiosError<ApiResponse>): AppError => {
    // Erreur de réponse du serveur
    if (error.response) {
        const status = error.response.status;
        const apiError = error.response.data?.error;

        // Erreur structurée du serveur
        if (apiError) {
            return new AppError(
                apiError.code as ErrorCode,
                apiError.message,
                status,
                apiError.details
            );
        }

        // Erreurs HTTP standard
        switch (status) {
            case 400:
                return new AppError(
                    ErrorCode.BAD_REQUEST,
                    'Invalid request data',
                    400,
                    error.response.data
                );
            case 401:
                return new AppError(
                    ErrorCode.UNAUTHORIZED,
                    'Authentication required',
                    401
                );
            case 403:
                return new AppError(
                    ErrorCode.FORBIDDEN,
                    'Access forbidden',
                    403
                );
            case 404:
                return new AppError(
                    ErrorCode.BAD_REQUEST,
                    'Resource not found',
                    404
                );
            case 422:
                return new AppError(
                    ErrorCode.VALIDATION_ERROR,
                    'Validation failed',
                    422,
                    error.response.data
                );
            case 429:
                return new AppError(
                    ErrorCode.NETWORK_ERROR,
                    'Too many requests. Please try again later.',
                    429
                );
            case 500:
            case 502:
            case 503:
            case 504:
                return new AppError(
                    ErrorCode.INTERNAL_SERVER_ERROR,
                    'Server error. Please try again later.',
                    status
                );
            default:
                return new AppError(
                    ErrorCode.INTERNAL_SERVER_ERROR,
                    error.response.data?.message || 'An unexpected error occurred',
                    status
                );
        }
    }

    // Erreur de requête (pas de réponse du serveur)
    if (error.request) {
        if (error.code === 'ECONNABORTED') {
            return new AppError(
                ErrorCode.TIMEOUT_ERROR,
                'Request timeout. Please check your connection and try again.',
                0
            );
        }

        if (error.code === 'ECONNREFUSED') {
            return new AppError(
                ErrorCode.CONNECTION_REFUSED,
                'Cannot connect to server. Please check your internet connection.',
                0
            );
        }

        if (!window.navigator.onLine) {
            return new AppError(
                ErrorCode.NETWORK_ERROR,
                'No internet connection. Please check your network.',
                0
            );
        }

        return new AppError(
            ErrorCode.NETWORK_ERROR,
            'Network error. Please try again.',
            0
        );
    }

    // Erreur lors de la configuration de la requête
    return new AppError(
        ErrorCode.NETWORK_ERROR,
        error.message || 'An unexpected error occurred',
        0
    );
};

// ==================== UTILS ====================
const generateRequestId = (): string => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Exporte l'instance
export const api = createApiClient();

export default api;
