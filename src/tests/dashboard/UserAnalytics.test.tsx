import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { useUsers } from '@/hooks/useUsers';
import UserAnalytics from "@/app/(protected)/dashboard/components/UserAnalytics";

jest.mock('@/hooks/useUsers');
jest.mock('@/components/common/PieChart', () => ({
    __esModule: true,
    default: ({ data, title, colors }: any) => (
        <div data-testid="pie-chart" data-title={title} data-colors={JSON.stringify(colors)}>
            {data.map((item: any) => (
                <div key={item.name}>{item.name}: {item.value}</div>
            ))}
        </div>
    ),
}));

jest.mock('@/app/(protected)/dashboard/components/JoinByDateBarChart', () => ({
    __esModule: true,
    default: ({ data }: any) => (
        <div data-testid="bar-chart">
            {data.map((item: any) => (
                <div key={item.month}>{item.month}: {item.count}</div>
            ))}
        </div>
    ),
}));

jest.mock('@/app/(protected)/dashboard/components/SummaryCards', () => ({
    __esModule: true,
    default: ({ data }: any) => (
        <div data-testid="summary-cards">
            <div>Total Users: {data.total}</div>
            <div>Active Users: {data.active}</div>
            <div>Inactive Users: {data.inactive}</div>
        </div>
    ),
}));

describe('UserAnalytics Component', () => {
    const mockUsers = [
        { id: '1', role: 'Admin', joinDate: '2023-01-15' },
        { id: '2', role: 'General Manager', joinDate: '2023-01-20' },
        { id: '3', role: 'Admin', joinDate: '2023-02-10' },
        { id: '4', role: 'General Manager', joinDate: '2023-02-15' },
        { id: '5', role: 'Admin', joinDate: '2023-03-05' },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        (useUsers as jest.Mock).mockReturnValue({
            data: mockUsers,
            isLoading: false,
            error: null,
        });
    });

    it('renders all child components with correct data', async () => {
        render(<UserAnalytics />);

        await waitFor(() => {
            // Verify pie charts
            const pieCharts = screen.getAllByTestId('pie-chart');
            expect(pieCharts).toHaveLength(2);

            // First pie chart (attendance)
            expect(pieCharts[0]).toHaveAttribute('data-title', "Today's Attendance");
            expect(pieCharts[0]).toHaveTextContent('Present: 10');
            expect(pieCharts[0]).toHaveTextContent('Absent: 3');
            expect(pieCharts[0]).toHaveTextContent('Leave: 4');

            // Second pie chart (roles)
            expect(pieCharts[1]).toHaveAttribute('data-title', 'User Role Breakdown');
            expect(pieCharts[1]).toHaveTextContent('Admin: 3');
            expect(pieCharts[1]).toHaveTextContent('General Manager: 2');

            // Verify bar chart
            const barChart = screen.getByTestId('bar-chart');
            expect(barChart).toHaveTextContent('Jan 2023: 2');
            expect(barChart).toHaveTextContent('Feb 2023: 2');
            expect(barChart).toHaveTextContent('Mar 2023: 1');

            // Verify summary cards
            const summaryCards = screen.getByTestId('summary-cards');
            expect(summaryCards).toHaveTextContent('Total Users: 200');
            expect(summaryCards).toHaveTextContent('Active Users: 150');
            expect(summaryCards).toHaveTextContent('Inactive Users: 50');
        });
    });

    it('correctly transforms user data into role statistics', async () => {
        render(<UserAnalytics />);

        await waitFor(() => {
            const rolePieChart = screen.getAllByTestId('pie-chart')[1];
            expect(rolePieChart).toHaveTextContent('Admin: 3');
            expect(rolePieChart).toHaveTextContent('General Manager: 2');
        });
    });

    it('correctly transforms join dates into monthly statistics', async () => {
        render(<UserAnalytics />);

        await waitFor(() => {
            const barChart = screen.getByTestId('bar-chart');
            expect(barChart).toHaveTextContent('Jan 2023: 2');
            expect(barChart).toHaveTextContent('Feb 2023: 2');
            expect(barChart).toHaveTextContent('Mar 2023: 1');
        });
    });

    it('handles empty user data gracefully', async () => {
        (useUsers as jest.Mock).mockReturnValue({
            data: [],
            isLoading: false,
            error: null,
        });

        render(<UserAnalytics />);

        await waitFor(() => {
            const rolePieChart = screen.getAllByTestId('pie-chart')[1];
            expect(rolePieChart).not.toHaveTextContent(/admin|user|editor/);

            const barChart = screen.getByTestId('bar-chart');
            expect(barChart).not.toHaveTextContent(/\d+/);
        });
    });

    it('passes correct colors to attendance pie chart', async () => {
        render(<UserAnalytics />);

        await waitFor(() => {
            const attendancePieChart = screen.getAllByTestId('pie-chart')[0];
            const colors = JSON.parse(attendancePieChart.getAttribute('data-colors') as string);
            expect(colors).toEqual(['#03ad31', '#ad1a03', '#FFBB28']);
        });
    });
});