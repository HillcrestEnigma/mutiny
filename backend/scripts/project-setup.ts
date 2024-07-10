import { $, echo } from "zx";
import { existsSync } from "fs";

let modifiedProject = false;

if (!existsSync("./.env.development")) {
  modifiedProject = true;
  await $`touch ./.env.development`;
  await $`dotenvx set NODE_ENV "development" --plain -f ./.env.development`;
}

if (!existsSync("./.env.test")) {
  modifiedProject = true;
  await $`touch ./.env.test`;
  await $`dotenvx set NODE_ENV "test" --plain -f ./.env.test`;
  await $`dotenvx set DATABASE_URL "file:./test.sqlite3" --plain -f ./.env.test`;
}

await $`prisma generate`

if (modifiedProject) {
  echo(`Done setting up project.
Remember to customize .env.* files.`);
} else {
  echo(`Project is already set up.`);
}
