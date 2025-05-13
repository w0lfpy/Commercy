'use client';

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [role, setRole] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userRole = localStorage.getItem("role");

        if (token) {
            setIsAuthenticated(true);
            setRole(userRole);
        }
    }, []);

    const setAuth = (token, userRole) => {
        if (token) {
            localStorage.setItem("token", token);
            localStorage.setItem("role", userRole);
            setIsAuthenticated(true);
            setRole(userRole);
        } else {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            setIsAuthenticated(false);
            setRole("");
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, role, setAuth }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
