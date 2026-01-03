export const HTTP_ERRORS = {
  BAD_REQUEST: { status: 400, message: "Bad Request" },
  UNAUTHORIZED: { status: 401, message: "Unauthorized" },
  FORBIDDEN: { status: 403, message: "Forbidden" },
  NOT_FOUND: { status: 404, message: "Not Found" },
  INTERNAL_SERVER_ERROR: { status: 500, message: "Internal Server Error" },
};

export class AppError extends Error {
  public status: number;
  public code: string;

  constructor(code: string, status: number, message: string) {
    super(message);
    this.status = status;
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
  }
}
