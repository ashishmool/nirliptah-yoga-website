import React, { createContext, useState, ReactNode } from "react";

type UserInfoContextType = {
    isLoggedIn: boolean;
    setIsLoggedIn: (status: boolean) => void;
    token: string | null;
    setToken: (token: string | null) => void;
};

export const UserInfoContext = createContext<UserInfoContextType>({
    isLoggedIn: false,
    setIsLoggedIn: () => {},
    token: null,
    setToken: () => {},
});

export const UserInfoProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => !!token);

    // Update login status when token changes
    const handleSetToken = (newToken: string | null) => {
        setToken(newToken);
        setIsLoggedIn(!!newToken);
        if (newToken) {
            localStorage.setItem("token", newToken);
        } else {
            localStorage.removeItem("token");
        }
    };

    return (
        <UserInfoContext.Provider value={{ isLoggedIn, setIsLoggedIn, token, setToken: handleSetToken }}>
            {children}
        </UserInfoContext.Provider>
    );
};
