/**
 * SchoolGenius - Contexte d'authentification et gestion des rôles
 * RBAC: Role-Based Access Control
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { db, AppConfig, getCurrentTimestamp } from '../lib/db';

// ============================================
// TYPES
// ============================================

export type UserRole = 'direction' | 'admin' | 'teacher' | 'parent';

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    avatar?: string;
    classIds?: string[]; // Pour enseignants
    childrenIds?: string[]; // Pour parents
    permissions: Permission[];
}

export type Permission =
    | 'view_all_students'
    | 'view_own_students'
    | 'view_own_children'
    | 'edit_students'
    | 'view_all_teachers'
    | 'edit_teachers'
    | 'view_all_classes'
    | 'view_own_classes'
    | 'edit_classes'
    | 'mark_attendance'
    | 'view_attendance'
    | 'add_grades'
    | 'view_all_grades'
    | 'view_own_grades'
    | 'send_messages'
    | 'view_ai_alerts'
    | 'access_admin';

// Permissions par rôle
const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
    direction: [
        'view_all_students', 'edit_students',
        'view_all_teachers', 'edit_teachers',
        'view_all_classes', 'edit_classes',
        'mark_attendance', 'view_attendance',
        'add_grades', 'view_all_grades',
        'send_messages',
        'view_ai_alerts',
        'access_admin',
    ],
    admin: [
        'view_all_students', 'edit_students',
        'view_all_teachers',
        'view_all_classes', 'edit_classes',
        'view_attendance',
        'view_all_grades',
        'send_messages',
        'access_admin',
    ],
    teacher: [
        'view_own_students',
        'view_all_teachers',
        'view_own_classes',
        'mark_attendance', 'view_attendance',
        'add_grades', 'view_all_grades',
        'send_messages',
        'view_ai_alerts',
    ],
    parent: [
        'view_own_children',
        'view_own_grades',
        'view_attendance',
    ],
};

// ============================================
// CONTEXT
// ============================================

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    switchRole: (role: UserRole) => void; // Pour demo/test
    hasPermission: (permission: Permission) => boolean;
    hasAnyPermission: (permissions: Permission[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================
// MOCK USERS (pour demo - à remplacer par API)
// ============================================

const MOCK_USERS: Record<string, User> = {
    'direction@ecole.ma': {
        id: 'usr_direction_001',
        email: 'direction@ecole.ma',
        firstName: 'Mohamed',
        lastName: 'Directeur',
        role: 'direction',
        permissions: ROLE_PERMISSIONS.direction,
    },
    'admin@ecole.ma': {
        id: 'usr_admin_001',
        email: 'admin@ecole.ma',
        firstName: 'Fatima',
        lastName: 'Benali',
        role: 'admin',
        permissions: ROLE_PERMISSIONS.admin,
    },
    'prof@ecole.ma': {
        id: 'usr_teacher_001',
        email: 'prof@ecole.ma',
        firstName: 'Ahmed',
        lastName: 'Professeur',
        role: 'teacher',
        classIds: ['class_4b', 'class_5a'],
        permissions: ROLE_PERMISSIONS.teacher,
    },
    'parent@ecole.ma': {
        id: 'usr_parent_001',
        email: 'parent@ecole.ma',
        firstName: 'Khadija',
        lastName: 'Mère',
        role: 'parent',
        childrenIds: ['student_001', 'student_002'],
        permissions: ROLE_PERMISSIONS.parent,
    },
};

// ============================================
// PROVIDER
// ============================================

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Charger l'utilisateur depuis le stockage local au démarrage
    useEffect(() => {
        loadStoredUser();
    }, []);

    const loadStoredUser = async () => {
        try {
            const stored = await db.appConfig.where('key').equals('currentUser').first();
            if (stored) {
                const userData = JSON.parse(stored.value);
                setUser(userData);
            } else {
                // Auto-login en mode direction pour demo
                const demoUser = MOCK_USERS['direction@ecole.ma'];
                setUser(demoUser);
                await saveUserToStorage(demoUser);
            }
        } catch (error) {
            console.error('Failed to load stored user:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const saveUserToStorage = async (userData: User) => {
        const existing = await db.appConfig.where('key').equals('currentUser').first();
        const config: AppConfig = {
            key: 'currentUser',
            value: JSON.stringify(userData),
            updatedAt: getCurrentTimestamp(),
        };

        if (existing) {
            await db.appConfig.update(existing.id!, config);
        } else {
            await db.appConfig.add(config);
        }
    };

    const login = async (email: string, _password: string): Promise<boolean> => {
        // Mock login - à remplacer par appel API
        const foundUser = MOCK_USERS[email.toLowerCase()];

        if (foundUser) {
            setUser(foundUser);
            await saveUserToStorage(foundUser);
            return true;
        }

        return false;
    };

    const logout = async () => {
        setUser(null);
        await db.appConfig.where('key').equals('currentUser').delete();
    };

    // Pour basculer entre rôles (demo/test)
    const switchRole = (role: UserRole) => {
        const roleEmails: Record<UserRole, string> = {
            direction: 'direction@ecole.ma',
            admin: 'admin@ecole.ma',
            teacher: 'prof@ecole.ma',
            parent: 'parent@ecole.ma',
        };

        const newUser = MOCK_USERS[roleEmails[role]];
        if (newUser) {
            setUser(newUser);
            saveUserToStorage(newUser);
        }
    };

    const hasPermission = (permission: Permission): boolean => {
        return user?.permissions.includes(permission) ?? false;
    };

    const hasAnyPermission = (permissions: Permission[]): boolean => {
        return permissions.some((p) => hasPermission(p));
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!user,
                login,
                logout,
                switchRole,
                hasPermission,
                hasAnyPermission,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// ============================================
// HOOK
// ============================================

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

// ============================================
// GUARD COMPONENT
// ============================================

interface PermissionGuardProps {
    permission?: Permission;
    permissions?: Permission[];
    requireAll?: boolean;
    fallback?: ReactNode;
    children: ReactNode;
}

export function PermissionGuard({
    permission,
    permissions,
    requireAll = false,
    fallback = null,
    children,
}: PermissionGuardProps) {
    const { hasPermission, hasAnyPermission, user } = useAuth();

    if (!user) return <>{fallback}</>;

    if (permission && !hasPermission(permission)) {
        return <>{fallback}</>;
    }

    if (permissions) {
        if (requireAll) {
            const hasAll = permissions.every((p) => hasPermission(p));
            if (!hasAll) return <>{fallback}</>;
        } else {
            if (!hasAnyPermission(permissions)) return <>{fallback}</>;
        }
    }

    return <>{children}</>;
}

// ============================================
// ROLE GUARD
// ============================================

interface RoleGuardProps {
    roles: UserRole[];
    fallback?: ReactNode;
    children: ReactNode;
}

export function RoleGuard({ roles, fallback = null, children }: RoleGuardProps) {
    const { user } = useAuth();

    if (!user || !roles.includes(user.role)) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}
