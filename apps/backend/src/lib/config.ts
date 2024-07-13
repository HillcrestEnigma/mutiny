import packageJSON from "../../package.json";

export const config = {
  info: {
    title: packageJSON.name,
    description: packageJSON.description,
    version: packageJSON.version,
  },
  endpoints: {
    api: process.env.SERVER_URL ?? "https://example.com/api",
  },
};
