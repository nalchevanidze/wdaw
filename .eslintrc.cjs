module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  parserOptions: {
    project: ['**/tsconfig.json'],
    EXPERIMENTAL_useSourceOfProjectReferenceRedirect: true,
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['deprecation', 'react', '@typescript-eslint'],
  rules: {
    'deprecation/deprecation': 'warn', // or "error" to have stricter rule
    'arrow-body-style': ['error', 'as-needed'],
    'react/jsx-filename-extension': ['error', { extensions: ['.tsx', '.jsx'] }],
    'react/function-component-definition': [
      'error',
      { namedComponents: 'arrow-function' }
    ],
    'react/require-default-props': 'off'
  },
  ignorePatterns: [
    'packages/*/tsconfig.json',
    'packages/infra/cdk.out',
    'jest.config.ts',
    'webpack.config.js',
    'packages/**/generated/**',
    'packages/*/__test__',
    '.eslintrc.cjs',
    'jest.config.js',
    'test-report',
    'packages/*/dist',
    'codegen.ts',
    'tsconfig.json'
  ]
};
