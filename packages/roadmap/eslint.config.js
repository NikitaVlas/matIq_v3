import base from "@matiq/config/eslint/base";

export default [
  ...base,
  {
    languageOptions: {
      parserOptions: { tsconfigRootDir: import.meta.dirname },
    },
  },
];
