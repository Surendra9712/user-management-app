import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import Header from "@/components/layout/Header";

jest.mock('next/navigation', () => ({
    usePathname: jest.fn(),
}));

jest.mock('next-auth/react', () => ({
    signOut: jest.fn(),
}));

const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;
const mockSignOut = signOut as jest.MockedFunction<typeof signOut>;

describe('Header Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should not render when pathname is /login', () => {
        mockUsePathname.mockReturnValue('/login');
        const { container } = render(<Header />);
        expect(container).toBeEmptyDOMElement();
    });

    it('should render when pathname is not /login', () => {
        mockUsePathname.mockReturnValue('/dashboard');
        render(<Header />);

        expect(screen.getByRole('banner')).toBeInTheDocument();
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
        expect(screen.getByText('Home')).toBeInTheDocument();
        expect(screen.getByText('Users')).toBeInTheDocument();
        expect(screen.getByText('Logout')).toBeInTheDocument();
    });

    it('should have correct links with proper href attributes', () => {
        mockUsePathname.mockReturnValue('/dashboard');
        render(<Header />);

        const dashboardLink = screen.getByText('Dashboard').closest('a');
        expect(dashboardLink).toHaveAttribute('href', '/dashboard');

        const homeLink = screen.getByText('Home').closest('a');
        expect(homeLink).toHaveAttribute('href', '/dashboard');

        const usersLink = screen.getByText('Users').closest('a');
        expect(usersLink).toHaveAttribute('href', '/users');
    });

    it('should call signOut with correct parameters when logout button is clicked', async () => {
        mockUsePathname.mockReturnValue('/dashboard');
        render(<Header />);

        const logoutButton = screen.getByText('Logout');
        fireEvent.click(logoutButton);

        expect(mockSignOut).toHaveBeenCalledWith({
            callbackUrl: '/login'
        });
    });

    it('should have sticky positioning and correct styling', () => {
        mockUsePathname.mockReturnValue('/dashboard');
        render(<Header />);

        const header = screen.getByRole('banner');
        expect(header).toHaveClass('sticky');
        expect(header).toHaveClass('top-0');
        expect(header).toHaveClass('z-50');
        expect(header).toHaveClass('bg-gray-800');
        expect(header).toHaveClass('text-white');
    });
});