import { $, argv } from "zx";
import { config } from "@dotenvx/dotenvx";
import { dbMigrate } from "@repo/data/db";

config({
  path: ["./.env", "./.env.development", "./.env.test"],
  overload: true,
});
process.env.FORCE_COLOR = "1";

dbMigrate();

const args = [argv.watch ? "watch" : "run", "-r", "./tests"];

await $({
  nothrow: true,
  stdio: "inherit",
})`vitest ${args}`;
