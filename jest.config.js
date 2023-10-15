/** @type {import('ts-jest').JestConfigWithTsJest} */

const config = {
  testEnvironment: 'node',
  preset: 'ts-jest/presets/default-esm', // or other ESM presets
  resolver: 'jest-ts-webcompat-resolver',
  moduleNameMapper: {
    '^@constants(.*)$': '<rootDir>/src/constants/$1',
    '^@handlers(.*)$': '<rootDir>/src/handlers/$1',
    '^@generated(.*)$': '<rootDir>/src/generated/$1',
    '^@joi_schemas(.*)$': '<rootDir>/src/joi_schemas/$1',
    '^@templates(.*)$': '<rootDir>/src/templates/$1',
    '^@utils(.*)$': '<rootDir>/src/utils/$1',
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  testMatch: ['**/__tests__/**/*.+(ts|tsx|js)', '**/?(*.)+(spec|test).+(ts|tsx|js)'],
  transform: {
    // '^.+\\.[tj]sx?$' to process js/ts with `ts-jest`
    // '^.+\\.m?[tj]sx?$' to process js/ts/mjs/mts with `ts-jest`
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
};

export default config;
