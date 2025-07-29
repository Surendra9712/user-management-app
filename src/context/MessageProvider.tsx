"use client";
import React, { createContext, useContext } from 'react';
import { message } from 'antd';

const MessageContext = createContext<ReturnType<typeof message.useMessage> | null>(null);

export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [messageApi, contextHolder] = message.useMessage();

    return (
        <MessageContext.Provider value={[messageApi, contextHolder]}>
            {contextHolder}
            {children}
        </MessageContext.Provider>
    );
};

export const useMessageApi = () => {
    const context = useContext(MessageContext);
    if (!context) {
        throw new Error('useMessageApi must be used within a MessageProvider');
    }
    return context[0];
};
