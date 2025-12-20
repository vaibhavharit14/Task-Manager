import { createContext, useState, useEffect, type ReactNode } from "react";
import apiClient from "../utils/apiClient";

type User = { id: string; name: string; email: string };

type AuthContextType = {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Restore user on reload if token exists
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            apiClient
                .get("/auth/me")
                .then((res) => setUser(res.data.data.user))
                .catch(() => {
                    localStorage.removeItem("token");
                    setUser(null);
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const res = await apiClient.post("/auth/login", { email, password });
            const result = res.data;

            if (result.success) {
                const token =
                    result.token ||
                    result.accessToken ||
                    (result.data && result.data.token);

                if (!token) throw new Error("No token found in response");
                localStorage.setItem("token", token);
                setUser(result.data.user);
            } else {
                throw new Error(result.message || "Login failed");
            }
        } catch (err: any) {
            console.error("Login error:", err.response?.data || err.message);
            throw err;
        }
    };

    const register = async (name: string, email: string, password: string) => {
        try {
            const res = await apiClient.post("/auth/register", {
                name,
                email,
                password,
            });
            const result = res.data;

            if (result.success) {
                // Registration successful, no auto-login (as per user request)
                console.log("Registration successful");
            } else {
                throw new Error(result.message || "Registration failed");
            }
        } catch (err: any) {
            console.error("Register error:", err.response?.data || err.message);
            throw err;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
