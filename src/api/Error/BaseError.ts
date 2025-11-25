import { ErrorResponse, IResponse } from "@/types/responseError";

export class ErrorSchema<T> implements IResponse<T> {
  error: ErrorResponse;

  constructor(code: number, message: string, displayMessage?: string) {
    this.error = {
      code,
      message,
      displayMessage: displayMessage ?? message,
    };
  }
}

export class TimeOutException<T> extends ErrorSchema<T> {
  constructor(message?: string) {
    super(408, message ?? "Server not Responding");
  }
}

export class InternalServerException<T> extends ErrorSchema<T> {
  constructor(message?: string) {
    super(500, message ?? "Internal Server Error");
  }
}

export class FetchDataException<T> extends ErrorSchema<T> {
  constructor(message?: string) {
    super(300, message ?? "Failed to Fetch", "No Internet");
  }
}

export class BadRequestException<T> extends ErrorSchema<T> {
  constructor(message?: string) {
    super(400, message ?? "Bad Request");
  }
}

export class NotFoundException<T> extends ErrorSchema<T> {
  constructor(message?: string) {
    super(404, message ?? "Not Found");
  }
}

export class UnAuthorizedException<T> extends ErrorSchema<T> {
  constructor(message?: string) {
    super(
      401,
      message ?? "Unauthorised Access",
      "You are not authorised to access this resource"
    );
  }
}
