import '@testing-library/jest-dom';

// Mock next/navigation
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
        pathname: '/',
    }),
    usePathname: () => '/',
}));
// jest.setup.js or jest.setup.ts
Object.defineProperty(window, 'getComputedStyle', {
    value: () => ({
        getPropertyValue: () => '', // mock for CSS variables
        overflow: 'auto',
        display: 'block',
        height: '100px',
        width: '100px',
    }),
});
