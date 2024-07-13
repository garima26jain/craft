/* eslint-disable no-undef */
const jestConfig = {
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
    '\\.mjs$': 'babel-jest'
  },
  setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'mjs'],
  transformIgnorePatterns: [
    'node_modules/(?!(string-width|cliui)/)' // Add more problematic packages here
  ],
};

export default jestConfig
