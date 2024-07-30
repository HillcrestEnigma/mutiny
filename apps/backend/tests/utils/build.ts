import { build } from "../../src/app";

export const app = await build({
  logger: {
    level: "error",
    transport: {
      target: "pino-pretty",
    },
  },
});

// TODO: add test helpers through app.decorate
// e.g. add app.createUser to aid in creating users for tests
