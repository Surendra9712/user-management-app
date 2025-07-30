import React from 'react';
import {render, screen} from '@testing-library/react';
import LoginPage from '@/app/(auth)/login/page';

jest.mock('@/app/(auth)/components/LoginForm', () => ({
    __esModule: true,
    default: () => <div data-testid="login-form"/>,
}));

jest.mock('@/components/common/Card', () => ({
    __esModule: true,
    Card: ({children, className}: { children: React.ReactNode; className?: string }) => (
        <div data-testid="card" className={className}>
            {children}
        </div>
    ),
}));

jest.mock('antd', () => ({
    Flex: ({children, ...props}: { children: React.ReactNode; [key: string]: any }) => (
        <div data-testid="flex-container" {...props}>
            {children}
        </div>
    ),
}));

describe('LoginPage Component', () => {

    it('renders the Card component with correct props', () => {
        render(<LoginPage/>);
        const card = screen.getByTestId('card');

        expect(card).toBeInTheDocument();
        expect(card).toHaveClass('w-full');
        expect(card).toHaveClass('max-w-md');
    });

    it('renders the LoginForm inside the Card', () => {
        render(<LoginPage/>);
        const card = screen.getByTestId('card');
        const loginForm = screen.getByTestId('login-form');
        expect(screen.getByTestId('card')).toBeInTheDocument();
        expect(loginForm).toBeInTheDocument();
        expect(card).toContainElement(loginForm);
    });
});