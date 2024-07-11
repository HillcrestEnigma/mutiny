import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  // ...tseslint.configs.strictTypeChecked,
  // ...tseslint.configs.stylisticTypeChecked,
  // {
  //   languageOptions: {
  //     // parser: "@typescript-eslint/parser",
  //     parserOptions: {
  //       project: true,
  //       // tsconfigRootDir: import.meta.dirname,
  //       tsconfigRootDir: process.cwd(),
  //     },
  //   },
  // },
  // {
  //   files: ["**/*.js"],
  //   extends: [tseslint.configs.disableTypeChecked],
  // },
  eslintConfigPrettier,
);
