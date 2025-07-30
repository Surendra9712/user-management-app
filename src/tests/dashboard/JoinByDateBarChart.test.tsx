import React from 'react';
import {render, screen} from '@testing-library/react';
import JoinByDateBarChart from "@/app/(protected)/dashboard/components/JoinByDateBarChart";

jest.mock('recharts', () => ({
    ...jest.requireActual('recharts'),
    BarChart: jest.fn(() => null),
    ResponsiveContainer: jest.fn(({children}) => <div>{children}</div>),
}));

jest.mock('@/components/common/Card', () => ({
    __esModule: true,
    Card: ({children}: { children: React.ReactNode }) => (
        <div data-testid="card">{children}</div>
    ),
}));

describe('JoinByDateBarChart Component', () => {
    const testData = [
        {month: 'Dec 2002', count: 10},
        {month: 'Oct 2004', count: 20},
        {month: 'Sep 2010', count: 15},
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders without crashing', () => {
        render(<JoinByDateBarChart data={testData}/>);
        expect(screen.getByTestId('card')).toBeInTheDocument();
    });

    it('displays the correct title', () => {
        render(<JoinByDateBarChart data={testData}/>);
        expect(screen.getByText('Users Joined Over Time')).toBeInTheDocument();
    });
});