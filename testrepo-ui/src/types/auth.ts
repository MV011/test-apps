export type User = {
    id: number;
    username: string;
    email: string;
} | null;

export type AuthState = {
    isAuthenticated: boolean;
    user: User;
    isLoading: boolean;
};

export type LoginFormData = {
    username: string;
    password: string;
};