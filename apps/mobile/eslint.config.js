import expoConfig from "@repo/config-eslint/expo";

export default [
  ...expoConfig,
  {
    ignores: ["babel.config.cjs", "metro.config.cjs"],
  },
];
