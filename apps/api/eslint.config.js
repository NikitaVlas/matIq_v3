import base from "@matiq/config/eslint/base";

export default [
  ...base,
  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
        // Tells consistent-type-imports that classes used in decorated constructors
        // are runtime values (needed for NestJS dependency injection).
        emitDecoratorMetadata: true,
        experimentalDecorators: true,
      },
    },
  },
];
