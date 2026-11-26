import base from "@matiq/config/eslint/base";
import reactHooks from "eslint-plugin-react-hooks";

export default [
  ...base,
  {
    plugins: { "react-hooks": reactHooks },
    rules: { ...reactHooks.configs.recommended.rules },
  },
  {
    languageOptions: {
      parserOptions: { tsconfigRootDir: import.meta.dirname },
    },
  },
];
