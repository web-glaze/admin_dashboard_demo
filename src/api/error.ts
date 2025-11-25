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

async function exceptionHandler<T>(response?: Response): Promise<IResponse<T>> {
  if (!response || response === undefined) {
    throw new FetchDataException();
  }

  const jsonResponse = await response.json();

  switch (true) {
    case response.ok:
      return jsonResponse;
    case response.status === 401 || response.status === 403:
      handleUnauthorizedException();
      throw new UnAuthorizedException(jsonResponse?.message);
    case response.status === 400:
      throw new BadRequestException(jsonResponse?.message?.toString());
    case response.status === 404:
      throw new NotFoundException(jsonResponse?.message);
    case response.status === 500:
      throw new InternalServerException(jsonResponse?.message);
    default:
      throw new ErrorSchema(
        response.status,
        jsonResponse?.message,
        jsonResponse?.message ?? "Something Went Wrong"
      );
  }
}

async function handleUnauthorizedException() {
  const isServer = typeof window === "undefined";

  if (!isServer) {
    window.location.reload();
  }
}

export async function responseHandler<T>(
  response: Response
): Promise<IResponse<T>> {
  try {
    return await exceptionHandler<T>(response);
  } catch (error) {
    console.error("An error occurred:", error);
    throw error as ErrorSchema<T>;
  }
}

// Helper function to check if response is successful
export function isSuccessResponse<T>(
  response: IResponse<T>
): response is IResponse<T> & { data: T } {
  return !response.error && response.data !== undefined;
}

// Helper function to extract error messages from the response or error
export function getErrorMessage<T>(
  responseOrError: IResponse<T> | ErrorSchema<T>
): string {
  if ("error" in responseOrError && responseOrError.error) {
    return (
      responseOrError.error.displayMessage || responseOrError.error.message
    );
  }

  if (responseOrError instanceof ErrorSchema) {
    return (
      responseOrError.error.displayMessage || responseOrError.error.message
    );
  }

  if ("errors" in responseOrError && responseOrError.errors) {
    // Handle validation errors
    const errorMessages = Object.entries(responseOrError.errors)
      .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
      .join("; ");
    return errorMessages;
  }

  return "An unexpected error occurred";
}

// Helper function to check if response has validation errors
export function hasValidationErrors<T>(response: IResponse<T>): boolean {
  return !!(response.errors && Object.keys(response.errors).length > 0);
}

// Helper function to get field-specific errors
export function getFieldErrors<T>(response: IResponse<T>): {
  [key: string]: string[];
} {
  return response.errors || {};
}
