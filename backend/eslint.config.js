import nodeConfig from "@repo/config-eslint/node.js";

export default [
  ...nodeConfig,
  {
    ignores: ["dist/**/*"],
  },
];
