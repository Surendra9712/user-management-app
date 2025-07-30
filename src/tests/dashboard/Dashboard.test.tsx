import React from 'react';
import {render, screen} from '@testing-library/react';
import Dashboard from "@/app/(protected)/dashboard/page";

jest.mock('@/components/layout/ProtectedRoute', () => ({
    __esModule: true,
    default: ({children}: { children: React.ReactNode }) => (
        <div data-testid="protected-route">
            {children}
        </div>
    ),
}));

jest.mock('@/app/(protected)/dashboard/components/UserAnalytics', () => ({
    __esModule: true,
    default: () => <div data-testid="user-analytics"/>,
}));

describe('Dashboard Component', () => {
    it('renders without crashing', () => {
        render(<Dashboard/>);
        expect(screen.getByTestId('protected-route')).toBeInTheDocument();
    });

    it('wraps UserAnalytics in ProtectedRoute', () => {
        render(<Dashboard/>);
        const protectedRoute = screen.getByTestId('protected-route');
        const userAnalytics = screen.getByTestId('user-analytics');
        expect(protectedRoute).toContainElement(userAnalytics);
    });

    it('only renders ProtectedRoute and UserAnalytics components', () => {
        render(<Dashboard/>);
        expect(screen.getByTestId('protected-route')).toBeInTheDocument();
        expect(screen.getByTestId('user-analytics')).toBeInTheDocument();
    });
});