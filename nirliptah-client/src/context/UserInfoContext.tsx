import React, { createContext, useState, useEffect, ReactNode } from "react";

type UserInfoContextType = {
    isLoggedIn: boolean;
    setIsLoggedIn: (status: boolean) => void;
};

export const UserInfoContext = createContext<UserInfoContextType>({
    isLoggedIn: false,
    setIsLoggedIn: () => {},
});

export const UserInfoProvider = ({ children }: { children: ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
        return !!localStorage.getItem("token"); // Initialize from localStorage
    });


    return (
        <UserInfoContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
            {children}
        </UserInfoContext.Provider>
    );
};
