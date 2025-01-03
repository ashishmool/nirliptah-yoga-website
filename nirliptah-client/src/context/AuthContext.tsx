import React, { createContext, useState, useEffect, ReactNode } from "react";

// Define structure of AuthInfo
interface AuthInfo {
    email: string;
    role: string;
    user_id: string;
    photo: string;
}

// AuthContext with default values
export const AuthContext = createContext<{
    info: AuthInfo;
    setInfo: (info: { role: any; user_id: any; photo: any; email: any }) => void;
}>({
    info: { email: "", role: "", user_id: "", photo:"" },
    setInfo: () => {}, // Default no-op function
});

// Props for AuthProvider
interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [info, setInfo] = useState<AuthInfo>(() => {
        const email = localStorage.getItem("email") || "";
        const role = localStorage.getItem("role") || "";
        const user_id = localStorage.getItem("user_id") || "";
        return { email, role, user_id };
    });

    useEffect(() => {
        try {
            localStorage.setItem("email", info.email);
            localStorage.setItem("role", info.role);
            localStorage.setItem("user_id", info.user_id);
        } catch (error) {
            console.error("Failed to sync state with localStorage:", error);
        }
    }, [info]);

    return (
        <AuthContext.Provider value={{ info, setInfo }}>
            {children}
        </AuthContext.Provider>
    );
};
