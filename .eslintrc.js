module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'airbnb-typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['react', '@typescript-eslint'],
  rules: {
    '@typescript-eslint/ban-ts-comment': 0,
    '@typescript-eslint/no-unused-vars': 2,
    '@typescript-eslint/explicit-module-boundary-types': 0,
    'consistent-return': 0,
    'import/extensions': 0,
    'no-restricted-syntax': 0,
    'no-restricted-imports': [
      2,
      {
        name: 'firebase',
        message:
          'Don’t directly import firebase, which doesn’t have our instance configured properly. Use src/firebaseInstance instead',
      },
    ],
    'no-plusplus': 0,
    'no-void': 0,
    'react/button-has-type': 0,
    'react/jsx-props-no-spreading': 0,
    'react/require-default-props': 0,
    'react/destructuring-assignment': 0,
    'react/react-in-jsx-scope': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/label-has-associated-control': [
      2,
      {
        assert: 'either',
      },
    ],
  },
};
