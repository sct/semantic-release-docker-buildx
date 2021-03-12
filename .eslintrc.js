module.exports = {
  extends: ["eslint:recommended", "prettier"],
  rules: {
    "arrow-parens": "off",
    "no-console": 1,
  },
  plugins: ["prettier"],
  reportUnusedDisableDirectives: true,
  parserOptions: {
    ecmaVersion: 2017,
  },
  env: {
    es6: true,
    node: true,
  },
};
