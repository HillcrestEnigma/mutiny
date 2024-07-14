import packageJSON from "../../package.json";

enum NodeEnv {
  Production = "production",
  Development = "development",
  Test = "test",
}

let nodeEnv: NodeEnv;
switch (process.env["NODE_ENV"]) {
  case "development":
    nodeEnv = NodeEnv.Development;
    break;
  case "test":
    nodeEnv = NodeEnv.Test;
    break;
  case "production":
  default:
    nodeEnv = NodeEnv.Production;
}

export const config = {
  env: {
    development: nodeEnv === NodeEnv.Development,
    test: nodeEnv === NodeEnv.Test,
    production: nodeEnv === NodeEnv.Production,
  },
  info: {
    title: packageJSON.name,
    description: packageJSON.description,
    version: packageJSON.version,
  },
  endpoints: {
    api: process.env["SERVER_URL"] ?? "https://example.com/api",
  },
  flags: {
    forceLog: process.env["FORCE_LOG"] === "1",
  },
};
