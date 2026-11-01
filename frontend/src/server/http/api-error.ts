import "server-only";

class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string = "bad request"): ApiError {
    return new ApiError(400, message);
  }

  static unauthorisedRequest(
    message: string = "unauthorised request",
  ): ApiError {
    return new ApiError(401, message);
  }

  static unauthorised(message: string = "Unauthorized"): ApiError {
    return new ApiError(401, message);
  }

  static conflict(message: string = "Conflict - user already exist"): ApiError {
    return new ApiError(409, message);
  }

  static forbidden(message: string = "forbidden"): ApiError {
    return new ApiError(403, message);
  }
  static notfound(message: string = "not found"): ApiError {
    return new ApiError(404, message);
  }
  static notImplemented = (msg = "Not implemented") => new ApiError(501, msg);
}

export default ApiError;
