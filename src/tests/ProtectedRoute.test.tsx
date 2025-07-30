import { render, screen, waitFor } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import ProtectedRoute from "@/components/layout/ProtectedRoute";
const mockPush = jest.fn();

jest.mock('next-auth/react', () => ({
    useSession: jest.fn(),
}));

jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: mockPush,
        back: jest.fn(),
        forward: jest.fn(),
        refresh: jest.fn(),
        replace: jest.fn(),
        prefetch: jest.fn(),
    }),
    usePathname: jest.fn(),
}));

const mockUseSession = useSession as jest.MockedFunction<typeof useSession>;

describe('ProtectedRoute Component', () => {
    const TestChild = () => <div>Protected Content</div>;

    beforeEach(() => {
        jest.clearAllMocks();

        mockUseSession.mockReturnValue({
            data: null,
            status: 'unauthenticated',
            update: jest.fn(),
        });
    });

    it('should render loading state when authentication status is loading', () => {
        mockUseSession.mockReturnValue({
            data: null,
            status: 'loading',
            update: jest.fn(),
        });

        render(
            <ProtectedRoute>
                <TestChild />
            </ProtectedRoute>
        );

        expect(screen.getByText('Loading...')).toBeInTheDocument();
        expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    it('should redirect to login when unauthenticated', async () => {
        mockUseSession.mockReturnValue({
            data: null,
            status: 'unauthenticated',
            update: jest.fn(),
        });

        render(
            <ProtectedRoute>
                <TestChild />
            </ProtectedRoute>
        );

        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith('/login');
        });

        expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    it('should render children when authenticated', () => {
        mockUseSession.mockReturnValue({
            data: {
                user: { name: 'John Doe', email: 'john@example.com' },
                expires: '2025-01-01',
            },
            status: 'authenticated',
            update: jest.fn(),
        });

        render(
            <ProtectedRoute>
                <TestChild />
            </ProtectedRoute>
        );

        expect(screen.getByText('Protected Content')).toBeInTheDocument();
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    it('should handle session data correctly', () => {
        const sessionData = {
            user: { name: 'Jane Smith', email: 'jane@example.com' },
            expires: '2025-12-31',
        };

        mockUseSession.mockReturnValue({
            data: sessionData,
            status: 'authenticated',
            update: jest.fn(),
        });

        render(
            <ProtectedRoute>
                <TestChild />
            </ProtectedRoute>
        );

        expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    it('should not redirect when status is loading', async () => {
        mockUseSession.mockReturnValue({
            data: null,
            status: 'loading',
            update: jest.fn(),
        });

        render(
            <ProtectedRoute>
                <TestChild />
            </ProtectedRoute>
        );

        await waitFor(() => {
            expect(mockPush).not.toHaveBeenCalled();
        });
    });
});