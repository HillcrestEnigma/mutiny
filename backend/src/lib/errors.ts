import { ErrorType } from "@repo/schema";

interface MutinyErrorOptions extends ErrorOptions {}

export class MutinyError extends Error {
  errorType: ErrorType;
  statusCode: number;
  response: object;

  constructor(message?: string, options?: MutinyErrorOptions) {
    super(message, options);

    this.name = "MutinyError";
    this.errorType = "internal";
    this.statusCode = 500;
    this.response = {};
  }
}

export class InternalError extends MutinyError {
  constructor(message?: string, options?: MutinyErrorOptions) {
    super(message, options);

    this.name = "InternalError";
  }
}

class BadRequestError extends MutinyError {
  constructor(message?: string, options?: MutinyErrorOptions) {
    super(message, options);

    this.name = "BadRequestError";
    this.statusCode = 400;
  }
}

export class UnauthorizedError extends BadRequestError {
  constructor(
    message = "User not authenticated.",
    options?: MutinyErrorOptions,
  ) {
    super(message, options);

    this.name = "AuthenticationError";
    this.errorType = "unauthorized";
    this.statusCode = 401;
  }
}

interface ConflictErrorOptions extends MutinyErrorOptions {
  message?: string;
}

export class ConflictError extends BadRequestError {
  constructor(resource: string, options?: ConflictErrorOptions) {
    let message;

    if (options && options.message) {
      message = options.message;
    } else {
      const resourceTitle =
        resource.charAt(0).toUpperCase() + resource.slice(1);
      message = `${resourceTitle} already exists.`;
    }

    super(message, options);

    this.name = "ConflictError";
    this.errorType = "conflict";
    this.statusCode = 409;
    this.response = {
      resource,
    };
  }
}
