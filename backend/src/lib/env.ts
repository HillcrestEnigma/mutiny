import { config } from "@dotenvx/dotenvx";

config({
  path: ["./.env", "./.env.development"],
  overload: true,
});
