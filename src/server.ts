import { build } from "./app.ts";

const app = build({
  logger: {
    level: "info",
    transport: {
      target: "pino-pretty",
    },
  },
});

(async () => {
  try {
    await app.listen({ port: 5000 });
  } catch (err) {
    app.log.error(err);

    process.exit(1);
  }
})();
