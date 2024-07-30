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

export * from "./payloads/user";
export * from "./payloads/session";

export * from "./forms/user";
export * from "./forms/session";

export * from "./responses/generic";
export * from "./responses/error";
export * from "./responses/info";
export * from "./responses/user";
export * from "./responses/session";
