import { render, screen, fireEvent } from '@testing-library/react';
import { useUserDrawer } from '@/app/(protected)/users/provider/UserDrawerProvider';
import UserPageHeader from "@/app/(protected)/users/components/UserPageHeader";

jest.mock('@/app/(protected)/users/provider/UserDrawerProvider');
jest.mock('react-icons/ai', () => ({
    AiOutlinePlus: () => <span>MockPlusIcon</span>,
}));

const mockUseUserDrawer = useUserDrawer as jest.MockedFunction<typeof useUserDrawer>;

describe('PageHeader Component', () => {
    const mockOpen = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        mockUseUserDrawer.mockReturnValue({
            open: mockOpen,
            close: jest.fn(),
            isOpen: false,
            user: null,
            setUser: jest.fn(),
        });
    });

    it('should render the title correctly', () => {
        render(<UserPageHeader />);
        expect(screen.getByText('Users')).toBeInTheDocument();
        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Users');
    });

    it('should render the "New" button with plus icon', () => {
        render(<UserPageHeader />);

        const button = screen.getByRole('button', { name: /new/i });
        expect(button).toBeInTheDocument();
        expect(button).toHaveTextContent('MockPlusIcon New');
        expect(button).toHaveClass('ant-btn');
        expect(button).toHaveClass('ant-btn-primary');
    });

    it('should call open function from useUserDrawer when button is clicked', () => {
        render(<UserPageHeader />);

        const button = screen.getByRole('button', { name: /new/i });
        fireEvent.click(button);

        expect(mockOpen).toHaveBeenCalledTimes(1);
    });

    it('should have the correct flex layout', () => {
        const { container } = render(<UserPageHeader />);
        const flexElement = container.firstChild;
        expect(flexElement).toHaveClass('ant-flex');
        expect(flexElement).toHaveClass('border-b');
        expect(flexElement).toHaveClass('!mb-6');
    });

    it('should render the plus icon correctly', () => {
        render(<UserPageHeader />);
        expect(screen.getByText('MockPlusIcon')).toBeInTheDocument();
    });
});