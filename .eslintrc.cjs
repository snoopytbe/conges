module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: [
    '@typescript-eslint',
    'react'
  ],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended'
  ],
  settings: {
    react: {
      version: 'detect'
    }
  },
  rules: {
    'no-undef': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off'
  },
  ignorePatterns: ['.eslintrc.js', 'node_modules', 'build', 'dist'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.json'],
        sourceType: 'module',
        ecmaVersion: 2020,
        ecmaFeatures: {
          jsx: true
        }
      },
      extends: [
        'plugin:@typescript-eslint/recommended'
      ],
      rules: {
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/explicit-module-boundary-types': 'off'
      }
    }
  ]
};
