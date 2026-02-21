import React, { createContext, useState, useContext, ReactNode } from 'react';

interface LoginModalContextProps {
    isDialogOpen: boolean;
    setIsDialogOpen: (state: boolean) => void;
}

const LoginModalContext = createContext<LoginModalContextProps | undefined>(undefined);

export const useLoginModal = (): LoginModalContextProps => {
    const context = useContext(LoginModalContext);
    if (!context) {
        throw new Error('useLoginModal must be used within a LoginModalProvider');
    }
    return context;
};

interface LoginModalProviderProps {
    children: ReactNode;
}

export const LoginModalProvider: React.FC<LoginModalProviderProps> = ({ children }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    return (
        <LoginModalContext.Provider value={{ isDialogOpen, setIsDialogOpen }}>
            {children}
        </LoginModalContext.Provider>
    );
};
