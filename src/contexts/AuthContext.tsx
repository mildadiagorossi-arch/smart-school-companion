import { ReactNode, createContext, useContext } from 'react';
import { useAuth as useZustandAuth } from '@/hooks/useAuth';
import { User } from '@/types/auth';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
}

// Export the context itself if consumers need it specifically (though hook is better)
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const auth = useZustandAuth();

    return (
        <AuthContext.Provider value={{
            user: auth.user,
            isLoading: auth.isLoading,
            isAuthenticated: auth.isAuthenticated
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
