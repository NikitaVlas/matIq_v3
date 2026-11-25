import base from "@matiq/config/eslint/base";

export default [
  ...base,
  {
    ignores: ["drizzle/**"],
  },
  {
    languageOptions: {
      parserOptions: { tsconfigRootDir: import.meta.dirname },
    },
  },
];
