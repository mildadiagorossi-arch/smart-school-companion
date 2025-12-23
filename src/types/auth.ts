export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    firstName: string;
    lastName: string;
    isVerified?: boolean;
}

export interface AuthResponse {
    user: User;
    token: string;
    refreshToken: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
}
