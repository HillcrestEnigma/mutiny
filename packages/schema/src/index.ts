import { z } from "zod";

z.setErrorMap((issue, ctx) => {
  switch (issue.code) {
    case z.ZodIssueCode.too_small:
      return { message: "Too Short" };
    case z.ZodIssueCode.too_big:
      return { message: "Too Long" };
    default:
      return { message: ctx.defaultError };
  }
});

export * from "./fields";

export * from "./models/user";
export * from "./models/session";
export * from "./models/profile";

export * from "./payloads/user";
export * from "./payloads/session";
export * from "./payloads/profile";

export * from "./forms/user";
export * from "./forms/session";
export * from "./forms/profile";

export * from "./responses/meta/generic";
export * from "./responses/meta/error";
export * from "./responses/meta/info";

export * from "./responses/resource/user";
export * from "./responses/resource/session";
export * from "./responses/resource/profile";
