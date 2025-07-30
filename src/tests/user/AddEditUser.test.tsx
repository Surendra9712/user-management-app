import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import AddEditUser from '@/app/(protected)/users/components/AddEditUser';
import {useUserDrawer} from '@/app/(protected)/users/provider/UserDrawerProvider';
import {useUsers} from '@/hooks/useUsers';
import {useMessageApi} from '@/context/MessageProvider';
import * as UIComponents from '@surendra9712/ui-components';

jest.mock('@/app/(protected)/users/provider/UserDrawerProvider');
jest.mock('@/hooks/useUsers');
jest.mock('@/context/MessageProvider');
jest.mock('@surendra9712/ui-components', () => ({
    ...jest.requireActual('@surendra9712/ui-components'),
    useFormHandler: jest.fn(),
}));

const mockUseUserDrawer = useUserDrawer as jest.MockedFunction<typeof useUserDrawer>;
const mockUseUsers = useUsers as jest.MockedFunction<typeof useUsers>;
const mockUseMessageApi = useMessageApi as jest.MockedFunction<typeof useMessageApi>;

describe('AddEditUser Component', () => {
    const mockClose = jest.fn();
    const mockSetUser = jest.fn();
    const mockCreateUser = jest.fn();
    const mockUpdateUser = jest.fn();
    const mockSuccess = jest.fn();

    const mockFormHandler = {
        formData: {
            name: '',
            email: '',
            address: '',
            status: 1,
            gender: 1,
            joinDate: '',
            phone: 0,
            role: '',
        },
        errors: {},
        touched: {},
        setFormData: jest.fn(),
        handleChange: jest.fn(),
        handleBlur: jest.fn(),
        validateForm: jest.fn().mockReturnValue(true),
        resetForm: jest.fn(),
        validateField: jest.fn(),
    };

    beforeEach(() => {
        mockUseUserDrawer.mockReturnValue({
            open(): void {
            },
            isOpen: true,
            user: null,
            close: mockClose,
            setUser: mockSetUser
        });

        mockUseUsers.mockReturnValue({
            createUser: mockCreateUser,
            createUserLoading: false,
            updateUser: mockUpdateUser,
            updateUserLoading: false,
        } as any);

        mockUseMessageApi.mockReturnValue({
            success: mockSuccess,
        } as any);

        jest.spyOn(UIComponents, 'useFormHandler').mockReturnValue(mockFormHandler);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render drawer with "Add User" title when no user is provided', () => {
        render(<AddEditUser/>);
        expect(screen.getByText('Add User')).toBeInTheDocument();
    });

    it('should render drawer with "Edit User" title when user is provided', () => {
        mockUseUserDrawer.mockReturnValueOnce({
            ...mockUseUserDrawer(),
            user: {
                id: 1, name: 'John Doe',
                email: '',
                gender: 1,
                joinDate: '',
                role: '',
                status: 1,
                address: ''
            },
        });

        render(<AddEditUser/>);
        expect(screen.getByText('Edit User')).toBeInTheDocument();
    });

    it('should close drawer when cancel button is clicked', () => {
        render(<AddEditUser/>);
        fireEvent.click(screen.getByText('Cancel'));
        expect(mockClose).toHaveBeenCalled();
        expect(mockSetUser).toHaveBeenCalledWith(null);
    });

    it('should show validation errors when form is submitted with empty fields', async () => {
        mockFormHandler.validateForm.mockReturnValue(false);
        mockFormHandler.errors = {
            name: 'Full name is required',
            email: 'Email is required',
            phone: 'Phone number is required',
            joinDate: 'Join Date is required',
            role: 'Role is required',
        };

        render(<AddEditUser/>);

        fireEvent.click(screen.getByText('Submit'));

        await waitFor(() => {
            expect(screen.getByText('Full name is required')).toBeInTheDocument();
            expect(screen.getByText('Email is required')).toBeInTheDocument();
            expect(screen.getByText('Phone number is required')).toBeInTheDocument();
            expect(screen.getByText('Join Date is required')).toBeInTheDocument();
            expect(screen.getByText('Role is required')).toBeInTheDocument();
        });
    });

    it('should submit new user form successfully', async () => {
        mockFormHandler.validateForm.mockReturnValue(true);
        const formData = {
            name: 'New User',
            email: 'new@example.com',
            phone: 1234567890,
            gender: 1,
            status: 1,
            joinDate: "2025-04-12",
            role: 'Admin',
            address: 'Test Address',
        };

        mockFormHandler.formData = formData;

        render(<AddEditUser/>);
        fireEvent.click(screen.getByText('Submit'));
        await waitFor(() => {
            expect(mockCreateUser).toHaveBeenCalledWith(formData);
            expect(mockSuccess).toHaveBeenCalledWith('User created successfully.');
            expect(mockClose).toHaveBeenCalled();
            expect(mockSetUser).toHaveBeenCalledWith(null);
        });
    });

    it('should update existing user successfully', async () => {
        const user = {
            id: 1,
            name: 'Existing User',
            email: 'existing@example.com',
            phone: 987654321,
            gender: 2,
            status: 0,
            joinDate: '2023-01-01',
            role: 'Manager',
            address: 'Updated Address',
        };

        mockUseUserDrawer.mockReturnValueOnce({
            ...mockUseUserDrawer(),
            user,
        });

        mockFormHandler.formData = {
            name: 'Existing User',
            email: 'existing@example.com',
            phone: 987654321,
            gender: 2,
            status: 0,
            joinDate: '2023-01-01',
            role: 'Manager',
            address: 'Updated Address',
        };

        render(<AddEditUser/>);
        fireEvent.click(screen.getByText('Submit'));
        await waitFor(() => {
            expect(mockUpdateUser).toHaveBeenCalledWith({
                id: 1,
                updated: {
                    name: 'Existing User',
                    email: 'existing@example.com',
                    phone: 987654321,
                    gender: 2,
                    status: 0,
                    joinDate: '2023-01-01',
                    role: 'Manager',
                    address: 'Updated Address',
                }
            });
            expect(mockSuccess).toHaveBeenCalledWith('User updated successfully.');
            expect(mockClose).toHaveBeenCalled();
        });
    });

    it('should pre-fill form when user data is provided', () => {
        const user = {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            phone: 1234567890,
            gender: 1,
            status: 1,
            joinDate: '2023-01-01',
            role: 'Admin',
            address: '123 Main St',
        };

        mockUseUserDrawer.mockReturnValueOnce({
            ...mockUseUserDrawer(),
            user,
        });
        render(<AddEditUser/>);
        expect(mockFormHandler.setFormData).toHaveBeenCalledWith(user);
    });
});