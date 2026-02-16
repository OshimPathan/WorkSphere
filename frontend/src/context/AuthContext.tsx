import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import api from '../services/api';

interface User {
    id: string;
    email: string;
    name: string;
    role: 'ADMIN' | 'HR' | 'TEAM_LEADER' | 'EMPLOYEE';
    organizationId?: string; // Added for multi-tenancy
    organizationName?: string;
    department?: { id: string; name: string };
    team?: { id: string; name: string };
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (token: string, refreshToken: string, user: User) => void;
    register: (email: string, password: string, name: string, organizationName: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (error) {
                console.error('Failed to parse user from localStorage', error);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        }
    }, []);

    const login = (newToken: string, refreshToken: string, newUser: User) => {
        localStorage.setItem('token', newToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(newUser));
        setToken(newToken);
        setUser(newUser);
    };

    const register = async (email: string, password: string, name: string, organizationName: string) => {
        const response = await api.post('/auth/register', {
            email,
            password,
            name,
            organizationName
        });
        const { token, refreshToken, user } = response.data;
        login(token, refreshToken, user);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, register, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
