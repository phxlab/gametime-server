export default {
  type: 'module',
  testEnvironment: 'node',
  globalSetup: './tests/config/globalSetup.js',
  globalTeardown: './tests/config/globalTeardown.js',
  setupFilesAfterEnv: ['./tests/config/setupFile.js'],
  setupFiles: ['dotenv/config'],
};
