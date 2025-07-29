'use client';

import {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import {SessionProvider, useSession} from 'next-auth/react';
import {UserSession} from "@/interface/userSession";

interface AuthContextType {
    user: UserSession['user'] | null;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({children}: { children: ReactNode }) => {
    const {data: session, status} = useSession();
    const [user, setUser] = useState<UserSession['user'] | null>(null);

    useEffect(() => {
        if (session) {
            setUser(session.user);
        } else {
            setUser(null);
        }
    }, [session]);

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading: status === 'loading',
            }}>
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

export function AppSessionProvider({children}: { children: React.ReactNode }) {
    return <SessionProvider>{children}</SessionProvider>;
}
