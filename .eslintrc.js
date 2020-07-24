module.exports = {
  root: true,

  env: {
    node: true,
  },

  parserOptions: {
    parser: 'babel-eslint',
  },

  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    'max-len': 'off',
  },

  extends: [
    'plugin:vue/strongly-recommended',
    '@vue/airbnb',
  ],
};
