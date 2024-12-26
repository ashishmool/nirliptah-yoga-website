// AuthContext.tsx
import React, { createContext, useState } from "react";

interface AuthInfo {
    email: string;
    role: string;
}

export const AuthContext = createContext({
    info: { email: "", role: "", id:"" },
    setInfo: (_info: AuthInfo) => {},
});

export const AuthProvider = ({ children }) => {
    const [info, setInfo] = useState<AuthInfo>(() => {
        // Initialize with values from localStorage if they exist
        const email = localStorage.getItem("email") || "";
        const role = localStorage.getItem("role") || "";
        const id = localStorage.getItem("user_id") || "";
        return { email, role, id };
    });

    return (
        <AuthContext.Provider value={{ info, setInfo }}>
            {children}
        </AuthContext.Provider>
    );
};
