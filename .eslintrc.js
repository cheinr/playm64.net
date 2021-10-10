module.exports = {
  env: {
    es6: true,
    node: false
  },
  extends: "plugin:@typescript-eslint/recommended",
  globals: {
    Atomics: "readonly",
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
    project: './tsconfig.json',
    tsconfigRootDir: __dirname
  },
  rules: {
    "indent": "off",
    "@typescript-eslint/triple-slash-reference": 1,
    "@typescript-eslint/camelcase": [0, {"properties": "always"}],
    "@typescript-eslint/no-floating-promises": ["error"],
    "@typescript-eslint/no-misused-promises": ["error"],
    "@typescript-eslint/promise-function-async": ["error"],
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": [0, { "args": "after-used" }],
    "@typescript-eslint/explicit-function-return-type": [ 1, { "allowExpressions": true }],
    "@typescript-eslint/ban-types": [
      "error",
      {
        "types": {
          "Function": false,
        },
        "extendDefaults": true
      }
    ],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "quotes": [
      "error",
      "single"
    ],
    "semi": [
      "error",
      "always"
    ]
  }
}
