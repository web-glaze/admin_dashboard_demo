export interface ErrorResponse {
  code: number;
  message: string;
  displayMessage?: string;
  issues?: { [key: string]: string };
}

export interface IResponse<Res> {
  data?: Res;
  error?: ErrorResponse;
  totalCount?: number;
  errors?: {
    [key: string]: string[];
  };
}

export interface ErrorResponseSchema {
  error?: ErrorResponse;
}

// Extended response type that includes success and message for internal use
export interface ApiResponse<T> extends IResponse<T> {
  success: boolean;
  message: string;
}

// Type guard to check if response is ApiResponse
export function isApiResponse<T>(response: any): response is ApiResponse<T> {
  return (
    typeof response === "object" &&
    response !== null &&
    "success" in response &&
    "message" in response
  );
}
