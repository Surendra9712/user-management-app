import React from 'react';
import { render, screen } from '@testing-library/react';
import UserList from "@/app/(protected)/users/page";

jest.mock('@/components/layout/ProtectedRoute', () => ({
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="protected-route">{children}</div>
    ),
}));

jest.mock('@/app/(protected)/users/provider/UserDrawerProvider', () => ({
    __esModule: true,
    UserDrawerProvider: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="user-drawer-provider">{children}</div>
    ),
}));

jest.mock('@/app/(protected)/users/components/UserPageHeader', () => ({
    __esModule: true,
    default: () => <div data-testid="page-header" />,
}));

jest.mock('@/app/(protected)/users/components/AddEditUser', () => ({
    __esModule: true,
    default: () => <div data-testid="add-edit-user" />,
}));

jest.mock('@/app/(protected)/users/components/PaginatedTable', () => ({
    __esModule: true,
    default: () => <div data-testid="paginated-table" />,
}));

describe('UserList Component', () => {
    it('renders without crashing', () => {
        render(<UserList />);
        expect(screen.getByTestId('protected-route')).toBeInTheDocument();
    });

    it('wraps content in ProtectedRoute', () => {
        render(<UserList />);
        const protectedRoute = screen.getByTestId('protected-route');
        expect(protectedRoute).toBeInTheDocument();
    });

    it('provides UserDrawer context to all child components', () => {
        render(<UserList />);
        const provider = screen.getByTestId('user-drawer-provider');
        expect(provider).toBeInTheDocument();

        expect(provider).toContainElement(screen.getByTestId('page-header'));
        expect(provider).toContainElement(screen.getByTestId('add-edit-user'));
        expect(provider).toContainElement(screen.getByTestId('paginated-table'));
    });

    it('renders all child components in correct order', () => {
        render(<UserList />);

        const protectedRoute = screen.getByTestId('protected-route');
        const provider = screen.getByTestId('user-drawer-provider');
        const pageHeader = screen.getByTestId('page-header');
        const addEditUser = screen.getByTestId('add-edit-user');
        const paginatedTable = screen.getByTestId('paginated-table');

        expect(protectedRoute).toContainElement(provider);
        expect(provider).toContainElement(pageHeader);
        expect(provider).toContainElement(addEditUser);
        expect(provider).toContainElement(paginatedTable);

        const providerChildren = Array.from(provider.children);
        expect(providerChildren[0]).toBe(pageHeader);
        expect(providerChildren[1]).toBe(addEditUser);
        expect(providerChildren[2]).toBe(paginatedTable);
    });

    it('has no extra elements beyond required components', () => {
        render(<UserList />);

        expect(screen.getByTestId('protected-route')).toBeInTheDocument();
        expect(screen.getByTestId('user-drawer-provider')).toBeInTheDocument();
        expect(screen.getByTestId('page-header')).toBeInTheDocument();
        expect(screen.getByTestId('add-edit-user')).toBeInTheDocument();
        expect(screen.getByTestId('paginated-table')).toBeInTheDocument();

        const allTestIds = screen.getAllByTestId(/.*/);
        expect(allTestIds.length).toBe(5);
    });
});