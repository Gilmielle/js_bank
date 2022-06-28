// eslint-disable-next-line no-undef
module.exports = {
  env: {
    browser: true,
    es2021: true,
    'jest/globals': true,
    'cypress/globals': true,
  },
  plugins: ['cypress', 'prettier', 'jest'],
  extends: ['eslint:recommended', 'plugin:jest/recommended', 'prettier'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'no-var': 'error',
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
  },
};
