import { build } from "./app";

const app = await build({
  logger: {
    level: "info",
    transport: {
      target: "pino-pretty",
    },
  },
});

try {
  await app.listen({ port: 5000 });
} catch (error) {
  app.log.error(error);
  process.exit(1);
}
