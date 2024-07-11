import { defineConfig } from "drizzle-kit";
import { databaseURL } from "./src/db/config";

export default defineConfig({
  dialect: "sqlite",
  schema: "./db/tables/*.ts",
  out: "./db/migrations",
  dbCredentials: {
    url: databaseURL,
  },
});
