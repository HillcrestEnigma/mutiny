import { $ } from "bun";

let modifiedProject = false;

// Database setup
if (!(await Bun.file("./packages/db/db.sqlite3").exists())) {
  modifiedProject = true;

  await $`bunx prisma db push`.cwd("./packages/db").quiet();

  console.log(`Generated SQLite3 database file.`);
}

// Backend setup
if (!(await Bun.file("./apps/backend/.env").exists())) {
  modifiedProject = true;

  const exampleDotEnv = Bun.file("./apps/backend/.env.example");
  const dotEnv = Bun.file("./apps/backend/.env");
  await Bun.write(dotEnv, exampleDotEnv);

  $.cwd("./apps/backend");

  await $`bunx dotenvx set NODE_ENV "development" -f ./.env --plain`.quiet();
  await $`bunx dotenvx set SERVER_URL "http://localhost:5000" -f ./.env --plain`.quiet();

  $.cwd(".");

  console.log(`Generated apps/backend/.env file.`);
}

// Mobile setup
if (!(await Bun.file("./apps/mobile/.env").exists())) {
  modifiedProject = true;

  const exampleDotEnv = Bun.file("./apps/mobile/.env.example");
  const dotEnv = Bun.file("./apps/mobile/.env");
  await Bun.write(dotEnv, exampleDotEnv);

  $.cwd("./apps/mobile");

  await $`bunx dotenvx set EXPO_PUBLIC_SERVER_URL "http://localhost:5000/api" -f ./.env --plain`.quiet();

  $.cwd(".");

  console.log(`Generated apps/mobile/.env file.`);
}

await $`husky`.quiet();
await $`turbo run build`.quiet();

if (modifiedProject) {
  console.log("Done setting up project.");
  console.log("Customize apps/**/.env files to your liking.");
} else {
  console.log(`Project is already set up.`);
}
