import { $ } from "bun";

let modifiedProject = false;

if (!(await Bun.file("./packages/db/db.sqlite3").exists())) {
  modifiedProject = true;

  await $`bunx prisma db push`.cwd("./packages/db").quiet();

  console.log(`Generated SQLite3 database file.`);
}

if (!(await Bun.file("./apps/backend/.env").exists())) {
  modifiedProject = true;

  const exampleDotEnv = Bun.file("./apps/backend/.env.example");
  const dotEnv = Bun.file("./apps/backend/.env");
  await Bun.write(dotEnv, exampleDotEnv);

  $.cwd("./apps/backend");

  await $`bunx dotenvx set NODE_ENV "development" -f ./.env --plain`.quiet();
  await $`bunx dotenvx set SERVER_URL "http://localhost:5000" -f ./.env --plain`.quiet();

  $.cwd(".");

  console.log(`Generated backend/.env file.`);
}

await $`husky`.quiet();
await $`turbo run build`.quiet();

if (modifiedProject) {
  console.log("Done setting up project.");
  console.log("Customize apps/backend/.env file to your liking.");
} else {
  console.log(`Project is already set up.`);
}
