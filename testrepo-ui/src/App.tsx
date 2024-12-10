import { useState, useEffect } from 'react';
import { authApi } from './api/auth';
import { AuthState } from './types/auth';
import Header from './components/Header';
import LoginForm from './components/LoginForm';
import LoadingSpinner from './components/LoadingSpinner';
import TestManager from './pages/TestManager';
import SignUpForm from "@/components/SignUpForm.tsx";


type AuthView = 'login' | 'signup';

const App = () => {
    const [authState, setAuthState] = useState<AuthState>({
        isAuthenticated: false,
        user: null,
        isLoading: true,
    });
    const [authView, setAuthView] = useState<AuthView>('login');

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            try {
                const userData = await authApi.getCurrentUser(token);
                setAuthState({
                    isAuthenticated: true,
                    user: userData,
                    isLoading: false,
                });
            } catch (error) {
                handleLogout();
            }
        } else {
            setAuthState(prev => ({ ...prev, isLoading: false }));
        }
    };

    const handleLogin = async (username: string, password: string) => {
        try {
            const { access_token, refresh_token } = await authApi.login(username, password);
            localStorage.setItem('accessToken', access_token);
            localStorage.setItem('refreshToken', refresh_token);

            const userData = await authApi.getCurrentUser(access_token);
            setAuthState({
                isAuthenticated: true,
                user: userData,
                isLoading: false,
            });
        } catch (error) {
            throw error;
        }
    };

    const handleSignUp = async (email: string, username: string, password: string) => {
        await authApi.signUp(email, username, password);
        // After successful signup, automatically log in the user
        await handleLogin(username, password);
    };


    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setAuthState({
            isAuthenticated: false,
            user: null,
            isLoading: false,
        });
    };

    if (authState.isLoading) {
        return <LoadingSpinner />;
    }

    if (!authState.isAuthenticated) {
        return authView === 'login' ? (
            <LoginForm
                onLogin={handleLogin}
                onShowSignUp={() => setAuthView('signup')}
            />
        ) : (
            <SignUpForm
                onSignUp={handleSignUp}
                onShowLogin={() => setAuthView('login')}
            />
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Header user={authState.user} onLogout={handleLogout} />
            <main className="max-w-7xl mx-auto px-4 py-6">
                <TestManager />
            </main>
        </div>
    );
};

export default App;
