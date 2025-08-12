module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'subject-case': [2, 'always', 'lower-case'],
    'header-case': [2, 'always', 'lower-case'],
  },
};
