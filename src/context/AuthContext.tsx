'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient, Session, User } from '@supabase/supabase-js';

// Create Supabase client for browser
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface AuthSession {
    access_token: string;
    refresh_token: string;
    expires_at: number;
    user: {
        id: string;
        phone: string;
    };
}

interface AuthContextType {
    session: AuthSession | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    setSession: (session: AuthSession | null) => void;
    logout: () => Promise<void>;
    getAuthenticatedClient: () => any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [session, setSessionState] = useState<AuthSession | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load session from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem('salonflow_session');
        if (stored) {
            try {
                const parsed = JSON.parse(stored) as AuthSession;
                // Check if session is expired
                if (parsed.expires_at * 1000 > Date.now()) {
                    setSessionState(parsed);
                } else {
                    localStorage.removeItem('salonflow_session');
                }
            } catch (e) {
                localStorage.removeItem('salonflow_session');
            }
        }
        setIsLoading(false);
    }, []);

    // Save session to localStorage when it changes
    const setSession = (newSession: AuthSession | null) => {
        setSessionState(newSession);
        if (newSession) {
            localStorage.setItem('salonflow_session', JSON.stringify(newSession));
        } else {
            localStorage.removeItem('salonflow_session');
        }
    };

    // Get authenticated Supabase client
    const getAuthenticatedClient = () => {
        if (!session) {
            return supabase;
        }

        return createClient(supabaseUrl, supabaseAnonKey, {
            global: {
                headers: {
                    Authorization: `Bearer ${session.access_token}`,
                },
            },
        });
    };

    // Logout
    const logout = async () => {
        setSession(null);
        await supabase.auth.signOut();
    };

    return (
        <AuthContext.Provider
            value={{
                session,
                isAuthenticated: !!session,
                isLoading,
                setSession,
                logout,
                getAuthenticatedClient,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

// Export the base supabase client for unauthenticated operations
export { supabase };
