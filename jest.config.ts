import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>jest.setup.ts'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^@components/(.*)$': '<rootDir>/src/components/$1',
        '\\.(css|scss)$': 'identity-obj-proxy',
    },
    transform: {
        '^.+\\.(ts|tsx)$': [
            'ts-jest',
            { tsconfig: './tsconfig.jest.json' }
        ]
    },
    testPathIgnorePatterns: [
        '<rootDir>/node_modules/',
        '<rootDir>/.next/'
    ],
    collectCoverageFrom: [
        'src/**/*.{ts,tsx}',
        '!src/**/*.d.ts',
        '!src/app/layout.tsx',
        '!src/**/__stories__/**'
    ]
};

export default config;