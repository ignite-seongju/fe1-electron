/** @type {import("eslint").Linter.Config} */
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['@typescript-eslint', 'prettier', 'unused-imports'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  settings: {
    'eslint-report.json': null,
  },
  ignorePatterns: ['**/dist', '**/build', '**/out', '**/release', '**/*.js'],
  overrides: [
    {
      files: ['**/*.+(js)', '**/*.+(cjs)'],
      extends: ['eslint:recommended'],
      parserOptions: {
        sourceType: 'script',
      },
      env: {
        node: true,
        commonjs: true,
      },
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
  ],
  rules: {
    'prettier/prettier': 'error',
    'no-void': 'off',
    'no-redeclare': 'off',
    '@typescript-eslint/no-redeclare': ['off'],
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['off'],
    '@typescript-eslint/comma-spacing': 'off',
    '@typescript-eslint/no-dupe-class-members': 'off',
    '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'off',
    '@typescript-eslint/consistent-type-definitions': 'off',
    '@typescript-eslint/space-before-function-paren': 'off',
    '@typescript-eslint/indent': 'off',
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/strict-boolean-expressions': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/prefer-includes': 'off',
    '@typescript-eslint/triple-slash-reference': 'off',
    'comma-dangle': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
    'no-unused-vars': 'warn', // TypeScript 버전 사용
    'unused-imports/no-unused-imports': 'warn',
    '@typescript-eslint/consistent-type-assertions': 'off',
    '@typescript-eslint/naming-convention': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-misused-promises': 'off',
    '@typescript-eslint/no-empty-object-type': 'off',
    'eqeqeq': 'error',
    '@typescript-eslint/no-explicit-any': 'off',
    'no-console': 'off', // Electron 앱에서는 console.log 허용
  },
};