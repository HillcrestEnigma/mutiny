import { expo as appJSON } from "../../app.json";

export const config = {
  info: {
    title: appJSON.name,
    description: appJSON.description,
    version: appJSON.version,
  },
  endpoints: {
    // @ts-expect-error: Expo wants dot notation on process.env for some reason
    api: process.env.EXPO_PUBLIC_SERVER_URL ?? "http://localhost:5000/api",
  },
};
