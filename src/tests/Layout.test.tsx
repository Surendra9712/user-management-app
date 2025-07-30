import React from 'react';
import {render, screen} from '@testing-library/react';
import Layout from "@/components/layout/Layout";

jest.mock('@/components/layout/Header', () => <div data-testid="mock-header">Header</div>);

describe('Layout component', () => {
    it('renders header, children, and footer', () => {
        const testText = 'This is the main content';

        render(
            <Layout>
                <div>{testText}</div>
            </Layout>
        );

        expect(screen.getByTestId('mock-header')).toBeInTheDocument();

        expect(screen.getByText(testText)).toBeInTheDocument();

        expect(screen.getByText('© 2023 User Management System')).toBeInTheDocument();
    });
});
