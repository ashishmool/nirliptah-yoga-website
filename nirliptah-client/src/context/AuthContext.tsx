import React, { createContext, useState, useEffect } from "react";

interface AuthInfo {
    email: string;
    role: string;
    user_id: string;
}

export const AuthContext = createContext({
    info: { email: "", role: "", user_id: "" },
    setInfo: (_info: AuthInfo) => {},
});

export const AuthProvider = ({ children }) => {
    const [info, setInfo] = useState<AuthInfo>(() => {
        // Initialize with values from localStorage if they exist
        const email = localStorage.getItem("email") || "";
        const role = localStorage.getItem("role") || "";
        const user_id = localStorage.getItem("id") || "";
        return { email, role, user_id };
    });

    useEffect(() => {
        // Sync the info state with localStorage if it changes
        localStorage.setItem("email", info.email);
        localStorage.setItem("role", info.role);
        localStorage.setItem("id", info.user_id);
    }, [info]);

    return (
        <AuthContext.Provider value={{ info, setInfo }}>
            {children}
        </AuthContext.Provider>
    );
};
