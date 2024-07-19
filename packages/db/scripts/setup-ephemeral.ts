import { $ } from "bun";
import { tmpfile } from "zx";

const DATABASE_URL = `file:${tmpfile()}`;

await $`prisma db push --skip-generate`.env({ DATABASE_URL }).quiet();

process.stdout.write(DATABASE_URL);
