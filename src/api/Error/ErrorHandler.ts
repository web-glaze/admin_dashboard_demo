import {
  BadRequestException,
  ErrorSchema,
  FetchDataException,
  InternalServerException,
  NotFoundException,
  UnAuthorizedException,
} from "./BaseError";
import { IResponse as CustomResponse } from "@/types/responseError";
import { removeUserToken } from "@/helpers";
// import deleteCookie from "@/app/actions";
async function exceptionHandler<T>(
  response?: Response
): Promise<CustomResponse<T>> {
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
      throw new BadRequestException(jsonResponse?.message.toString());
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

  //   if (isServer) {
  //     return deleteCookie();
  //   }
  removeUserToken();
  window.location.reload();
}

export async function responseHandler<T>(response: Response) {
  try {
    return await exceptionHandler<T>(response);
  } catch (error) {
    console.error("An error occurred:", error);
    throw error as ErrorSchema<T>;
  }
}
