import { $, argv, tmpfile, cd } from "zx";
import { config } from "@dotenvx/dotenvx";

config();

const dbFile = tmpfile();
process.env.DATABASE_URL = `file:${dbFile}`;
process.env.NODE_ENV = "test";
process.env.FORCE_COLOR = "1";

cd("../packages/db");
await $`pnpm exec prisma db push`;
cd("../../backend");

const args = [argv.watch ? "watch" : "run", "-r", "./tests"];

await $({
  nothrow: true,
  stdio: "inherit",
})`vitest ${args}`;
