module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'eslint-plugin-import'],
  extends: ['plugin:@typescript-eslint/recommended'],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js', 'tailwind.config.js'],
  rules: {
    'prefer-const': [
      'error',
      {
        destructuring: 'all',
      },
    ],
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/no-namespace': 'warn',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/interface-name-prefix': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/explicit-module-boundary-types': 0,
    '@typescript-eslint/no-explicit-any': 0,
    'import/max-dependencies': [
      'warn',
      {
        max: 15,
        ignoreTypeImports: false,
      },
    ],
    'import/no-cycle': 2,
    'sort-imports': ['error', { ignoreCase: true, ignoreDeclarationSort: true }],
    'import/order': [
      1,
      {
        groups: ['external', 'builtin', 'internal', 'sibling', 'parent', 'index'],
        pathGroups: [
          { pattern: 'components', group: 'internal' },
          { pattern: 'components/**', group: 'internal' },
          { pattern: 'constants/**', group: 'internal' },
          { pattern: 'common', group: 'internal' },
          { pattern: 'error/**', group: 'internal' },
          { pattern: 'hooks/**', group: 'internal' },
          { pattern: 'locale/**', group: 'internal' },
          { pattern: 'routes/**', group: 'internal' },
          { pattern: 'selectors', group: 'internal' },
          { pattern: 'store', group: 'internal' },
          { pattern: 'assets/**', group: 'internal', position: 'after' },
        ],
        pathGroupsExcludedImportTypes: ['internal'],
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
  },
};
