module.exports = {
  env: {
    es2021: true,
    node: true,
    jest: true,
  },
  extends: [
    'plugin:@typescript-eslint/recommended', // Add TypeScript recommended rules
    'plugin:jest/recommended', // Add Jest recommended rules
  ],
  overrides: [
    {
      files: ['*.ts'], // Apply TypeScript-specific rules to TypeScript files
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: './tsconfig.json', // Specify the path to your tsconfig.json
      },
    },
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  plugins: ['@typescript-eslint', 'jest', 'import'], // Add @typescript-eslint and jest plugins
  rules: {
    'no-console': 'off',
    'import/extensions': 'off',
    'consistent-return': 'off',
    'import/no-extraneous-dependencies': [
      'error',
      { devDependencies: true },
    ],
  },
};
