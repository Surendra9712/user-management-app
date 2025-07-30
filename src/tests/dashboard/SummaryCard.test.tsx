import React from 'react';
import { render, screen } from '@testing-library/react';
import SummaryCards, {SummaryData} from "@/app/(protected)/dashboard/components/SummaryCards";

describe('SummaryCards Component', () => {
    const testData: SummaryData = {
        total: 200,
        active: 150,
        inactive: 50
    };

    it('renders all cards with correct data', () => {
        render(<SummaryCards data={testData} />);

        expect(screen.getByText('Total Users')).toBeInTheDocument();
        expect(screen.getByText('200')).toBeInTheDocument();

        expect(screen.getByText('Active Users')).toBeInTheDocument();
        expect(screen.getByText('150')).toBeInTheDocument();

        expect(screen.getByText('Inactive Users')).toBeInTheDocument();
        expect(screen.getByText('50')).toBeInTheDocument();
    });

    it('applies correct border colors', () => {
        render(<SummaryCards data={testData} />);

        const totalCard = screen.getByText('Total Users').closest('div');
        const activeCard = screen.getByText('Active Users').closest('div');
        const inactiveCard = screen.getByText('Inactive Users').closest('div');

        expect(totalCard).toHaveClass('border-sky-500');
        expect(activeCard).toHaveClass('border-green-500');
        expect(inactiveCard).toHaveClass('border-red-500');
    });

    it('has correct responsive grid layout', () => {
        render(<SummaryCards data={testData} />);

        const grid = screen.getByText('Total Users').closest('div')?.parentElement;

        expect(grid).toHaveClass('grid');
        expect(grid).toHaveClass('grid-cols-1');
        expect(grid).toHaveClass('md:grid-cols-2');
        expect(grid).toHaveClass('lg:grid-cols-3');
        expect(grid).toHaveClass('gap-6');
    });

    it('handles large numbers with proper formatting', () => {
        const largeData: SummaryData = {
            total: 1000000,
            active: 750000,
            inactive: 250000
        };

        render(<SummaryCards data={largeData} />);

        expect(screen.getByText('1000000')).toBeInTheDocument();
        expect(screen.getByText('750000')).toBeInTheDocument();
        expect(screen.getByText('250000')).toBeInTheDocument();
    });

    it('maintains consistent styling across cards', () => {
        render(<SummaryCards data={testData} />);

        const cards = screen.getAllByRole('listitem');

        cards.forEach(card => {
            expect(card).toHaveClass('p-4');
            expect(card).toHaveClass('bg-white');
            expect(card).toHaveClass('rounded-xl');
            expect(card).toHaveClass('shadow');
            expect(card).toHaveClass('w-full');
            expect(card).toHaveClass('border-l-4');
        });

        const titles = screen.getAllByText(/Users$/);
        titles.forEach(title => {
            expect(title).toHaveClass('text-gray-500');
        });

        const values = screen.getAllByText(/\d+/);
        values.forEach(value => {
            expect(value).toHaveClass('text-2xl');
            expect(value).toHaveClass('font-semibold');
        });
    });
});