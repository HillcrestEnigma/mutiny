import { $, echo } from "zx";
import "../src/lib/env.ts"

process.env.FORCE_COLOR = "1";

const optionTerminatorIndex = process.argv.indexOf("--");

if (optionTerminatorIndex === -1) {
  echo(`Please invoke this script with the -- option terminator.
Like this: ${process.argv.join(" ")} -- <command> <args>`);
} else {
  const command = process.argv.slice(optionTerminatorIndex + 1);

  await $({
    nothrow: true,
    stdio: "inherit",
  })`${command}`;
}
