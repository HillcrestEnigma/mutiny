import { $, echo } from "zx";
import { existsSync } from "fs";

let modifiedProject = false;

if (!existsSync("./.env.local")) {
  modifiedProject = true;
  await $`cp -n ./.env ./.env.local`;
}

if (!existsSync("./.env.test")) {
  modifiedProject = true;
  await $`cp -n ./.env ./.env.test`;
  await $`dotenvx set DATABASE_URL "file:./test.sqlite3" --plain -f ./.env.test`;
}

if (modifiedProject) {
  echo(`Done setting up project.
Remember to customize .env.local and .env.test files.
Run "pnpm db:migrate:apply" to apply migrations afterwards.`);
} else {
  echo(`Project is already set up.`);
}
