import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import {signIn} from 'next-auth/react';
import {useRouter} from 'next/navigation';
import * as UIComponents from '@surendra9712/ui-components';
import LoginForm from "@/app/(auth)/components/LoginForm";

jest.mock('next-auth/react');
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));
jest.mock('@surendra9712/ui-components', () => ({
    ...jest.requireActual('@surendra9712/ui-components'),
    useFormHandler: jest.fn(),
    validators: {
        required: jest.fn(),
        email: jest.fn(),
    },
}));
jest.mock('@/components/common/ErrorSpan', () => ({
    __esModule: true,
    default: ({message}: { message: string }) => (
        <div data-testid="error-span">{message}</div>
    ),
}));

const mockSignIn = signIn as jest.Mock;
const mockPush = jest.fn();
(useRouter as jest.Mock).mockReturnValue({
    push: mockPush,
});

type FormHandlerMock = {
    formData: { email: string; password: string };
    errors: Record<string, string[]>;
    handleChange: jest.Mock;
    handleBlur: jest.Mock;
    validateForm: jest.Mock;
};

describe('LoginForm Component', () => {
    let formHandlerMock: FormHandlerMock;

    beforeEach(() => {
        jest.clearAllMocks();

        formHandlerMock = {
            formData: {email: '', password: ''},
            errors: {},
            handleChange: jest.fn(),
            handleBlur: jest.fn(),
            validateForm: jest.fn().mockReturnValue(true),
        };

        (UIComponents.useFormHandler as jest.Mock).mockReturnValue(formHandlerMock);
    });

    it('renders the login form correctly', () => {
        render(<LoginForm/>);

        expect(screen.getByText('User Login')).toBeInTheDocument();
        expect(screen.getByRole('button', {name: 'Login'})).toBeInTheDocument();
    });

    it('shows validation errors', () => {
        formHandlerMock.errors = {
            email: ['Email is required'],
            password: ['Password is required'],
        };

        render(<LoginForm/>);

        expect(screen.getByText('Email is required')).toBeInTheDocument();
        expect(screen.getByText('Password is required')).toBeInTheDocument();
    });

    it('handles input changes', () => {
        render(<LoginForm/>);

        const emailInput = screen.getByPlaceholderText('Username');
        fireEvent.change(emailInput, {target: {value: 'test@example.com'}});
        expect(formHandlerMock.handleChange).toHaveBeenCalledWith('email', 'test@example.com');

        const passwordInput = screen.getByPlaceholderText('Enter password');
        fireEvent.change(passwordInput, {target: {value: 'password123'}});
        expect(formHandlerMock.handleChange).toHaveBeenCalledWith('password', 'password123');
    });

    it('shows loading state in button when submitting', async () => {
        render(<LoginForm/>);

        const loginButton = screen.getByRole('button', {name: 'Login'});
        fireEvent.click(loginButton);

        expect(await screen.findByText('Logging in...')).toBeInTheDocument();
    });

    it('displays error on invalid credentials', async () => {
        mockSignIn.mockResolvedValue({error: 'Invalid login credentials.'});

        render(<LoginForm/>);

        fireEvent.click(screen.getByRole('button', {name: 'Login'}));

        await waitFor(() => {
            expect(screen.getByTestId('error-span')).toHaveTextContent('Invalid login credentials.');
        });
    });

    it('redirects to dashboard on successful login', async () => {
        mockSignIn.mockResolvedValue({ok: true});

        render(<LoginForm/>);

        fireEvent.click(screen.getByRole('button', {name: 'Login'}));

        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith('/dashboard');
            expect(screen.getByText('Redirecting to dashboard...')).toBeInTheDocument();
        });
    });

    it('prevents submission when validation fails', async () => {
        formHandlerMock.validateForm.mockReturnValue(false);

        render(<LoginForm/>);

        fireEvent.click(screen.getByRole('button', {name: 'Login'}));

        await waitFor(() => {
            expect(mockSignIn).not.toHaveBeenCalled();
        });
    });

    it('shows redirecting state', async () => {
        mockSignIn.mockResolvedValue({ok: true});

        render(<LoginForm/>);

        fireEvent.click(screen.getByRole('button', {name: 'Login'}));

        await waitFor(() => {
            expect(screen.queryByText('Login')).toBeNull();
            expect(screen.getByText('Redirecting to dashboard...')).toBeInTheDocument();
            expect(screen.getByText('Please wait a moment.')).toBeInTheDocument();
        });
    });
});