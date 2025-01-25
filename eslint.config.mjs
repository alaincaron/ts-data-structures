import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    // Override for test files
    files: ['**/*.test.ts', '**/*.spec.ts', '**/tests/**/*.ts'],
    rules: {
      '@typescript-eslint/no-unused-expressions': 'off',
    },
  },
  {
    // General override for unused variables and arguments starting with "_"
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn', // Change to "error" or "off" if needed
        {
          vars: 'all', // Apply to all variables
          args: 'after-used', // Check arguments after the last used one
          ignoreRestSiblings: true, // Ignore variables in rest destructuring
          varsIgnorePattern: '^_', // Allow unused variables starting with "_"
          argsIgnorePattern: '^_', // Allow unused arguments starting with "_"
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-namespace': 'off',
    },
  },
];
