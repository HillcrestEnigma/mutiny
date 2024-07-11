import sqlite from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import * as tables from "./tables/index";
import { databaseURL } from "./config";

const sqliteDB = sqlite(databaseURL);
export const db = drizzle(sqliteDB, { schema: tables });

export const dbMigrate = () => {
  migrate(db, {
    migrationsFolder: "./migrations",
  });
};

export const dbCloseConnection = () => {
  sqliteDB.close();
};
