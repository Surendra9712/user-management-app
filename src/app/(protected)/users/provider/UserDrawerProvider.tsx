"use client"
import {createContext, ReactNode, useContext, useState} from "react";
import {User} from "@/interface/user";

interface IUserDrawerContext {
    isOpen: boolean;
    close: () => void;
    open: () => void;
    user: User | null;
    setUser: (user: User | null) => void;
}

const UserDrawerContext = createContext<IUserDrawerContext>({
    isOpen: false,
    close: () => {
    },
    open: () => {
    },
    user: null,
    setUser: () => {
    },
});

export const useUserDrawer = () => {
    const context = useContext(UserDrawerContext);
    if (!context) {
        throw new Error('useUserDrawer must be used within a UserDrawerProvider');
    }
    return context;
};

export const UserDrawerProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);

    return (
        <UserDrawerContext.Provider value={{isOpen, open, close, user, setUser}}>
            {children}
        </UserDrawerContext.Provider>
    );
}