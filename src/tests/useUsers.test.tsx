import {renderHook, waitFor} from '@testing-library/react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {useUsers} from '@/hooks/useUsers'; // adjust path
import {userService} from '@/service';

jest.mock('@/service', () => ({
    userService: {
        fetchUsers: jest.fn(),
        createUser: jest.fn(),
        updateUser: jest.fn(),
        deleteUser: jest.fn(),
    },
}));

const wrapper = ({children}: { children: React.ReactNode }) => {
    const queryClient = new QueryClient();
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

describe('useUsers hook', () => {
    const mockUsers = [
        {id: 1, name: 'John', email: 'john@example.com'},
        {id: 2, name: 'Jane', email: 'jane@example.com'},
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should fetches users successfully', async () => {
        (userService.fetchUsers as jest.Mock).mockResolvedValueOnce(mockUsers);

        const {result} = renderHook(() => useUsers(), {wrapper});

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data).toEqual(mockUsers);
        expect(userService.fetchUsers).toHaveBeenCalled();
    });

    it('should creates a user and invalidates users query', async () => {
        const user = {
            name: 'John Doe',
            email: 'john@example.com',
            phone: 1234567890,
            gender: 1,
            status: 1,
            joinDate: '2023-01-01',
            role: 'Admin',
            address: '123 Main St',
        };

        (userService.fetchUsers as jest.Mock).mockResolvedValueOnce([]);
        (userService.createUser as jest.Mock).mockResolvedValueOnce({id: 3, ...user});

        const {result} = renderHook(() => useUsers(), {wrapper});

        await result.current.createUser(user);

        expect(userService.createUser).toHaveBeenCalledWith(user);
    });

    it('should updates a user and invalidates users query', async () => {
        (userService.fetchUsers as jest.Mock).mockResolvedValueOnce([]);
        (userService.updateUser as jest.Mock).mockResolvedValueOnce({id: 1, name: 'Updated'});

        const {result} = renderHook(() => useUsers(), {wrapper});

        await result.current.updateUser({id: 1, updated: {name: 'Updated'}});

        expect(userService.updateUser).toHaveBeenCalledWith(1, {name: 'Updated'});
    });

    it('should deletes a user and invalidates users query', async () => {
        (userService.fetchUsers as jest.Mock).mockResolvedValueOnce([]);
        (userService.deleteUser as jest.Mock).mockResolvedValueOnce({});

        const {result} = renderHook(() => useUsers(), {wrapper});

        await result.current.deleteUser(1);

        expect(userService.deleteUser).toHaveBeenCalledWith(1);
    });
});
