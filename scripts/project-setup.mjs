import { $, echo, cd } from "zx";
import { existsSync } from "fs";
import { copyFile, constants } from "node:fs/promises";

let modifiedProject = false;

if (!existsSync("./db.sqlite3")) {
  modifiedProject = true;

  cd("./packages/db");
  await $`pnpm exec prisma db push`;
  cd("../..");

  echo(`Generated SQLite3 database file.`);
}

if (!existsSync("./apps/backend/.env")) {
  modifiedProject = true;

  cd("./apps/backend");
  await copyFile("./.env.example", "./.env", constants.COPYFILE_EXCL);
  await $`pnpm exec dotenvx set NODE_ENV "development" -f ./.env --plain`;
  await $`pnpm exec dotenvx set SERVER_URL "http://localhost:5000" -f ./.env --plain`;
  cd("../..");

  echo(`Generated backend/.env file.`);
}

await $`husky`;
await $`turbo run build`;

if (modifiedProject) {
  echo(`Done setting up project.
Customize backend/.env file to your liking.`);
} else {
  echo(`Project is already set up.`);
}
