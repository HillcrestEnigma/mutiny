import {
  ConflictErrorResponse,
  ErrorType,
  FastifyErrorResponse,
  GenericErrorResponse,
  NotFoundErrorResponse,
  ValidationErrorResponse,
} from "@repo/schema";

const titleCase = (resource: string) =>
  resource.charAt(0).toUpperCase() + resource.slice(1);

interface MutinyServerErrorOptions extends ErrorOptions {}

export class MutinyServerError extends Error {
  errorType: ErrorType = "internal";
  statusCode = 500;
  responseExtras = {};

  constructor(message?: string, options?: MutinyServerErrorOptions) {
    super(message, options);

    this.name = "MutinyError";
  }

  set response(response: object) {
    this.responseExtras = response;
  }

  get response() {
    return {
      ...this.responseExtras,
      error: this.errorType,
      message: this.message,
    };
  }

  static fromResponse(response: object): MutinyServerError {
    const errorResponse = GenericErrorResponse.parse(response);

    const errorType = errorResponse.error;

    if (errorType === "notfound") {
      // 404
      const result = NotFoundErrorResponse.parse(response);
      return new NotFoundError(result.resource);
    } else if (errorType === "conflict") {
      // 409
      const result = ConflictErrorResponse.parse(response);
      return new ConflictError(result.resource);
    } else if (errorType === "validation") {
      // 422
      const result = ValidationErrorResponse.parse(response);
      return new ValidationError(result.field);
    } else if (errorType === "fastify") {
      // Fastify Error
      const result = FastifyErrorResponse.parse(response);
      return new FastifyError(result.message, result.code);
    } else {
      switch (errorType) {
        case "badrequest": // 400
          return new BadRequestError(errorResponse.message);
        case "unauthorized": // 401
          return new UnauthorizedError(errorResponse.message);
        case "forbidden": // 403
          return new ForbiddenError(errorResponse.message);
        case "internal": // 500
          return new InternalError(errorResponse.message);
        default: // Other
          return new MutinyServerError(errorResponse.message);
      }
    }
  }
}

export class InternalError extends MutinyServerError {
  constructor(message?: string, options?: MutinyServerErrorOptions) {
    super(message, options);

    this.name = "InternalError";
  }
}

export class BadRequestError extends MutinyServerError {
  constructor(message?: string, options?: MutinyServerErrorOptions) {
    super(message, options);

    this.name = "BadRequestError";
    this.errorType = "badrequest";
    this.statusCode = 400;
  }
}

export class UnauthorizedError extends BadRequestError {
  constructor(
    message = "User not authenticated.",
    options?: MutinyServerErrorOptions,
  ) {
    super(message, options);

    this.name = "AuthenticationError";
    this.errorType = "unauthorized";
    this.statusCode = 401;
  }
}

export class ForbiddenError extends BadRequestError {
  constructor(
    message = "User is forbidden.",
    options?: MutinyServerErrorOptions,
  ) {
    super(message, options);

    this.name = "ForbiddenError";
    this.errorType = "forbidden";
    this.statusCode = 403;
  }
}

export class NotFoundError extends BadRequestError {
  constructor(resource: string, options?: MutinyServerErrorOptions) {
    super(`${titleCase(resource)} not found.`, options);

    this.name = "NotFoundError";
    this.errorType = "notfound";
    this.statusCode = 404;
    this.response = {
      resource,
    };
  }
}

export class ConflictError extends BadRequestError {
  constructor(resource: string, options?: MutinyServerErrorOptions) {
    super(`${titleCase(resource)} already exists.`, options);

    this.name = "ConflictError";
    this.errorType = "conflict";
    this.statusCode = 409;
    this.response = {
      resource,
    };
  }
}

export class ValidationError extends BadRequestError {
  constructor(message?: string, options?: MutinyServerErrorOptions) {
    super(message, options);

    this.name = "ValidationError";
    this.errorType = "validation";
    this.statusCode = 422;
  }
}

export class FastifyError extends MutinyServerError {
  code: string;

  constructor(
    message: string,
    code: string,
    options?: MutinyServerErrorOptions,
  ) {
    super(message, options);

    this.name = "FastifyError";
    this.errorType = "fastify";
    this.statusCode = 500;
    this.code = code;
  }
}
