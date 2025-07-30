import React from 'react';
import {fireEvent, render, screen, waitFor, within} from '@testing-library/react';
import PaginatedTable from '@/app/(protected)/users/components/PaginatedTable';
import {useUsers} from '@/hooks/useUsers';
import {useUserDrawer} from '@/app/(protected)/users/provider/UserDrawerProvider';

jest.mock('@/hooks/useUsers');
jest.mock('@/app/(protected)/users/provider/UserDrawerProvider');
jest.mock('@ant-design/icons', () => ({
    SearchOutlined: () => <span>SearchIcon</span>,
}));
jest.mock('react-icons/ai', () => ({
    AiOutlineEdit: () => <span>EditIcon</span>,
    AiOutlineDelete: () => <span>DeleteIcon</span>,
}));

const mockUseUsers = useUsers as jest.MockedFunction<typeof useUsers>;
const mockUseUserDrawer = useUserDrawer as jest.MockedFunction<typeof useUserDrawer>;

Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

describe('PaginatedTable Component', () => {
    const mockOpen = jest.fn();
    const mockSetUser = jest.fn();
    const mockDeleteUser = jest.fn();

    const mockData = [
        {
            id: 1,
            key: 1,
            name: 'John Doe',
            email: 'john@example.com',
            role: 'Admin',
            status: 1,
            joinDate: '2023-01-01',
            phone: 1234567890,
            gender: 1,
            address: '123 Main St',
        },
        {
            id: 2,
            key: 2,
            name: 'Jane Smith',
            email: 'jane@example.com',
            role: 'Manager',
            status: 0,
            joinDate: '2023-02-01',
            phone: 987654321,
            gender: 2,
            address: '456 Oak St',
        },
    ];

    beforeEach(() => {
        jest.clearAllMocks();

        mockUseUsers.mockReturnValue({
            data: mockData,
            isLoading: false,
            deleteUser: mockDeleteUser,
        } as any);

        mockUseUserDrawer.mockReturnValue({
            open: mockOpen,
            setUser: mockSetUser,
            close: jest.fn(),
            isOpen: false,
            user: null,
        });
    });

    it('should render table with correct data', () => {
        render(<PaginatedTable/>);

        // Check headers
        expect(screen.getByText('Name')).toBeInTheDocument();
        expect(screen.getByText('Email')).toBeInTheDocument();
        expect(screen.getByText('Role')).toBeInTheDocument();
        expect(screen.getByText('Status')).toBeInTheDocument();
        expect(screen.getByText('Joined')).toBeInTheDocument();
        expect(screen.getByText('Actions')).toBeInTheDocument();

        // Check row data
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('john@example.com')).toBeInTheDocument();
        expect(screen.getByText('Admin')).toBeInTheDocument();
        expect(screen.getByText('Active')).toBeInTheDocument();
        expect(screen.getByText('2023-01-01')).toBeInTheDocument();

        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
        expect(screen.getByText('jane@example.com')).toBeInTheDocument();
        expect(screen.getByText('Manager')).toBeInTheDocument();
        expect(screen.getByText('Inactive')).toBeInTheDocument();
    });

    it('should render status tags with correct colors', () => {
        render(<PaginatedTable/>);

        const activeTag = screen.getByText('Active');
        expect(activeTag).toHaveClass('ant-tag-green');

        const inactiveTag = screen.getByText('Inactive');
        expect(inactiveTag).toHaveClass('ant-tag-red');
    });

    it('should filter data when searching', () => {
        render(<PaginatedTable/>);

        const searchInput = screen.getByPlaceholderText('Search by name or email');

        fireEvent.change(searchInput, {target: {value: 'John'}});

        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
    });

    it('should open edit drawer when edit button is clicked', () => {
        render(<PaginatedTable/>);

        const editButtons = screen.getAllByText('EditIcon');
        fireEvent.click(editButtons[0]);

        expect(mockSetUser).toHaveBeenCalledWith(mockData[0]);
        expect(mockOpen).toHaveBeenCalled();
    });

    it('should show delete confirmation when delete button is clicked', async () => {
        render(<PaginatedTable/>);

        const deleteButtons = screen.getAllByText('DeleteIcon');
        fireEvent.click(deleteButtons[0]);

        expect(screen.getByText('Delete the user')).toBeInTheDocument();
        expect(screen.getByText('Are you sure you want to delete this user?')).toBeInTheDocument();
        expect(screen.getByText('Yes')).toBeInTheDocument();
        expect(screen.getByText('No')).toBeInTheDocument();
    });

    it('should call deleteUser when delete confirmation is confirmed', async () => {
        render(<PaginatedTable/>);

        const deleteButtons = screen.getAllByText('DeleteIcon');
        fireEvent.click(deleteButtons[0]);

        fireEvent.click(screen.getByText('Yes'));

        await waitFor(() => {
            expect(mockDeleteUser).toHaveBeenCalledWith(1);
        });
    });

    it('should not delete user when delete confirmation is canceled', async () => {
        render(<PaginatedTable/>);

        const deleteButtons = screen.getAllByText('DeleteIcon');
        fireEvent.click(deleteButtons[0]);

        fireEvent.click(screen.getByText('No'));

        await waitFor(() => {
            expect(mockDeleteUser).not.toHaveBeenCalled();
        });
    });

    it('should sort by name when name header is clicked', async () => {
        render(<PaginatedTable/>);

        const nameHeader = screen.getByText('Name');
        fireEvent.click(nameHeader);

        const rows = screen.getAllByRole('row').slice(1);
        const firstRowName = within(rows[0]).getByText('Jane Smith');
        expect(firstRowName).toBeInTheDocument();

        fireEvent.click(nameHeader);
        const reversedRows = screen.getAllByRole('row').slice(1);
        const reversedFirstName = within(reversedRows[0]).getByText('John Doe');
        expect(reversedFirstName).toBeInTheDocument();
    });
});