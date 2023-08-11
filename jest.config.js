module.exports = {
  testEnvironment: 'node',
  globalSetup: './tests/config/globalSetup.ts',
  globalTeardown: './tests/config/globalTeardown.ts',
  setupFilesAfterEnv: ['./tests/config/setupFile.ts'],
  setupFiles: ['dotenv/config'],
  testMatch: [
    "**/__tests__/**/*.+(ts|tsx|js)",
    "**/?(*.)+(spec|test).+(ts|tsx|js)"
  ],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
};
